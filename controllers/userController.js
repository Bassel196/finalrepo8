const User = require("../models/users");
const Product = require("../models/product");
const passport = require("passport");
const Category = require("../models/category");
const { sendOtp, getOtpForm } = require("../middleware/otp");

module.exports = {
  userRegister: (req, res, next) => {
    if (req.body.password === req.body.confirmedPassword) {
      User.register(
        {
          name: req.body.name,
          email: req.body.email,
        },
        req.body.password,
        async function (err, user) {
          if (err) {
            console.log(err);
            req.flash("message", "User Already registered");
            res.redirect("/register");
          } else {
            passport.authenticate("local")(req, res, function () {
              // process.nextTick(async () => {
              //   await sendOtp(req, res);
              // });
              res.redirect("/");
            });
          }
        }
      );
    } else {
      req.flash("message", "password doesn't match");
      res.redirect("/register");
    }
  },

  userLogin: passport.authenticate("local", {
    failureFlash: true,
    keepSessionInfo: true,
    failureRedirect: "/login",
  }),

  userLogout: (req, res) => {
    req.logout(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  },

};
