const express = require("express");
const router = express.Router();
const User = require("../models/users");
const passport = require("passport");
const Category = require("../models/category");
const userControl = require("../controllers/userController");
const shopControl = require("../controllers/shopController");
const authentication = require("../middleware/authentication");



router.get(
  "/",
  authentication.checkAccountVerifiedInIndex,
  shopControl.getHome
);
router.get(
  "/shop/category/:category/:page",
  authentication.checkAccountVerifiedInIndex,
  shopControl.getShopByCategory
);
router.get(
  "/shop/:page",
  authentication.checkAccountVerifiedInIndex,
  shopControl.getAllProducts
);
router.get(
  "/product/:id",
  authentication.checkAccountVerifiedInIndex,
  shopControl.getProductById
);
router.get(
  "/search/:page",
  authentication.checkAccountVerifiedInIndex,
  shopControl.getProductByKeyword
);
router.get(
  "/contact",
  authentication.checkAccountVerifiedInIndex,
  async (req, res) => {
    const allCategories = await Category.find();
    res.render("master/contact", {
      allCategories: allCategories,
    });
  }
);

router.get("/login", authentication.checkLoggedOut, async (req, res) => {
  const allCategories = await Category.find();
  const errorMessage = req.flash("error");
  res.render("master/login", {
    errorMessage: errorMessage,
    allCategories: allCategories,
  });
});
router.get("/register", authentication.checkLoggedOut, async (req, res) => {
  const errorMessage = req.flash("message");
  const allCategories = await Category.find();
  res.render("master/register", {
    errorMessage: errorMessage,
    allCategories: allCategories,
  });
});

router.get(
  "/forgetPassword",
  authentication.checkLoggedOut,
  async (req, res) => {
    const allCategories = await Category.find();
    res.render("master/forgetPassword", { allCategories });
  }
);

router.get(
  "/reset/:email/password/:id",
  authentication.checkLoggedOut,
  async (req, res) => {
    try {
      const errorMessage = req.flash("message");
      const email = req.params.email;
      const passwordResetId = req.params.id;
      const user = await User.findOne({ email });
      const allCategories = await Category.find();
      if (user.passwordResetId === passwordResetId) {
        res.render("master/resetPassword", {
          allCategories,
          email,
          errorMessage,
        });
      } else {
        res.render("errorPage/error", { layout: false });
      }
    } catch (err) {
      console.log(err);
      res.redirect("/error");
    }
  }
);

router.get("/error", (req, res) => {
  res.render("errorPage/error", { layout: false });
});

router.post("/autoFill", shopControl.autoFill);
router.post("/forgetPassword", shopControl.forgetPassword);


router.post("/login", userControl.userLogin, (req, res) => {
  if (req.user.isAdmin === true) {
    res.redirect("/admin");
  } else {
    res.redirect("/");
  }
});
router.post("/register", userControl.userRegister);

router.delete("/logout", userControl.userLogout);

module.exports = router;
