// constants and exports
const port = 8000;
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");

// handle bars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// layout, view that wraps around all our other view, eg the boilerplate html
app.set("view engine", "handlebars");

// STATIC FOLDERS

app.use(express.static(path.join( __dirname, "/public/")));

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

// PORT
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
