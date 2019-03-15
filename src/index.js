"use strict";

const dig = require("node-dig-dns");
const stringify = require("json-stable-stringify");
const Database = require("better-sqlite3");
const { email } = require("./utils");
const recipients = require("./recipients");

const db = new Database(`${__dirname}/data.db`);

// Make sure connection will be closed regardless of how script terminates.
process.on("exit", () => db.close());
process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));

const [types, typeIdLookup] = (() => {
  // Object for two-way mapping between types and ids
  const idMap = {};
  const types = [];
  const rows = db.prepare(`SELECT type_id, type_name FROM tbl_type`).all();

  for (let row of rows) {
    idMap[row.type_id] = row.type_name;
    idMap[row.type_name] = row.type_id;
    types.push(row.type_name);
  }
  return [types, idMap];
})();

const [domains, domainIdLookup] = (() => {
  const idLookup = {};
  const domainList = [];
  const rows = db
    .prepare(`SELECT domain_id, domain_name FROM tbl_domain;`)
    .all();
  for (let row of rows) {
    idLookup[row.domain_id] = row.domain_name;
    idLookup[row.domain_name] = row.domain_id;
    domainList.push(row.domain_name);
  }
  return [domainList, idLookup];
})();

const insertIntoTblRunDatetime = epoch =>
  db
    .prepare(`INSERT INTO tbl_run_datetime (run_datetime) VALUES (${epoch});`)
    .run().lastInsertRowid;

const sqlInsertIntoTblRecord = db.prepare(
  `INSERT INTO tbl_record (run_id, domain_id, record_values, raw) VALUES (?, ?, ?, ?);`
);

const insertIntoTblRecord = ({ runId, domainId, records, raw }) =>
  sqlInsertIntoTblRecord.run(runId, domainId, records, raw).lastInsertRowid;

const getLastTwoRunTimes = () => {
  const rows = db.prepare("SELECT run_datetime FROM ");
};

const parseDigForRecordValues = digOutput => {
  const lines = digOutput.split("\n");
  const answers = {};
  let inAnswerSection = false;
  for (let line of lines) {
    if (inAnswerSection) {
      if (line === "") break;
      else {
        const answer = line.split(/\s/);
        const recordType = answer[3];
        const value = answer[4];
        if (types.includes(recordType)) {
          if (!answers[recordType]) answers[recordType] = [];
          answers[recordType].push(value);
        }
      }
    }
    if (line === ";; ANSWER SECTION:") inAnswerSection = true;
  }
  Object.values(answers).forEach(el => el.sort());
  return answers;
};

const getDomainRecords = async (runId, domain) => {
  try {
    const records = [];
    // Execute dig command.
    const raw = await dig(["152.120.225.240", domain, "ANY"], { raw: true });

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

const parseDigGetAnswers = digOutput => {
  const lines = digOutput.split("\n");
  let outputLines = [];

  let inAnswerSection = false;
  for (let line of lines) {
    if (line.includes("WHEN")) outputLines.push(line);
    if (inAnswerSection) {
      if (line === "") break;
      else {
        const answer = line.split(/\s/);
        const recordType = answer[3];
        const value = answer[4];
        if (types.includes(recordType)) {
          outputLines.push(line);
        }
      }
    }
    if (line === ";; ANSWER SECTION:") inAnswerSection = true;
  }
  if (outputLines.length === 1)
    outputLines.push("[No records of target types found]");
  return outputLines.join("\n");
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

  if (rows.length) {
    let message = "";
    for (let row of rows) {
      message +=
        "==============================================================\n" +
        domainIdLookup[row.domain_id] +
        ":\n";
      const values_A = JSON.parse(row.values_A);
      const values_B = JSON.parse(row.values_B);

      const allTypes = new Set(
        Object.keys(values_A).concat(Object.keys(values_B).sort())
      );

      for (let type of allTypes) {
        if (!values_A[type]) values_A[type] = [];
        if (!values_B[type]) values_B[type] = [];

        if (values_A[type].join(" ") !== values_B[type].join(" ")) {
          const uniqueA = values_A[type].filter(
            e => values_B[type] && !values_B[type].includes(e)
          );
          const uniqueB = values_B[type].filter(
            e => values_A[type] && !values_A[type].includes(e)
          );
          const changeCount = {
            added:
              uniqueB.length > uniqueA.length
                ? uniqueB.length - uniqueA.length
                : 0,
            deleted:
              uniqueA.length > uniqueB.length
                ? uniqueA.length - uniqueB.length
                : 0,
            changed: Math.min(uniqueA.length, uniqueB.length)
          };
          for (let key in changeCount) {
            if (changeCount[key])
              message += `   ${changeCount[key]} ${type} record${
                changeCount[key] > 1 ? "s" : ""
              } ${key}\n`;
          }
        }
      }
      message += "\n";
      message += parseDigGetAnswers(row.raw_A) + "\n\n";
      message += parseDigGetAnswers(row.raw_B) + "\n\n";
    }
    if (message) {
      console.log(message);
    } else {
      console.log("No changes found.");
    }
    console.log(message);
    email({
      subject: "DNS Log Discrepancy Report",
      body: message,
      to: ["leeraulin@gmail.com", "amanda.evans.ctr@dot.gov"]
    });
  } else {
    console.log("\nNo discrepancies found.");
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
