const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true }, // ✅ Add receiver field
    text: { type: String, required: true },
    fileUrl: { type: String, default: null }, // ✅ Optional file attachment
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MessageTeachat", MessageSchema);
