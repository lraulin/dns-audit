"use strict";

const dig = require("node-dig-dns");
const { email } = require("./utils");
const Database = require("better-sqlite3");
const recipients = require("./recipients");

const db = new Database("data.db");

// Make sure connection will be closed regardless of how script terminates.
process.on("exit", () => db.close());
process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));

const [TARGET_TYPES, typeIdLookup] = (() => {
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
  `INSERT INTO tbl_record (run_id, record_timestamp, domain_id, type_id, record_values) VALUES (?, ?, ?, ?, ?);`
);

const insertIntoTblRecord = ({
  runId,
  recordTimestamp,
  domainId,
  typeId,
  values
}) =>
  sqlInsertIntoTblRecord.run(runId, recordTimestamp, domainId, typeId, values)
    .lastInsertRowid;

const getDomainRecords = async (runId, domain) => {
  try {
    const records = [];
    // Execute dig command.
    const res = await dig(["127.0.0.1", domain, "ANY"]);
    if (Array.isArray(res.answer)) {
      // Filter list to contain only desired record types. (A, NS, etc)
      const answers = res.answer.filter(answer => {
        return TARGET_TYPES.includes(answer.type);
      });
      // If there are any records of the desired type
      if (answers.length) {
        const valueMap = {};
        for (let answer of answers) {
          if (!valueMap[answer.type]) valueMap[answer.type] = [];
          valueMap[answer.type].push(answer.value);
        }
        for (let recordType in valueMap) {
          // Create a record for each record type
          const recordId = insertIntoTblRecord({
            runId: runId,
            domainId: domainIdLookup[domain],
            recordTimestamp:
              new Date(res.datetime).toISOString().split(".")[0] + "Z",
            typeId: typeIdLookup[recordType],
            values: valueMap[recordType].sort().join(" ")
          });
        }
      }
    }
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

const findMismatches = () => {
  const sqlCreateTempTables = [
    "DROP TABLE IF EXISTS temp.a;",
    "CREATE TEMP TABLE a AS SELECT record_timestamp, domain_id, type_id, record_values FROM tbl_record WHERE run_id = ( SELECT MAX(run_id) FROM tbl_record WHERE run_id NOT IN ( SELECT MAX(run_id) FROM tbl_record ) );",
    "DROP TABLE IF EXISTS temp.b;",
    "CREATE TEMP TABLE b AS SELECT record_timestamp, domain_id, type_id, record_values FROM tbl_record WHERE run_id = (SELECT MAX(run_id) FROM tbl_record );"
  ];
  const sqlGetMismatches =
    "SELECT a.domain_id, a.type_id, a.record_timestamp AS timestamp_A, a.record_values AS values_A, b.record_timestamp AS timestamp_B, b.record_values AS values_B FROM a INNER JOIN b on a.domain_id = b.domain_id AND a.type_id = b.type_id WHERE values_A <> values_B;";
  const rows = db.transaction(() => {
    sqlCreateTempTables.forEach(s => db.prepare(s).run());
    return db.prepare(sqlGetMismatches).all();
  })();
  if (rows.length) {
    let message = "";
    for (let row of rows) {
      message +=
        `Discrepancy in ${typeIdLookup[row.type_id]} record(s) for ${
          domainIdLookup[row.domain_id]
        }:\n` +
        `  ${row.timestamp_A}    ${row.values_A}\n` +
        `  ${row.timestamp_B}    ${row.values_B}\n\n`;
    }
    console.log(message);
    email({
      subject: "DNS Log Discrepancy Report",
      body: message,
      to: recipients
    });
  }
};

findMismatches();
