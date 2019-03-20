const { exec } = require("child_process");

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

module.exports.sendEmail = body =>
  email({
    subject: "DNS Log Discrepancy Report",
    body,
    to: getEmails(),
  });
