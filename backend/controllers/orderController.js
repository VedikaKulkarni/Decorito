const Address=require("../models/Address");
const Order=require("../models/Order");
const Cart=require("../models/Cart");
require("../models/Products"); 
require("../models/User");

const jwt = require("jsonwebtoken");
exports.saveAddress=async(req,res)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { fullName, phone, pincode, addressLine, city, state } = req.body;
         if (!fullName || !phone || !pincode || !addressLine || !city || !state) {
            return res.status(400).json({ message: "All fields are required" });
         }
        const newAddress = new Address({
         fullName,
         phone,
         pincode,
         addressLine,
         city,
         state,
         userId
         });

        await newAddress.save();
        res.json({ message: "Address saved successfully", address: newAddress });
    }
    catch(err){
        res.status(500).json(err.message);
    }
}

exports.getSavedAddresses = async (req, res) => {
  try {
    const userId = req.user.id; 

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
    res.json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { productId, items, addressId, paymentMethod, quantity } = req.body;

    // check addressId
    if (!addressId) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    let order;
    const mongoose = require("mongoose");
    const Product = mongoose.model("Products");

    if (productId) {
      // ---------- CASE 1: Buy Now ----------
      const buyQty = Number(quantity) || 1;
      const product = await Product.findById(productId);
      if (!product || product.stock < buyQty) {
        return res.status(400).json({ message: `Insufficient stock for ${product ? product.name : "product"}` });
      }

      order = new Order({
        userId,
        items: [{ productId, quantity: buyQty }],
        addressId,
        paymentMethod,
        status: "Placed",
        createdAt: new Date(),
        expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      });

      product.stock -= buyQty;
      await product.save();

    } else if (items && items.length > 0) {
      // ---------- CASE 2: Cart Checkout ----------
      // Verify all stock first
      for (const item of items) {
         const product = await Product.findById(item.productId);
         if (!product || product.stock < item.quantity) {
             return res.status(400).json({message: `Insufficient stock for ${product ? product.name : 'an item'}`});
         }
      }

      order = new Order({
        userId,
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
        })),
        addressId,
        paymentMethod,
        status: "Placed",
        createdAt: new Date(),
        expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      });

      // Decrement stock
      for (const item of items) {
          const product = await Product.findById(item.productId);
          product.stock -= item.quantity;
          await product.save();
      }

      // optionally clear cart after placing order
      await Cart.updateOne({ userId }, { $set: { items: [] } });
    } else {
      return res.status(400).json({ message: "No product(s) provided" });
    }

    await order.save();
    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.productId").populate("addressId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all orders of a specific user
exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id; // assuming you're using auth middleware & storing user in req.user

    const orders = await Order.find({ userId })
      .populate("items.productId")
      .populate("addressId")
      .sort({ createdAt: -1 }); // latest orders first

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get orders related to shopkeeper's products
exports.getShopkeeperOrders = async (req, res) => {
  try {
    const shopkeeperId = req.user.id;
    
    // Find all products owned by this shopkeeper
    const mongoose = require("mongoose");
    const Product = mongoose.model("Products");
    const shopkeeperProducts = await Product.find({ shopkeeperId }).select("_id");
    const productIds = shopkeeperProducts.map(p => p._id);

    // Find all orders that contain any of these products
    const orders = await Order.find({ "items.productId": { $in: productIds } })
      .populate("userId", "name email phone")
      .populate("items.productId")
      .populate("addressId")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.json(orders);
  } catch (err) {
    console.error("Error fetching shopkeeper orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createPaymentIntent = async (req, res) => {
  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const { id, items, quantities } = req.body;
    const mongoose = require("mongoose");
    const Product = mongoose.model("Products");

    let subtotal = 0;

    if (id) {
       // buy now
       const product = await Product.findById(id);
       if (!product) return res.status(404).json({ message: "Product not found" });
       const qty = quantities && quantities[id] ? quantities[id] : 1;
       subtotal = parseInt(product.price, 10) * qty;
    } else if (items && items.length > 0) {
       // cart checkout
       for (const item of items) {
           const product = await Product.findById(item.productId);
           if (product) {
               const qty = quantities && quantities[product._id] ? quantities[product._id] : item.quantity;
               subtotal += parseInt(product.price, 10) * qty;
           }
       }
    } else {
       return res.status(400).json({ message: "No items provided" });
    }

    const deliveryFee = subtotal > 0 ? 40 : 0;
    const total = subtotal + deliveryFee;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100, // strictly in minimum currency unit (paise)
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
      console.error("Error creating payment intent:", err);
      res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If order is Delivered, delete associated chats
    if (status === "Delivered") {
      const Chat = require("../models/Chat");
      await Chat.deleteMany({ orderId: id });
    }

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
