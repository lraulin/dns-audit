const fs = require("fs");
const { exec } = require("child_process");

const write = (obj, file) => {
  // Save input to file as json if object or text if string.
  const text = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
  const stream = fs.createWriteStream(file, { flags: "w" });
  stream.write(text);
  stream.end();
};

const email = ({
  subject = "This is a test",
  body = "Test message",
  to = ["amanda.evans.ctr@dot.gov"]
}) => {
  // Send email with Unix mailx. Assumes Sendmail or Postfix is configured.
  exec(
    `mail -s '${subject}' ${to.join(" ")} <<< '${body}'`,
    (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
};

module.exports = { write, email };
