require("dotenv").config();

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const io = new Server(server, {
  cors: { origin: "*" }
});

// 🔌 CHANNEL CHAT
io.on("connection", (socket) => {

  socket.on("joinChannel", (channelId) => {
    socket.join(channelId);
  });

  socket.on("sendMessage", async (data) => {
    const msg = await Message.create(data);
    io.to(data.channelId).emit("message", msg);
  });

  // 💬 DM SYSTEM
  socket.on("joinDM", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendDM", async (data) => {
    const msg = await Message.create(data);
    io.to(data.roomId).emit("dm", msg);
  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Lumin Backend läuft auf Port " + PORT);
});