const messageModel = require("../../models/chat/messageModel");
const User = require("../../models/chat/usermodel");

// ✅ Get all messages between two users
exports.getMessages = async (req, res) => {
  const { sender, receiver } = req.query;
  try {
      const messages = await messageModel.find({
          $or: [
              { sender, receiver },
              { sender: receiver, receiver: sender }
          ]
      }).sort({ createdAt: 1 });

      res.json(messages);
  } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Error fetching messages" });
  }
};

// ✅ Save a new message
exports.saveMessage = async (req, res) => {
  try {
      const { sender, receiver, text, fileUrl } = req.body;
      const newMessage = new Message({ sender, receiver, text, fileUrl });

      await newMessage.save();

      // Update user's contact list
      await User.findOneAndUpdate(
        { username: sender },
        { $addToSet: { contacts: receiver } }
      );
      await User.findOneAndUpdate(
        { username: receiver },
        { $addToSet: { contacts: sender } }
      );

      res.status(201).json(newMessage);
  } catch (error) {
      console.error("Error saving message:", error);
      res.status(500).json({ message: "Server error" });
  }
};

// ✅ Fetch user's contacts
exports.getContacts = async (req, res) => {
  try {
      const { username } = req.query;
      const user = await User.findOne({ username }).populate("contacts");
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user.contacts);
  } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Server error" });
  }
};


exports.uploadFile = (req, res) => {
  if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
  }

  // ✅ File URL (Modify as needed for cloud storage)
  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({ fileUrl });
};

