const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  phoneNumber: String,
  isRegistered: Boolean,
  avatar: String,
});

module.exports = mongoose.model("Contact", ContactSchema);
