const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "sreekrishnahealing@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});
function sendMail(to, sub, msg) {
  transporter.sendMail({
    to: to,
    subject: sub,
    html: msg,
  });
  console.log("Email sent");
}

module.exports = sendMail;
