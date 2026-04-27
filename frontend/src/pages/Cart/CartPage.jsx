import React, { useContext } from "react";
import { CartContext } from "./CartProvider";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart } = useContext(CartContext);

  // calculate total price
  const total = cart.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f9f6f1] to-[#e2d7c3] p-6 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-[#411900] mb-10 drop-shadow">
          🛒 Your Cart
        </h2>

        {cart.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-xl text-gray-600 font-medium">Your cart is empty</p>
            <p className="text-sm text-gray-500 mt-2">
              Add some items and they’ll show up here!
            </p>
          </div>
        ) : (
          <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 space-y-6">
            {cart.map((item) => (
              <div
                key={item.productId._id}
                className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-6 last:border-none"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.productId.image || "/images/placeholder.png"}
                    alt={item.productId.name}
                    className="w-24 h-24 rounded-lg object-cover shadow-md"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-[#411900]">
                      {item.productId.name}
                    </h4>
                    <p className="text-gray-700">₹{item.productId.price}</p>
                    <p className="text-gray-500 text-sm">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.productId._id)}
                  className="mt-4 md:mt-0 px-6 py-2 rounded-full font-medium shadow-md
                             bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Total + Checkout */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pt-6">
              <h3 className="text-2xl font-bold text-[#411900]">
                Total: ₹{total}
              </h3>
              <Link to="/checkout"
                className="mt-4 md:mt-0 px-8 py-3 rounded-full text-lg font-semibold shadow-md
                           bg-[#411900] text-white hover:bg-[#2e1200] transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
