const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Category = require("../models/category");
const User = require("../models/users");

function generateOtp() {
  let otp = Math.floor(100000 + Math.random() * 900000);
  console.log("Generated otp:" + otp);
  return otp;
}


function hideEmail(target) {
  let email = target;
  let hiddenEmail = "";
  for (i = 0; i < email.length; i++) {
    if (i > 2 && i < email.indexOf("@")) {
      hiddenEmail += "*";
    } else {
      hiddenEmail += email[i];
    }
  }
  return hiddenEmail;
}

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 456,
  secure: true,
  service: "Gmail",

  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
