const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  roomId: { type: String, required: true }, // Format: `${orderId}_${shopkeeperId}`
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  shopkeeperId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderRole: { type: String, enum: ["user", "shopkeeper", "admin"], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", chatSchema);
