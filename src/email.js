"use strict";
const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  name: "localhost",
});

const msg = ({ to = "leeraulin@gmail.com", subject = "test" }) => {
  // setup email data with unicode symbols
  let mailOptions = {
    to,
    subject, // plain text body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
  });
};

msg();
