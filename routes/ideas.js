const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

// load Idea Model
require("../models/Idea");
// load model into a variable
const Idea = mongoose.model("ideas");

// idea index page, where data from db will be fetched and displayed
router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .lean()
    .sort({ date: "desc" })
    .then((ideas) => {
      res.render("ideas/index", {
        ideas: ideas,
      });
      console.log(ideas);
    });
  // find finds all of the ideas
  // lean converts the returnd data from mongo json to js json
});

// Add idea route (form)
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

// process form
router.post("/", ensureAuthenticated, (req, res) => {
  //  console.log(req.body);, thru the use of the body parser, req.body now contains the data from the form
  console.log(req.body.title, req.body.details);
  // some validation
  let errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }

  if (errors.length > 0) {
    res.render("/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    // create a new user having the ppties of the books
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id,
    };
    new Idea(newUser).save().then((idea) => res.redirect("/ideas"));
    // this enables it to be saved to our local mongoDB, then redirected to /ideas
  }
});

//  Make the form modifiable
// the id is just a placeholder (route param)
router.get("/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  })
    .lean()
    .then((idea) => {
      // so only a perculiar user can access hes particular videos
      if (idea.user != req.user.id) {
        req.flash("error_msg", "Not Authorized");
        res.redirect("/ideas");
      } else {
        res.render("/edit", {
          idea: idea,
        });
      }
    });
});

// edit form process
router.put("/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then((idea) => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save().then((idea) => {
      res.redirect("/ideas");
    });
  });
});

// delete idea
// you might notice that d delete and edit have the same route, but different methods(this is ok)
router.delete("/:id", ensureAuthenticated, (req, res) => {
  // the remove gets it offf the database
  Idea.remove({ _id: req.params.id }).then(() => res.redirect("/ideas"));
  // res.send("deleted");
});

module.exports = router;

// the ensureAuthenticated, is a route protector, it basicly ensures users are authenticated
// before they can access the route
