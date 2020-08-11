// constants and exports
const port = 8000;
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Map global promise - gets rid of mongodb deprecated promise warning
mongoose.promise = global.Promise;

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

// handle bars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// layout, view that wraps around all our other view, eg the boilerplate html
app.set("view engine", "handlebars");

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "/public/")));

// ROUTES

// index route
app.get("/", (req, res) => {
  const title = "My first view";
  res.render("index", {
    title: title, // sort of passing it into the index.exphbs view (interpolation)
  });
});
// about route
app.get("/about", (req, res) => {
  res.render("about");
});

// idea index page, where data from db will be fetched and displayed
app.get("/ideas", (req, res) => {
  Idea.find({})
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
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

// process form
app.post("/ideas", (req, res) => {
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
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    // create a new user having the ppties of the books
    const newUser = {
      title: req.body.title,
      details: req.body.details,
    };
    new Idea(newUser).save().then((idea) => res.redirect("/ideas"));
    // this enables it to be saved to our local mongoDB, then redirected to /ideas
  }
});

//  Make the form modifiable
// the id is just a placeholder (route param)
app.get("/ideas/edit/:id", (req, res) => {
  Idea.findOne({
    _id : req.params.id
  })
  .lean()
  .then((idea) => {
    res.render('ideas/edit', {
      idea : idea
    })
  })
});
// PORT
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
