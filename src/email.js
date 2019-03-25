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
  insertIntoTblEmail();
  email({
    subject: "DNS Log Discrepancy Report",
    body,
    to: getEmails(),
  });
};

module.exports.sendEmailIfTime = () => {
  const lastEmailTime = lastEmailTimestamp();
  const daysSinceLastEmail =
    (new Date().getTime() - lastEmailTime) / MS_PER_DAY;
  const message = selectFromTblReport(lastEmailTime)
    .map(row => row.body)
    .join("\n");
  if (daysSinceLastEmail > 1) {
    emailReport(message);
  }
};
