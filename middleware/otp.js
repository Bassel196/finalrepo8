const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Category = require("../models/category");
const User = require("../models/users");

function generateOtp() {
  let otp = Math.floor(100000 + Math.random() * 900000);
  console.log("Generated otp:" + otp);
  return otp;
}

