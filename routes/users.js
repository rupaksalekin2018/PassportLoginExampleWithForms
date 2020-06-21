const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//User Model
const User = require("../models/User");

//login Page
router.get("/login", (req, res) => res.render("login"));

//Register Page
router.get("/register", (req, res) => res.render("register"));

//Register Handle
router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];

  //Check Required Fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please Fill All The Fields" });
  }

  //Check Passwords Match
  if (password != password2) {
    errors.push({ msg: "Passwords Do Not Match" });
  }

  //Check pass length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else {
    // Validation Passed
    try {
      await User.findOne({ email: email }).then((user) => {
        if (user) {
          errors.push({ msg: "Email is already taken!" });
          res.render("register", { errors, name, email, password, password2 });
        } else {
          const newUser = new User({
            name,
            email,
            password,
            password2,
          });

          //Hash Password
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) {
                req.flash("error_msg", "Error! Please Try again");
                res.redirect("/users/register");
              }
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  req.flash(
                    "success_msg",
                    "You are now successfully registered and You can login!"
                  );
                  res.redirect("/users/login");
                })
                .catch((err) => console.log(err));
            })
          );
        }
      });
    } catch (err) {
      req.flash("error_msg", "Error! Please Try again");
      res.redirect("/users/register");
    }
  }
});

//login handle

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

router.get("/admin/login", (req, res) => res.render("adminlogin"));

router.post("/admin/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/admindashboard",
    failureRedirect: "/users/admin/login",
    failureFlash: true,
  })(req, res, next);
});

//logout handle
router.get("/admin/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged Out!");
  res.redirect("/users/admin/login");
});
module.exports = router;
