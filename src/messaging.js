"use strict";
/**
 * Module for sending email using Unix mail (mailx) command. Assumes an MTA
 * (mail transfer agent) like Postfix is configured, so running
 * `mail -s 'test' address@something.com` will successuflly send an email.
 */

const { exec } = require("child_process");
const { readFileSync } = require("fs");
const {
  insertIntoTblEmail,
  lastEmailTimestamp,
  selectFromTblReport,
} = require("./sqlite");
const { write } = require("./utils");

const MS_PER_DAY = 86400000;

// Read email list from config file
const getEmails = () =>
  readFileSync(require.resolve("../config/emails.txt"), "utf8").split("\n");

const email = ({
  subject = "This is a test",
  body = "Test message",
  to = ["amanda.evans.ctr@dot.gov"],
}) => {
  const fileName = `${__dirname}/email.txt`;
  write(body, fileName);
  // Send email with Unix mailx. Assumes Sendmail or Postfix is configured.
  exec(
    `mail -v -s '${subject}' ${to.join(",")} < ${fileName}`,
    (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
    },
  );
};

const emailReport = body => {
  insertIntoTblEmail(body);
  email({
    subject: "DNS Log Discrepancy Report",
    body,
    to: getEmails(),
  });
};

const sendEmailIfTime = () => {
  const lastEmailTime = lastEmailTimestamp();
  console.log(
    `Last Email Sent At: ${new Date(lastEmailTime).toLocaleString()}`,
  );
  const daysSinceLastEmail =
    (new Date().getTime() - lastEmailTime) / MS_PER_DAY;
  const rows = selectFromTblReport(lastEmailTime);
  const message = rows.map(row => row.body).join("\n");
  console.log(`Days Since Last Email: ${daysSinceLastEmail}`);
  if (daysSinceLastEmail > 1) {
    emailReport(message);
  }
};

module.exports = { sendEmailIfTime };

if (require.main === module) {
  sendEmailIfTime();
}
