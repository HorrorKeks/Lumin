const mongoose = require("mongoose");

module.exports = mongoose.model("Server", {
  name: String,
  ownerId: String,
  members: [String]
});