const Cart = require("../models/Cart");

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId=req.user.id; 
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity: 1 }] });
    } else {
      const item = cart.items.find((i) => i.productId.toString() === productId);
      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get cart
exports.getCart = async (req, res) => {
  try {
    const userId=req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item
exports.removeFromCart = async (req, res) => {
  try {
    const userId=req.user.id;
    const { productId } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
