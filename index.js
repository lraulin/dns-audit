const fs = require("fs");
const dig = require("node-dig-dns");
const domains = require("./nonFaaDomains");
const jsonDiff = require("json-diff");
const chalk = require("chalk");
const db = require("./sqldiffs");
const bettersql = require("./bettersql");

const TARGET_TYPES = ["A", "NS", "AAAA", "MX", "SOA", "CNAME"];
const SEPARATOR =
  "================================================================================\n";

let data = {};
try {
  data = require("./logs");
} catch (e) {}

const sendEmail = () => {};

const writeToFile = (obj, file) => {
  const text = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
  const stream = fs.createWriteStream(file, { flags: "w" });
  stream.write(text);
  stream.end();
};

const cleanRecords = () => {
  // Delete all records older than 24 hours.
  const unixtc = Date.now();
  for (domain in data) {
    data[domain] = data[domain].filter(
      record =>
        unixtc - new Date(record.datetime).getTime() < 24 * 60 * 60 * 1000
    );
  }
  writeToFile(data, "logs.json");
};

const digDomain = async domain => {
  try {
    const records = [];
    // Execute dig command.
    const res = await dig(["127.0.0.1", domain, "ANY"]);
    // Convert datetime to UTC timestamp for easier comparison.
    const datetime = new Date(res.datetime).toString();

    if (Array.isArray(res.answer)) {
      // Filter list to contain only desired record types. (A, NS, etc)
      const answers = res.answer.filter(answer => {
        return TARGET_TYPES.includes(answer.type);
      });
      if (answers.length) {
        const log = {};
        for (answer of answers) {
          if (!log[answer.type]) log[answer.type] = [];
          log[answer.type].push(answer.value);
        }

        for (type in log) {
          // combine all values for each type into a space-separated list
          const vals = log[type].sort().join(" ");
          const record = [datetime, domain, type, vals];
          console.log(record);
          records.push(record);
        }
      }
    }
    return records;
  } catch (e) {
    console.log(e);
  }
};

const getRecords = async type => {
  let valuesToInsert = [];
  for (domain of domains) {
    console.log(`Running dig for ${domain}...`);
    try {
      const newvalues = await digDomain(domain);
      valuesToInsert = [...valuesToInsert, ...newvalues];
    } catch (e) {
      console.log(e);
    }
  }
  saveRecordsToDb(valuesToInsert);
  saveRecordsToJson(valuesToInsert);
  return valuesToInsert;
};

const saveRecordsToJson = values => {
  writeToFile(values, "valuesToInsert.json");
};

const saveRecordsToDb = values => {
  db.insertAll(values);
};

const logAndSave = discreptencies => {
  let diffsLog = new Date().toISOString() + "\n\n";
  const header =
    "================================================================================\n" +
    `DOMAIN: ${domain}\n` +
    "================================================================================\n";
};

const createSummary = () => {
  const dateToIso = dt => new Date(dt).toISOString();
  const rows = bettersql.getDiffs();
  rows.sort((a, b) => a.domain.localeCompare(b.domain));
  let summary = "";
  let previousDomain = null;

  for (row of rows) {
    const dateA = row.first_dt ? dateToIso(row.first_dt) : "No Record";
    const dateB = row.second_dt ? dateToIso(row.second_dt) : "";
    const valA = row.first_vals ? row.first_vals : "";
    const valB = row.second_vals ? row.second_vals : "";

    // Add separator and domain header if current domain is different from previous.
    if (previousDomain !== row.domain) {
      summary += "\n\n" + SEPARATOR + row.domain + "\n" + SEPARATOR;
    }

    summary += `${row.type}    ${dateA}  ${valA}    ${dateB}  ${valB}\n`;
    previousDomain = row.domain;
  }

  console.log(summary);
};

const showAnswerTypes = () => {
  for (domain in data) {
    try {
      const types1 = [];
      const types2 = [];
      const answers1 = data[domain][data[domain].length - 2].answer;
      const answers2 = data[domain][data[domain].length - 1].answer;

      let n = Math.max(answers1.length, answers2.length);

      for (let i = 0; i < n; i++) {
        if (answers1[i]) types1.push(answers1[i].type);
        if (answers2[i]) types2.push(answers2[i].type);
      }

      console.log(domain + chalk.redBright(types1.join(" ")));
      console.log(domain + chalk.greenBright(types2.join(" ")));
    } catch (e) {}
  }
};

if (require.main === module) {
  //getRecords();
  //compareRecords();
  //showAnswerTypes();
  //cleanRecords();
  createSummary();
}
