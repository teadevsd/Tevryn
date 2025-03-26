const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/connectDB");
const userRoute = require("./routes/chat/userRoute");
const friendsRoute = require("./routes/chat/friendsRoute");
const messageRoute = require("./routes/chat/messageRoute");
const noteRoute = require("./routes/notes/noteRoute");


const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.io

connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/friends", friendsRoute);
app.use("/api/v1/messages", messageRoute);


//note-route
app.use("/api/v1/note", noteRoute);



// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data); // Broadcast message to all clients
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
