const path = require("path");

module.exports = {
  entry: {
    index: "./public/assets/js/index.js",
  },
  output: {
    path: path.resolve(__dirname, "public", "dist"),
    filename: "[name].bundle.js",
  },
};
