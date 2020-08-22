"use strict";

module.exports = {
  ensureAuthenticated: function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  }
};