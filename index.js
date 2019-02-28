const fs = require("fs");
const dig = require("node-dig-dns");
const domains = require("./domainsList");
const jsonDiff = require("json-diff");

let data = {};
try {
  data = require("./logs");
} catch (e) {}
console.log(data);

const writeToFile = (obj, file) => {
  const text = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
  const stream = fs.createWriteStream(file, { flags: "w" });
  stream.write(text);
  stream.end();
};

const getRecords = async () => {
  for (domain of domains) {
    try {
      if (!data[domain]) data[domain] = [];
      data[domain].push(await dig([domain, "ANY"]));
    } catch (e) {
      console.log(e);
    }
  }
  writeToFile(data, "./logs.json");
};

const compareRecords = () => {
  for (domain in data) {
    const header =
      "=============================================================\n" +
      `DOMAIN: ${domain}\n` +
      "=============================================================\n";
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
  compareRecords();
}
