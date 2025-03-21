const mongoose = require("mongoose");

const FriendRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
});

module.exports = mongoose.model("FriendRequest", FriendRequestSchema);
