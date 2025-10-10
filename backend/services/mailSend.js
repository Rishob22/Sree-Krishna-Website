require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.BUSINESS_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});
async function sendMail(to, sub, msg) {
  const mailData = {
    from: process.env.BUSINESS_EMAIL,
    to: to,
    subject: sub,
    text: msg,
  };
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = sendMail;
