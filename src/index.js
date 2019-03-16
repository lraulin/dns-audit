"use strict";

const { readFileSync } = require("fs");
const dig = require("node-dig-dns");
const stringify = require("json-stable-stringify");
const Database = require("better-sqlite3");
const { email, readFile } = require("./utils");

// IP for dig command
const server = "152.120.225.240";

// Read email list from config file
const emailList = readFileSync(
  require.resolve("../config/emails.txt"),
  "utf8"
).split("\n");

// Initialize sqlite3 database connection
const db = new Database(`${__dirname}/data.db`);

// Make sure connection will be closed regardless of how script terminates.
process.on("exit", () => db.close());
process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));

// Get DNS record types of interest from database
const [types, typeIdLookup] = (() => {
  // Object for two-way mapping between types and ids
  const idMap = {};
  const types = [];
  const rows = db.prepare(`SELECT type_id, type_name FROM tbl_type`).all();

  rows.forEach(row => {
    idMap[row.type_id] = row.type_name;
    idMap[row.type_name] = row.type_id;
    types.push(row.type_name);
  });

  return [types, idMap];
})();

// Create list of domains and two-way id-domain lookup object.
const [domains, domainIdLookup] = (() => {
  const idLookup = {};
  const domainList = [];
  const rows = db
    .prepare(`SELECT domain_id, domain_name FROM tbl_domain;`)
    .all();

  rows.forEach(row => {
    idLookup[row.domain_id] = row.domain_name;
    idLookup[row.domain_name] = row.domain_id;
    domainList.push(row.domain_name);
  });

  return [domainList, idLookup];
})();

// Insert Unix timestamp into table and return id of new row
const insertIntoTblRunDatetime = epoch =>
  db
    .prepare(`INSERT INTO tbl_run_datetime (run_datetime) VALUES (${epoch});`)
    .run().lastInsertRowid;

const sqlInsertIntoTblRecord = db.prepare(
  `INSERT INTO tbl_record (run_id, domain_id, record_values, raw) VALUES (?, ?, ?, ?);`
);

// Insert row into record table and return new row id.
const insertIntoTblRecord = ({ runId, domainId, records, raw }) =>
  sqlInsertIntoTblRecord.run(runId, domainId, records, raw).lastInsertRowid;

const [runATime, runBTime] = (() => {
  const rows = db
    .prepare(
      "SELECT run_datetime FROM tbl_run_datetime ORDER BY run_datetime DESC LIMIT 2"
    )
    .all();
  const runATime = new Date(rows[1].run_datetime);
  const runBTime = new Date(rows[0].run_datetime);
  return [runATime, runBTime];
})();

const digAnswerSection = digOutput =>
  digOutput.match(/(?<=;; ANSWER SECTION:\s+).*?(?=\s+\n)/gs)[0];

// Parse dig output and return object where key is record type
// and value is sorted list of values.
const parseDigForRecordValues = digOutput => {
  const answerSectionLines = digAnswerSection(digOutput).split("\n");
  const answers = {};
  answerRecords = answerSectionLines.forEach(line => {
    const parts = line.split(/\s/);
    const type = parts[3];
    const value = parts.slice(4).join(" ");
    if (!answers[type]) answers[type] = [];
    answers[type].push(value);
  });
  Object.values(answers).forEach(arr => arr.sort());
  return answers;
};

const digWhenLine = digOutput => digOutput.match(/;; WHEN: .*/)[0];

// E
const getDomainRecords = async (runId, domain) => {
  try {
    // Raw output of dig command.
    const raw = await dig([server, domain, "ANY"], { raw: true });

    insertIntoTblRecord({
      runId: runId,
      domainId: domainIdLookup[domain],
      records: stringify(parseDigForRecordValues(raw)),
      raw
    });
  } catch (e) {
    console.log(e);
  }
};

const getRecordsForAllDomains = async () => {
  try {
    const runEpoch = new Date().getTime();
    const runId = insertIntoTblRunDatetime(runEpoch);
    for (let domain of domains) {
      console.log(`Running dig for ${domain}...`);
      await getDomainRecords(runId, domain);
    }
  } catch (e) {
    console.log(e);
  }
};

