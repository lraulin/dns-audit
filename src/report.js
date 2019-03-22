/**
 * Module to generate human-readable report on DNS record changes.
 */

const { runATime, runBTime, domainIdLookup } = require("./dbCollections");

// Return text as close to centered as possible surrounded by spaces in a string
// that is exactly 80 chars long followed by a newline.
const centerText = (text, fillerChar = " ") => {
  const fillerLength = Math.floor((80 - text.length) / 2);
  const filler = fillerChar.repeat(fillerLength);
  return (filler + text + filler).padEnd(80) + "\n";
};

const headingTitle = text => centerText(text, "-");

module.exports.createMessage = (conflicts, mismatchRecords) => {
  const title = "DNS Discrepancy Monitoring";
  const bar = "=".repeat(80) + "\n";
  const header = bar + centerText(title) + bar;
  let message =
    header +
    "Comparing last two batch dig queries initiated at:\n" +
    `  ${runATime}\n  ${runBTime}\n\n`;

  // Get count of additions, deletions, and changes per domain
  const counts = {};
  conflicts.forEach(conflict => {
    if (!counts[conflict.domain]) counts[conflict.domain] = {};
    if (!counts[conflict.domain][conflict.type])
      counts[conflict.domain][conflict.type] = {};
    if (!counts[conflict.domain][conflict.type][conflict.changeType]) {
      counts[conflict.domain][conflict.type][conflict.changeType] = 1;
    } else {
      counts[conflict.domain][conflict.type][conflict.changeType]++;
    }
  });
  console.log(counts);

  // ************************ Summary ************************ \\
  message += headingTitle("SUMMARY");

  const numberOfDomains = Object.keys(counts).length;

  // List affected domains and summary of changes
  // Ex. 4 total changes in 3 domains:
  message += `${
    mismatchRecords.length
  } total changes in ${numberOfDomains} domain${
    numberOfDomains > 1 ? "s" : ""
  }:\n`;
  Object.keys(counts).forEach(domain => {
    message += `  ${domain}    `;
    Object.keys(counts[domain]).forEach(type => {
      let sep = false;
      Object.keys(counts[domain][type]).forEach(changeType => {
        const num = counts[domain][type][changeType];
        if (sep) message += ", ";
        message += `${num} ${type} ${changeType}${num > 1 ? "s" : ""}`;
        sep = true;
      });
    });
    message += "\n";
  });
  message += "\n";

  const noRecordMsg = ">> NO RECORD <<";

  // ************************ Diffs ************************ \\
  message += headingTitle("DIFFS");
  // Show diff lines
  let currentDomain = "";
  let sepNeeded = false;
  conflicts.forEach(conflict => {
    if (currentDomain !== conflict.domain && sepNeeded)
      message += "-".repeat(80) + "\n";
    currentDomain = conflict.domain;
    message +=
      `${conflict.domain}: ${conflict.changeType.toUpperCase()}\n` +
      `  ${conflict.whenLineA}\n` +
      `  ${conflict.digLineA || noRecordMsg} \n` +
      `  ${conflict.whenLineB}\n` +
      `  ${conflict.digLineB || noRecordMsg}\n\n`;
    sepNeeded = true;
  });

  // ************************ Full Raw Dig ************************ \\
  // Show before and after full raw dig output
  const showFullDig = false; // for testing

  if (showFullDig) {
    message += headingTitle("FULL DIG OUTPUT");
    mismatchRecords.forEach(row => {
      [" BEFORE", " AFTER"].forEach(time => {
        message += bar + centerText(domainIdLookup[row.domain_id] + time) + bar;
        message += time === " BEFORE" ? row.raw_A : row.raw_B;
      });
    });
  }

  return message;
};
