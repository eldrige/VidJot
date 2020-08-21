// constants and exports
const port = 8000;
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash")
const session = require("express-session")
const methodOverride = require("method-override");
const passport = require("passport");

// Map global promise - gets rid of mongodb deprecated promise warning
mongoose.promise = global.Promise;

// Passport Config
require("./config/passport")(passport);

// connnect to mongoose
mongoose
  .connect("mongodb://localhost/vidjot-dev", {
    useMongoClient: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// load Idea Model
require("./models/Idea");
// load model into a variable
const Idea = mongoose.model("ideas");

// load routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// handle bars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// layout, view that wraps around all our other view, eg the boilerplate html
app.set("view engine", "handlebars");

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// static folder
app.use(express.static(path.join(__dirname, "/public/")));

// express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  savzeUnintialized: true
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// ROUTES

// index route
app.get("/", (req, res) => {
  const title = "Video Jotter";
  res.render("index", {
    title: title, // sort of passing it into the index.exphbs view (interpolation)
  });
});
// about route
app.get("/about", (req, res) => {
  res.render("about");
});

// method overiride middleware, overirde helps us to create put requests
app.use(methodOverride("_method"));


app.use(flash())

// Global Variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  res.locals.user = req.user || null  // represents the global user
  next()
})

// use routes
// use idea routes
app.use("/ideas", ideas);
// use user routes
app.use("/users", users);
// PORT
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
