require("dotenv").config();

const axios = require("axios");
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
app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios({
      url: "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        Accept: "image/png"
      },
      data: {
        inputs: prompt
      },
      responseType: "arraybuffer"
    });

    const imageBase64 =
      Buffer.from(response.data).toString("base64");

    res.json({
      image: `data:image/png;base64,${imageBase64}`
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Image generation failed"
    });
  }
});

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