"use strict";
const Database = require("better-sqlite3");

let db = new Database("./diglogs.db");

const getDiffs = db.transaction(() => {
  db.prepare("DROP TABLE IF EXISTS a;").run();
  db.prepare("DROP TABLE IF EXISTS b;").run();
  db.prepare(
    "CREATE TEMP TABLE b AS SELECT queried_at, datetime, domain, type, answers FROM records WHERE queried_at = ( SELECT MAX(queried_at) FROM records );"
  ).run();
  db.prepare(
    "CREATE TEMP TABLE a AS SELECT queried_at, datetime, domain, type, answers FROM records WHERE queried_at = ( SELECT MAX(queried_at) FROM records WHERE queried_at NOT IN ( SELECT MAX(queried_at) FROM records ) );"
  ).run();

  const mismatches = db
    .prepare(
      `SELECT a.queried_at AS a_queried_at, b.queried_at AS b_queried_at, a.domain, a.type, a.datetime AS a_datetime, a.answers AS a_answers, b.datetime AS b_datetime, b.answers AS second_vals
      FROM a 
      INNER JOIN b ON a.domain = b.domain AND a.type = b.type
      WHERE a.answers <> b.answers;`
    )
    .all();

  const aNotB = db
    .prepare(
      `SELECT a.queried_at AS first_runtime, a.domain, a.type, a.datetime AS first_dt, a.answers AS first_vals
    FROM a 
    WHERE a.type NOT IN 
    (SELECT b.type FROM b WHERE a.domain = b.domain);`
    )
    .all();

  const bNotA = db
    .prepare(
      `SELECT b.queried_at AS second_runtime, b.domain, b.type, b.datetime AS second_dt, b.answers AS second_vals
    FROM b 
    WHERE b.type NOT IN 
    (SELECT a.type FROM a WHERE a.domain = b.domain);`
    )
    .all();

  const allRows = [...mismatches, ...aNotB, ...bNotA];
  console.log(allRows);
  return allRows;
});

module.exports = { getDiffs };
