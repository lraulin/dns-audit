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
const { write } = require("./utils");
const emails = require("./config").emails;
const dir = require("./config").data_path;
const logger = require("./logger");

const MS_PER_DAY = 86400000;

const email = async ({
  subject = "This is a test",
  body = "Test message",
  to = ["amanda.evans.ctr@dot.gov"],
}) => {
  const fileName = `${dir}/email.txt`;
  await write(body, fileName);
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

const emailReport = body => {
  insertIntoTblEmail(body);
  email({
    subject: "DNS Log Discrepancy Report",
    body,
    to: emails,
  });
};

const sendEmailIfTime = arg => {
  const lastEmailTime = lastEmailTimestamp();
  if (!lastEmailTime) {
    logger.info("No previous emails...saving timestamp.");
    insertIntoTblEmail("N/A - First Run");
    return;
  }

  logger.info(
    `Last Email Sent At: ${new Date(lastEmailTime).toLocaleString()}`,
  );
  const daysSinceLastEmail =
    (new Date().getTime() - lastEmailTime) / MS_PER_DAY;
  logger.info(`Days Since Last Email: ${daysSinceLastEmail}`);
  if (daysSinceLastEmail > 1) {
    const rows = selectFromTblReport(lastEmailTime);
    const message = rows.map(row => row.body).join("\n");
    logger.info(message);
    emailReport(message);
  }
};

module.exports = { sendEmailIfTime };

if (require.main === module) {
  sendEmailIfTime();
}
