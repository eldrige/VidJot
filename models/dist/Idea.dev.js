"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema; // Create Schema

var IdeaSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    "default": Date.now
  },
  user: {
    type: String,
    required: true
  } //so the id of the user, gets added to the schema as well

});
mongoose.model("ideas", IdeaSchema);