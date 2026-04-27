const mongoose = require("mongoose");
require("../models/Products"); 
require("../models/User");
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products", required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
  paymentMethod: { type: String, enum: ["COD", "UPI", "Stripe Card"], required: true },
  status: { type: String, default: "Placed" },
  createdAt: { type: Date, default: Date.now },
  expectedDelivery: { type: Date },
});

module.exports = mongoose.model("Order", orderSchema);
