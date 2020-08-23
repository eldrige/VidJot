if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://eldrige:baguvix75009@vidjot-prod.juzpn.mongodb.net/test",
  };
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/vidjot-dev",
  };
}
