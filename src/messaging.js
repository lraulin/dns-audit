"use strict";
/**
 * Module for sending email using Unix mail (mailx) command. Assumes an MTA
 * (mail transfer agent) like Postfix is configured, so running
 * `mail -s 'test' address@something.com` will successuflly send an email.
 */

const columnify = require("columnify");
const { exec } = require("child_process");
const {
  insertIntoTblEmail,
  lastEmailTimestamp,
  selectFromTblReport,
} = require("./sqlite");
const { writeFile } = require("./utils");
const { emails, dev_emails } = require("./config");
const dir = require("./config").data_path;
const logger = require("./logger");

const MS_PER_DAY = 86400000;

const plural = num => (num === 1 ? "" : "s");

const email = async ({
  subject = "This is a test",
  body = "Test message",
  to = ["amanda.evans.ctr@dot.gov"],
}) => {
  const fileName = `${dir}email.txt`;
  await writeFile(fileName, body);
  // Send email with Unix mailx. Assumes Sendmail or Postfix is configured.
  const command = `mail -v -s '${subject}' ${to.join(",")} < ${fileName}`;
  logger.info(`Executing command: ${command}`);
  exec(command, (err, stdout, stderr) => {
    if (err) {
      logger.error(err);
      return;
    }
    if (stdout) {
      logger.info(stdout);
      return;
    }
    if (stderr) {
      logger.error(stderr);
      return;
    }
  });
};

const countChangesPerDomain = tblReportRows =>
  tblReportRows
    .map(row => JSON.parse(row.json))
    .reduce((a, c) => a.concat(c), [])
    .reduce((a, c) => {
      if (a[c.domain]) a[c.domain]++;
      else a[c.domain] = 1;
      return a;
    }, {});

const sendEmailIfTime = isTest => {
  const now = new Date();

  // Retrieve Unix timestamp when last email was sent.
  const lastEmailTime = lastEmailTimestamp();

  logger.info(
    `Last Email Sent At: ${new Date(lastEmailTime).toLocaleString()}`,
  );
  const daysSinceLastEmail = (now.getTime() - lastEmailTime) / MS_PER_DAY;
  logger.info(`Days Since Last Email: ${daysSinceLastEmail}`);

  const rows = selectFromTblReport(lastEmailTime);
  const numReports = rows.length;
  const firstReportTime = new Date(rows[0].created_at).toLocaleString();
  const lastReportTime = new Date(
    rows[rows.length - 1].created_at,
  ).toLocaleString();

  const title = `
================================================================================
|                       DNS MONITORING -- COMBINED REPORT                      |
================================================================================
`;
  let message = `${title}${numReports} report${plural(
    numReports,
  )} from ${firstReportTime} to ${lastReportTime}\n`;

  const changesPerDomain = countChangesPerDomain(rows);
  const totalDomains = Object.keys(changesPerDomain).length;
  const totalChanges = Object.values(changesPerDomain).reduce((a, c) => a + c);

  message += `${totalChanges} change${plural(
    totalChanges,
  )} in ${totalDomains} domain${plural(totalDomains)}\n`;
  message +=
    "\nDOMAIN                   COUNT    DOMAIN                   COUNT\n";
  const countTable = columnify(changesPerDomain, {
    columns: ["DOMAIN", "CHANGES"],
  })
    .split("\n")
    .slice(1);
  const breakPoint = Math.ceil(countTable.length / 2);
  for (let i = 0; i < breakPoint; i++) {
    message += countTable[i] + (countTable[i + breakPoint] || "") + "\n";
  }

  // Add combined reports to message
  message += "\n";
  rows.forEach((row, i) => {
    message += `Report ${i + 1} of ${rows.length}\n`;
    message += row.body + "\n";
  });

  if (isTest) {
    email({ subject: "Test Message", body: message, to: dev_emails });
  } else {
    email({ subject: "DNS Discrepancy Report", body: message, to: emails });
    insertIntoTblEmail();
  }
};

module.exports = { sendEmailIfTime };

if (require.main === module) {
  sendEmailIfTime();
}
