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

  // Get count of additions, deletions, and changes per record type
  const counts = {};
  conflicts.forEach(conflict => {
    if (!counts[conflict.type]) counts[conflict.type] = {};
    if (!counts[conflict.type][conflict.changeType]) {
      counts[conflict.type][conflict.changeType] = 1;
    } else {
      counts[conflict.type][conflict.changeType]++;
    }
  });

  // ************************ Summary ************************ \\
  message += headingTitle("SUMMARY");

  let total = 0;

  // Display count of type of changes per record type
  Object.keys(counts).forEach(type => {
    message += `${type}: `.padEnd(9);
    let commaNeeded = false;
    Object.keys(counts[type]).forEach(changeType => {
      total += counts[type][changeType];
      const ending = counts[type][changeType] > 1 ? "s" : "";
      message += `${commaNeeded ? ", " : ""}${
        counts[type][changeType]
      } ${changeType}${ending}\n`;
      commaNeeded = true;
    });
  });
  message += "\n";

  // List affected domains
  const affectedDomains = mismatchRecords.length;
  message += `${total} total changes in ${affectedDomains} domain${
    affectedDomains > 1 ? "s" : ""
  }:\n`;
  mismatchRecords
    .map(row => domainIdLookup[row.domain_id])
    .forEach(domain => (message += `  ${domain}\n`));
  message += "\n";

  const noRecordMsg = ">> NO RECORD <<";

  // ************************ Diffs ************************ \\
  message += headingTitle("DIFFS");
  // Show diff lines
  conflicts.forEach(conflict => {
    message +=
      `${conflict.domain}: ${conflict.changeType.toUpperCase()}\n` +
      `  ${conflict.whenLineA}\n` +
      `  ${conflict.digLineA || noRecordMsg} \n` +
      `  ${conflict.whenLineB}\n` +
      `  ${conflict.digLineB || noRecordMsg}\n\n`;
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
