const mongoose = require("mongoose");

module.exports = mongoose.model("Channel", {
  serverId: String,
  name: String,
  type: { type: String, default: "text" }
});