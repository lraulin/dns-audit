const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  sendmail: true,
  newline: "unix",
  path: "/usr/sbin/sendmail"
});
transporter.sendMail(
  {
    from: "sender@example.com",
    to: "leeraulin@gmail.com",
    subject: "Message",
    text: "I hope this message gets delivered!"
  },
  (err, info) => {
    console.log(info.envelope);
    console.log(info.messageId);
  }
);
