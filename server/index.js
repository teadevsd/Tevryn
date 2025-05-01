require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const { StreamChat } = require("stream-chat"); // ✅ Correct import
const { connectDB } = require("./config/connectDB");
const userRoute = require("./routes/chat/userRoute");
const friendsRoute = require("./routes/chat/friendsRoute");
const messageRoute = require("./routes/chat/messageRoute");
const noteRoute = require("./routes/notes/noteRoute");
const videoRoute = require("./routes/video/videoRoute");
const socketHandler = require("./utils/socketHandler");



// ✅ Initialize Express
const app = express();
const server = http.createServer(app);

// ✅ Connect to Database
connectDB();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ✅ Initialize Stream Chat (For Token Generation)
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/friends", friendsRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/notes", noteRoute);
app.use("/api/v1/video", videoRoute);


if (!apiKey || !apiSecret) {
  console.error("❌ Stream API keys are missing. Check .env file.");
  process.exit(1);
}

const streamChatClient = StreamChat.getInstance(apiKey, apiSecret);


// ✅ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

socketHandler(io); // ✅ attach handlers


io.on("connection", (socket) => {
  console.log(`🔗 User Connected: ${socket.id}`);

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
