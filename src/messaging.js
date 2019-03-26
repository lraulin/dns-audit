"use strict";

const { exec } = require("child_process");
const { readFileSync } = require("fs");
const { combinedReport } = require("./report");
const {
  insertIntoTblEmail,
  lastEmailTimestamp,
  selectFromTblReport,
} = require("./sqlite");

const MS_PER_DAY = 86400000;

// Read email list from config file
const getEmails = () =>
  readFileSync(require.resolve("../config/emails.txt"), "utf8").split("\n");

const email = ({
  subject = "This is a test",
  body = "Test message",
  to = ["amanda.evans.ctr@dot.gov"],
}) => {
  // Send email with Unix mailx. Assumes Sendmail or Postfix is configured.
  exec(
    `mail -s '${subject}' ${to.join(" ")} <<< '${body}'`,
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

module.exports.sendEmailIfTime = () => {
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
