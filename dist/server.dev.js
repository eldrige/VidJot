"use strict";

// constants and exports
var port = process.env.PORT || 8000;

var express = require("express");

var app = express();

var exphbs = require("express-handlebars");

var path = require("path");

var mongoose = require("mongoose");

var bodyParser = require("body-parser");

var flash = require("connect-flash");

var session = require("express-session");

var methodOverride = require("method-override");

var passport = require("passport"); // Map global promise - gets rid of mongodb deprecated promise warning


mongoose.promise = global.Promise; // Passport Config

require("./config/passport")(passport); // DB config


var db = require("./config/database"); // connnect to mongoose


mongoose.connect(db.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log("MongoDB connected");
})["catch"](function (err) {
  return console.log(err);
}); // load Idea Model

require("./models/Idea"); // load model into a variable


var Idea = mongoose.model("ideas"); // load routes

var ideas = require("./routes/ideas");

var users = require("./routes/users"); // handle bars middleware


app.engine("handlebars", exphbs({
  defaultLayout: "main"
})); // layout, view that wraps around all our other view, eg the boilerplate html

app.set("view engine", "handlebars"); // body parser middleware

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json()); // static folder

app.use(express["static"](path.join(__dirname, "/public/"))); // express session middleware

app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true
})); // Passport middleware

app.use(passport.initialize());
app.use(passport.session()); // ROUTES
// index route

app.get("/", function (req, res) {
  var title = "Video Jotter";
  res.render("index", {
    title: title // sort of passing it into the index.exphbs view (interpolation)

  });
}); // about route

app.get("/about", function (req, res) {
  res.render("about");
}); // method overiride middleware, overirde helps us to create put requests

app.use(methodOverride("_method"));
app.use(flash()); // Global Variables

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null; // represents the global user

  next();
}); // use routes
// use idea routes

app.use("/ideas", ideas); // use user routes

app.use("/users", users); // PORT

app.listen(port, function () {
  console.log("app listening on port ".concat(port));
});