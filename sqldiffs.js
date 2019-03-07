const sqlite3 = require("sqlite3").verbose();

const database = (() => {
  const insertQueue = [];
  let db;
  return {
    open() {
      db = new sqlite3.Database("./diglogs.db", err => {
        if (err) {
          console.error(err.message);
        }
        console.log("Connected to the database.");
      });
    },
    close() {
      db.close(err => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Close the database connection.");
      });
    },
    saveRecord(values) {
      db.run(
        "INSERT INTO records (queried_at, datetime, domain, type, answers) VALUES(?, ?, ?, ?, ?)",
        values,
        err => {
          if (err) {
            return console.log(err.message);
          }
          // get the last insert id
          console.log(`A row has been inserted with rowid ${this.lastID}`);
        }
      );
    },
    insertAll(records) {
      const created_at = new Date().getTime();
      this.open();
      for (record of records) {
        this.saveRecord([created_at, ...record]);
      }
      this.close();
    },
    async findDiffs() {
      this.open();
      db.all(
        `SELECT queried_at, datetime, domain, type, answers FROM records`,
        [],
        (err, rows) => {
          if (err) console.log(err);
          console.log(rows);
        }
      );
      this.close();
      return rows;
    }
  };
})();

module.exports = database;

if (require.main === module) {
  database.findDiffs();
}
