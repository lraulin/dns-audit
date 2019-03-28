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

const MS_PER_DAY = 86400000;

const email = ({
  subject = "This is a test",
  body = "Test message",
  to = ["amanda.evans.ctr@dot.gov"],
}) => {
  const fileName = `${dir}/email.txt`;
  write(body, fileName);
  // Send email with Unix mailx. Assumes Sendmail or Postfix is configured.
  exec(
    `mail -v -s '${subject}' ${to.join(",")} < ${dir}`,
    (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      if (stdout) {
        console.log(stdout);
        return;
      }
      if (stderr) {
        console.log(stderr);
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
    to: emails,
  });
};

const sendEmailIfTime = () => {
  const lastEmailTime = lastEmailTimestamp();
  if (!lastEmailTime) {
    console.log("No previous emails...saving timestamp.");
    insertIntoTblEmail("N/A - First Run");
    return;
  }

  console.log(
    `Last Email Sent At: ${new Date(lastEmailTime).toLocaleString()}`,
  );
  const daysSinceLastEmail =
    (new Date().getTime() - lastEmailTime) / MS_PER_DAY;
  console.log(`Days Since Last Email: ${daysSinceLastEmail}`);
  if (daysSinceLastEmail > 1) {
    const message = rows.map(row => row.body).join("\n");
    const rows = selectFromTblReport(lastEmailTime);
    emailReport(message);
  }
};

module.exports = { sendEmailIfTime };

if (require.main === module) {
  sendEmailIfTime();
}
