const messageModel = require("../models/chat/messageModel");
const User = require("../models/chat/usermodel");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔗 User Connected: ${socket.id}`);

    // ✅ User joins their personal room
    socket.on("join", (username) => {
      socket.join(username);
      console.log(`${username} joined room: ${username}`);
    });

    socket.on("sendMessage", async (messageData) => {
      try {
        const { sender, receiver, text, fileUrl } = messageData;

        const newMessage = new messageModel({
          sender,
          receiver,
          text,
          fileUrl,
          timestamp: new Date(),
        });

        await newMessage.save();

        await User.findOneAndUpdate(
          { username: sender },
          { $addToSet: { contacts: receiver } }
        );
        await User.findOneAndUpdate(
          { username: receiver },
          { $addToSet: { contacts: sender } }
        );

        // ✅ Only emit to sender and receiver rooms
        io.to(sender).emit("receiveMessage", newMessage);
        io.to(receiver).emit("receiveMessage", newMessage);
      } catch (err) {
        console.error("❌ Error saving message:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ User Disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
