const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes.");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const mongoose = require("mongoose");

const app = express();
const http = require("http");
const { Server } = require("socket.io");

app.use(express.json());
app.use(cors());

require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const Order = require("./models/Order");
const Chat = require("./models/Chat");

io.on("connection", (socket) => {
  console.log("User connected to socket:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("join_personal_room", (userId) => {
    socket.join(userId);
    console.log(`User joined personal room: ${userId}`);
  });

  socket.on("send_message", async (data) => {
    try {
      const { roomId, orderId, shopkeeperId, senderId, senderRole, text } = data;
      
      const newChat = new Chat({
        roomId,
        orderId,
        shopkeeperId,
        senderId,
        senderRole,
        text
      });
      await newChat.save();

      // Emit to the specific chat room
      io.to(roomId).emit("receive_message", newChat);

      // Find the order to get the userId for notification
      const order = await Order.findById(orderId);
      if (order) {
        // If sender is shopkeeper, notify the user. If sender is user, notify the shopkeeper.
        const recipientId = senderRole === "shopkeeper" ? order.userId.toString() : shopkeeperId;
        io.to(recipientId).emit("new_message_notification", newChat);
      }
    } catch (err) {
      console.error("Socket send message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



const User = require("./models/User");
const bcrypt = require("bcrypt");

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Mongodb Connected");
        // Seed default admin
        const adminExists = await User.findOne({ email: "admin@gmail.com" });
        if (!adminExists) {
            const hashP = await bcrypt.hash("admin@123", 10);
            await User.create({
                name: "Admin",
                email: "admin@gmail.com",
                password: hashP,
                role: "admin"
            });
            console.log("Default admin created");
        }
    })
    .catch((err) => console.log("Error:", err.message))

const chatRoutes = require("./routes/chatRoutes");

app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", cartRoutes);
app.use("/api", chatRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
