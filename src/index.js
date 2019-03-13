"use strict";

const dig = require("node-dig-dns");
const { email } = require("./utils");
const Database = require("better-sqlite3");
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
      records: JSON.stringify(parseDigForRecordValues(raw)),
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
          answers[recordType].push(line);
        }
      }
    }
    if (line === ";; ANSWER SECTION:") inAnswerSection = true;
  }
  return answers;
};

const unique = (arr1, arr2) => {
  const unique1 = arr1.filter(o => arr2.indexOf(o) === -1);
  const unique2 = arr2.filter(o => arr1.indexOf(o) === -1);
  return unique1.concat(unique2);
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
      message += domainIdLookup[row.domain_id] + ":\n";
      const values_A = JSON.parse(row.values_A);
      const values_B = JSON.parse(row.values_B);
      const answerLinesA = parseDigGetAnswers(row.raw_A);
      const answerLinesB = parseDigGetAnswers(row.raw_B);
      console.log(answerLinesA);
      console.log(answerLinesB);

      const allTypes = new Set(
        Object.keys(values_A).concat(Object.keys(values_B).sort())
      );
      console.log(allTypes);

      for (let type of allTypes) {
        if (!values_A[type]) values_A[type] = [];
        if (!values_B[type]) values_B[type] = [];

        if (values_A[type].join(" ") !== values_B[type].join(" ")) {
          const change = values_A[type].length - values_B[type].length;
          if (change > 0) {
            message += `${change} ${type} record${
              change > 1 ? "s" : ""
            } deleted\n`;
          } else if (change < 0) {
            message += `${Math.abs(change)} ${type} record${
              change < -1 ? "s" : ""
            } added\n`;
          }

          // message +=
          //   `${differenceType} in ${type} record(s) for ${
          //     domainIdLookup[row.domain_id]
          //   }:\n` +
          //   `  ${row.timestamp_A}    ${
          //     values_A[type] ? values_A[type].replace("|", " ") : "No records"
          //   }\n` +
          //   `  ${row.timestamp_B}    ${
          //     values_B[type] ? values_B[type].replace("|", " ") : "No records"
          //   }\n\n`;
        }
      }
      // message += "\n";
      // message += row.raw_A += "\n";
      // message += row.raw_B +=
      //   "\n\n==============================================================\n";
    }
    console.log(message);
    // console.log(message);
    // email({
    //   subject: "DNS Log Discrepancy Report",
    //   body: message,
    //   to: recipients
    // });
  } else {
    console.log("No discrepancies found.");
  }
};

getRecordsForAllDomains();
findMismatches();
