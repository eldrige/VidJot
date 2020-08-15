const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// user login route
router.get("/login", (req, res) => {
  res.send("login");
});

// reister form route
router.get("/register", (req, res) => {
  res.send("login");
});


module.exports = router