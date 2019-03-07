import fs from "fs";
import dig from "node-dig-dns";
import * as nonFaaDomains from "./nonFaaDomains.json";
import jsonDiff from "json-diff";
import chalk from "chalk";
import db from "./sqldiffs";

const domains: string[] = nonFaaDomains;

const targetTypes = ["A", "NS", "AAAA", "MX", "SOA", "CNAME"];

let data = {};
try {
  data = require("./logs");
} catch (e) {}

const writeToFile = (obj, file) => {
  const text = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
  const stream = fs.createWriteStream(file, { flags: "w" });
  stream.write(text);
  stream.end();
};

const cleanRecords = () => {
  // Delete all records older than 24 hours.
  const unixtc = Date.now();
  for (domain in domains) {
    data[domain] = data[domain].filter(
      record =>
        unixtc - new Date(record.datetime).getTime() < 24 * 60 * 60 * 1000
    );
  }
  writeToFile(data, "logs.json");
};

const getRecords = async type => {
  const valuesToInsert = [];
  for (domain of domains) {
    try {
      const res = await dig(["127.0.0.1", domain, "ANY"]);

      if (Array.isArray(res.answer)) {
        const answers = res.answer.filter(answer => {
          return targetTypes.includes(answer.type);
        });
        if (answers.length) {
          const types = {};
          for (answer of answers) {
            if (!domainValues[answer.type]) domainValues[answer.type] = [];
            log[answer.type].push(answer.value);
            log[answer.type].sort();
            db.saveRecord(
              new Date(log.datetime).getTime(),
              domain,
              answer.type,
              log[answer.type].join(" ")
            );
          }
          if (!data[domain]) data[domain] = [];
          data[domain].push(log);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  writeToFile(data, "./logs.json");
};

const logAndSave = discreptencies => {
  let diffsLog = new Date().toISOString() + "\n\n";
  const header =
    "================================================================================\n" +
    `DOMAIN: ${domain}\n` +
    "================================================================================\n";
};

const compareRecords = () => {
  const discreptencies = [];

  for (domain in data) {
    const len = data[domain].length;

    domainCount++;

    try {
      const recordA = data[domain][len - 2];
      const recordB = data[domain][len - 1];

      let headerFlag = false;

      for (type of targetTypes) {
        recordTypeCount++;
        if (!headerFlag) diffsLog += header;
        headerFlag = true;

        if (recordA && recordB && (recordA[type] || recordB[type])) {
          const valuesA = recordA[type]
            ? recordA[type].sort().join(" ")
            : "No record";
          const valuesB = recordB[type]
            ? recordB[type].sort().join(" ")
            : "No record";

          if (valuesA !== valuesB) {
            discreptencies.push({
              domain,
              type,
              oldDateTime: recordA.datetime,
              oldValues: valuesA,
              newDateTime: recordA.datetime,
              newValues: valuesB
            });
            recordTypeChangeCount++;
            const diffA = `${recordA.datetime}    ${type}    ${valuesA}`;
            const diffB = `${recordB.datetime}    ${type}    ${valuesB}`;

            console.log(header);
            console.log(chalk.redBright(diffA));
            console.log(chalk.greenBright(diffB));
            console.log();

            diffsLog += diffA + "\n" + diffB + "\n\n";
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  const changesText =
    `${recordTypeChangeCount} discreptencies out of ${recordTypeCount} record types\n` +
    `${domainChangeCount} of ${domainCount} domains\n`;
  diffsLog += changesText;

  const fileName = "diffsLog_" + new Date().toISOString() + ".txt";

  writeToFile(diffsLog, fileName);
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

const diffs = () => {
  for (domain in data) {
    const header =
      "================================================================================\n" +
      `DOMAIN: ${domain}\n` +
      "================================================================================\n";
    let report = "";
    const len = data[domain].length;
    if (len < 2) {
      console.log("Not enough records. Comparison is not possible");
      return;
    }

    const recordA = data[domain][len - 2];
    const recordB = data[domain][len - 1];

    console.log(jsonDiff.diffString(recordA, recordB));
  }
};

if (require.main === module) {
  getRecords();
  //compareRecords();
  //showAnswerTypes();
  cleanRecords();
}
