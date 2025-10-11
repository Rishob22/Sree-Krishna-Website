require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const API_KEY = process.env.PUBLIC_SENDGRID_API_KEY;
sgMail.setApiKey(API_KEY);
async function sendMail(to, sub, msg) {
  const message = {
    to: to,
    from: process.env.BUSINESS_EMAIL,
    subject: sub,
    text: msg,
  };
  sgMail
    .send(message)
    .then(console.log("Email sent"))
    .catch((error) => console.log(error.message));
}

module.exports = sendMail;
