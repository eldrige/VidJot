// constants and exports
const port = 8000;
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

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

// method overiride middleware, overirde helps us to create put requests
app.use(methodOverride("_method"));

// use routes
// use idea routes
app.use("/ideas", ideas);
// use user routes
app.use("/users", users);
// PORT
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
