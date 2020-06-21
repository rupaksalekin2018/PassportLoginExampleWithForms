const LocalStrategy = require("passport-local").Strategy;

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

//Load User Model

const User = require("../models/User");
const Admin = require("../models/Admin");

const userCheck = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          return done(null, false, { message: "That email is not registered" });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
const adminCheck = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      (email, password, done) => {
        //Match User
        Admin.findOne({ email: email })
          .then((admin) => {
            if (!admin) {
              return done(null, false, {
                message: "That email is not registered!",
              });
            }

            //Match password
            bcrypt.compare(password, admin.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, admin);
              } else {
                return done(null, false, {
                  message: "Password Incorrect!",
                });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );
  passport.serializeUser(function (admin, done) {
    done(null, admin.id);
  });

  passport.deserializeUser(function (id, done) {
    Admin.findById(id, function (err, admin) {
      done(err, admin);
    });
  });
};

module.exports = { adminCheck, userCheck };