const filterAnswers = answerSection =>
  answerSection
    .split("\n")
    .filter(line => types.includes(line.split(/\s/)[3]))
    .join("\n");

const rowMessage = row => {
  let message =
    "==============================================================\n" +
    domainIdLookup[row.domain_id] +
    ":\n";
  const values_A = JSON.parse(row.values_A);
  const values_B = JSON.parse(row.values_B);

  // Unique list of all record types present in either run.
  const allTypes = Array.from(
    new Set(Object.keys(values_A).concat(Object.keys(values_B).sort()))
  );

  allTypes.forEach(type => {
    if (!values_A[type]) values_A[type] = [];
    if (!values_B[type]) values_B[type] = [];

    // If values are not the same
    if (values_A[type].join(" ") !== values_B[type].join(" ")) {
      // Values in A not in B
      const uniqueA = values_A[type].filter(e => !values_B[type].includes(e));
      // Values in B not in a
      const uniqueB = values_B[type].filter(e => !values_A[type].includes(e));
      const changeCount = {
        added:
          uniqueA.length < uniqueB.length ? uniqueB.length - uniqueA.length : 0,
        deleted:
          uniqueA.length > uniqueB.length ? uniqueA.length - uniqueB.length : 0,
        changed: Math.min(uniqueA.length, uniqueB.length)
      };
      Object.keys(changeCount).forEach(key => {
        if (changeCount[key])
          message += `   ${changeCount[key]} ${type} record${
            changeCount[key] > 1 ? "s" : ""
          } ${key}\n`;
      });
    }
  });
  message += `\n${digWhenLine(row.raw_A)}\n${filterAnswers(
    digAnswerSection(row.raw_A)
  )}`;
  message += `\n\n${digWhenLine(row.raw_A)}\n${filterAnswers(
    digAnswerSection(row.raw_B)
  )}`;
  return message;
};

const createMessage = rows => {
  let message = `Comparing last two batch dig queries initiated at:
  ${runATime}
  ${runBTime}

`;

  message += rows.map((row, message) => rowMessage(row, message)).join("\n");
  return message;
};

const findMismatches = () => {
  const sqlCreateTempTables = [
    "DROP TABLE IF EXISTS temp.a;",
    "CREATE TEMP TABLE a AS SELECT domain_id, record_values, raw FROM tbl_record WHERE run_id =( SELECT MAX(run_id) FROM tbl_record WHERE run_id NOT IN ( SELECT MAX(run_id) FROM tbl_record) );",
    "DROP TABLE IF EXISTS temp.b;",
    "CREATE TEMP TABLE b AS SELECT domain_id, record_values, raw FROM tbl_record WHERE run_id =( SELECT MAX(run_id) FROM tbl_record);"
  ];
  const sqlGetMismatches =
    "SELECT a.domain_id, a.record_values AS values_A, a.raw as raw_A, b.record_values AS values_B, b.record_values AS timestamp_B, b.raw AS raw_B FROM a INNER JOIN b on a.domain_id = b.domain_id WHERE values_A <> values_B;";
  const rows = db.transaction(() => {
    sqlCreateTempTables.forEach(s => db.prepare(s).run());
    return db.prepare(sqlGetMismatches).all();
  })();

  const message = createMessage(rows);
  if (message) {
    console.log(message);
    email({
      subject: "DNS Log Discrepancy Report",
      body: message,
      to: emailList
    });
  } else {
    console.log("No changes found.");
  }
};

const cleanUp = () => {
  const hoursToKeep = 24;
  const cutoffEpochMs = new Date().getTime() - hoursToKeep * 60 * 60 * 1000;
  try {
    db.prepare(
      "DELETE FROM tbl_record WHERE run_id <( SELECT run_id FROM tbl_run_datetime WHERE run_datetime = ( SELECT MAX(run_datetime) FROM tbl_run_datetime WHERE run_datetime < ?) );"
    ).run(cutoffEpochMs);
  } catch (e) {
    console.log(e);
  }
};

const main = async () => {
  await getRecordsForAllDomains();
  findMismatches();
  //cleanUp();
};

main();
