const mongoose = require("mongoose");

const InviteSchema = new mongoose.Schema({
  phoneNumber: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sentAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invite", InviteSchema);
