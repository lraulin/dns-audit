"use strict";
/**
 * Module for interacting with sqlite database file.
 */

const fs = require("fs");
const Database = require("better-sqlite3");
const dir = require("./config").data_path;
const fullpath = dir + "data.db";
const initializeDatabase = require("./createDb");

const db = (() => {
  try {
    if (fs.existsSync(fullpath)) {
      return new Database(fullpath);
    } else {
      fs.mkdirSync(dir, { recursive: true });
      const db = new Database(fullpath);
      initializeDatabase(db);
      return db;
    }
  } catch (err) {
    console.error(err);
    console.log("Could not connect to database");
    process.exit();
  }
})();

// Make sure connection will be closed regardless of how script terminates.
process.on("exit", () => db.close());
process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));

// Get all records from table containing DNS record types of interest.
module.exports.selectAllFromTblType = () =>
  db.prepare(`SELECT type_id, type_name FROM tbl_type`).all();

// Get all records from table containing domains of interest.
module.exports.selectAllFromTblDomain = () =>
  db.prepare(`SELECT domain_id, domain_name FROM tbl_domain;`).all();

// Get last two rows from table containing run timestamps.
module.exports.selectLastTwoFromTblRunDatetime = () =>
  db
    .prepare(
      "SELECT run_datetime FROM tbl_run_datetime ORDER BY run_datetime DESC LIMIT 2",
    )
    .all();

// Insert Unix timestamp into table and return id of new row
module.exports.insertIntoTblRunDatetime = epoch =>
  db
    .prepare(`INSERT INTO tbl_run_datetime (run_datetime) VALUES (${epoch});`)
    .run().lastInsertRowid;

const sqlInsertIntoTblRecord = db.prepare(
  `INSERT INTO tbl_record (run_id, domain_id, record_values, raw) VALUES (?, ?, ?, ?);`,
);

// Insert row into record table and return new row id.
module.exports.insertIntoTblRecord = ({ runId, domainId, records, raw }) =>
  sqlInsertIntoTblRecord.run(runId, domainId, records, raw).lastInsertRowid;

// Query database for all records from last two runs where values don't match.
module.exports.getMismatches = () => {
  const sqlCreateTempTables = [
    "DROP TABLE IF EXISTS temp.a;",
    `CREATE TEMP TABLE a AS 
      SELECT record_id, domain_id, record_values, raw
      FROM tbl_record
      WHERE run_id =( 
        SELECT MAX(run_id) 
        FROM tbl_record 
        WHERE run_id NOT IN ( 
          SELECT MAX(run_id) 
          FROM tbl_record
        ) 
      );`,
    "DROP TABLE IF EXISTS temp.b;",
    `CREATE TEMP TABLE b AS 
      SELECT record_id, domain_id, record_values, raw 
      FROM tbl_record 
      WHERE run_id =( 
        SELECT MAX(run_id) 
        FROM tbl_record
      );`,
  ];
  const sqlGetMismatches =
    "SELECT a.domain_id, a.record_id AS record_id_a, a.record_values AS values_A, a.raw as raw_A, b.record_id AS record_id_b, b.record_values AS values_B, b.raw AS raw_B FROM a INNER JOIN b on a.domain_id = b.domain_id WHERE values_A <> values_B;";
  const rows = db.transaction(() => {
    sqlCreateTempTables.forEach(s => db.prepare(s).run());
    return db.prepare(sqlGetMismatches).all();
  })();
  return rows;
};

// Delete all records older than given number of hours.
module.exports.cleanUp = (hours = 24) => {
  const cutoffEpochMs = new Date().getTime() - hours * 60 * 60 * 1000;
  try {
    db.prepare(
      "DELETE FROM tbl_record WHERE run_id <( SELECT run_id FROM tbl_run_datetime WHERE run_datetime = ( SELECT MAX(run_datetime) FROM tbl_run_datetime WHERE run_datetime < ?) );",
    ).run(cutoffEpochMs);
  } catch (e) {
    console.log(e);
  }
};

// Store result of dig, including DNS record values of interest deterministically
// serialized (ie if keys and values are the same, the strings should be identical)
module.exports.insertIntoTblReport = ({ body, json }) =>
  db
    .prepare(
      `INSERT INTO tbl_report (created_at, body, json) VALUES (?, ?, ?);`,
    )
    .run(new Date().getTime(), body, json).lastInsertRowid;

// Store email contents and time sent in tbl_email
module.exports.insertIntoTblEmail = body => {
  const date = new Date();
  db
    .prepare(
      `INSERT INTO tbl_email (sent_at, sent_at_local, email_body) VALUES (?, ?, ?);`,
    )
    .run(date.getTime(), date.toLocaleString(), body).lastInsertRowid;
};

// Return the Unix timestamp for the most recent email.
module.exports.lastEmailTimestamp = () => {
  const row = db
    .prepare(
      "SELECT sent_at FROM tbl_email WHERE email_id = (SELECT MAX(email_id) FROM tbl_email)",
    )
    .get();
  return row && row.sent_at;
};

// Retrieve change summaries created after Unix timestamp.
module.exports.selectFromTblReport = time =>
  db.prepare("SELECT body FROM tbl_report WHERE created_at > ?").all(time);
