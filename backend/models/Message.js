const mongoose = require("mongoose");

module.exports = mongoose.model("Message", {
  sender: String,
  text: String,
  serverId: String,
  channelId: String,
  receiverId: String,
  createdAt: { type: Date, default: Date.now }
});