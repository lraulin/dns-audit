"use strict";
/**
 * Module for sending email using Unix mail (mailx) command. Assumes an MTA
 * (mail transfer agent) like Postfix is configured, so running
 * `mail -s 'test' address@something.com` will successuflly send an email.
 */

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
  const numRuns = rows.length;
  const summaryHeader = `Combined Report
  ${numRuns} 
  `;
  const message = rows.map(row => row.body).join("\n");

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
