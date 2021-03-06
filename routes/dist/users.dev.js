"use strict";

var express = require("express");

var mongoose = require("mongoose");

var bcrypt = require("bcryptjs");

var passport = require("passport");

var router = express.Router(); // load user model

require("../models/User");

var User = mongoose.model("users"); // user login route

router.get("/login", function (req, res) {
  res.render("users/login");
}); // reister form route

router.get("/register", function (req, res) {
  res.render("users/register");
}); // Register form POST

router.post("/register", function (req, res) {
  // console.log(req.body);
  // res.send('register')
  // validation
  var errors = []; // check if passwords matches

  if (req.body.password !== req.body.password2) {
    errors.push({
      text: "Passwords do not match"
    });
  }

  if (req.body.password.length < 4) {
    errors.push({
      text: "password must be atleast four characters"
    });
  } // if error arrray contains errors
  // this re renders the form , with the already filled input


  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    // make sure there is no redundant emails
    User.findOne({
      email: req.body.email
    }).then(function (user) {
      if (user) {
        req.flash("error_msg", "Email already exists");
        res.redirect("users/register");
      } else {
        //else save user to the database
        var newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        }); // console.log(newUser);
        // bcrypt encrypts a password with a hash

        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) throw err; // assign generated hash as new password

            newUser.password = hash;
            newUser.save().then(function (user) {
              // req.flash("success_msg", "You are now registered and can log in");
              res.redirect("/users/login");
            })["catch"](function (err) {
              console.error(err);
              return;
            });
          });
        });
      }
    });
  }
}); // Login form POST
// the local is a strategy installed using npm i passport local

router.post("/login", function (req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
}); // Logout user

router.get("/logout", function (req, res) {
  req.logout(); // logout is built in. and it will log you out

  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});
module.exports = router;