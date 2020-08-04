// constants and exports
const port = 8000;
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");

// load Idea Model
require("./models/Idea");
const Idea = mongoose.model("ideas");

// Map global promise - gets rid of mongodb deprecated promise warning
mongoose.promise = global.Promise;

// connnect to mongoose
mongoose
  .connect("mongodb://localhost/vidjot-dev", {
    useMongoClient: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// handle bars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// layout, view that wraps around all our other view, eg the boilerplate html
app.set("view engine", "handlebars");

// STATIC FOLDERS

// Process form
// configure your form action to point to /ideas, this will show up when done
app.post('/ideas', (req, res) => {

  res.send('ok')
})

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

// Add idea route (form)
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

app.get("ideas/index", (req,res) => {
  res.render('/ideas/index')
})
// PORT
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
