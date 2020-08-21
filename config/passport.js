const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// load user model
require("../models/User")
const User = mongoose.model("users");


module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // console.log(email);
      //  Match user
      User.findOne({
        email: email, // check if theres a user with the email
      }).then((user) => {
        if (!user) {
          return done(null, false, { message: "No user found" });
        }
        // Match password
        // password - hashed, user.password = unhashed
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          // if passwords match
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password Incorrect" });
          }
        });
      });
    })
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user)
    })
  })
};
