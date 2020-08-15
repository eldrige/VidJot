const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const passport = require('passport')

// load user model
require("../models/User");

const User = mongoose.model("users");

const router = express.Router();

// user login route
router.get("/login", (req, res) => {
  res.render("users/login");
});

// reister form route
router.get("/register", (req, res) => {
  res.render("users/register");
});

// Register form POST
router.post("/register", (req, res) => {
  // console.log(req.body);
  // res.send('register')

  // validation
  let errors = [];

  if (req.body.password !== req.body.password2) {
    errors.push({ text: "Passwords do not match" });
  }
  if (req.body.password.length < 7) {
    errors.push({ text: "password must be atleast seven characters" });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    });
  } else {
    // make sure there is no redundant emails

    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        req.flash("error_msg", "Email already exists");
        res.redirect("users/login");
      } else {  //else save user to the database
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        // console.log(newUser);
        // bcrypt encrupts a password with a hash

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // assign generated hash as new password
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                // req.flash("success_msg", "You are now registered and can log in");
                res.redirect("/users/register");
              })
              .catch((err) => {
                console.error(err);
                return;
              });
          });
        });
        // res.send("Passed");
      }
    });
  }
});

module.exports = router;
