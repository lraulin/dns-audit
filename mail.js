const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "leeraulin@live.com",
    pass: require("./secrets")
  }
});

const mailOptions = {
  from: "leeraulin@gmail.com",
  to: "leeraulin@live.com",
  subject: "Sending Email using Node.js",
  text: "That was easy!"
};

transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
