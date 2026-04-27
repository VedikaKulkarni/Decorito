import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/order/${orderId}`, {
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (res.ok) {
          setOrder(data);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div className="text-center p-10 text-lg">Loading order details...</div>;
  }

  const deliveryFee = 40;
  const subtotal = parseFloat(order.items[0].productId.price);
  const total = subtotal + deliveryFee;

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#fff8f0] flex justify-center items-center p-6">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-2xl p-8">
        
        {/* Success Icon & Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 011.414-1.414L9 11.086l6.543-6.543a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[#411900] mb-2">Order Confirmed!</h2>
          <p className="text-gray-700">Thank you for shopping with us 🎉</p>
          <p className="mt-2 text-gray-600">
            Order ID: <span className="font-semibold">{order._id}</span>
          </p>
        </div>

        {/* Product Summary */}
        <div className="border rounded-lg p-5 mb-6 bg-[#fffdf9] shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-[#411900]">Product Summary</h3>
          <div className="flex items-center space-x-5">
            <img
              src={order.items[0].productId.image}
              alt={order.items[0].productId.name}
              className="w-24 h-24 object-cover rounded-lg shadow"
            />
            <div>
              <p className="text-lg font-semibold">{order.items[0].productId.name}</p>
              <p className="text-gray-600">₹{order.items[0].productId.price}</p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mt-4 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-[#411900] text-lg mt-2">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="border rounded-lg p-5 mb-6 bg-[#fffdf9] shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-[#411900]">Delivery Address</h3>
          <p className="font-medium">{order.addressId.fullName}</p>
          <p>
            {order.addressId.addressLine}, {order.addressId.city},{" "}
            {order.addressId.state} - {order.addressId.pincode}
          </p>
          <p>📞 {order.addressId.phone}</p>
        </div>

        {/* Payment Method */}
        <div className="border rounded-lg p-5 mb-6 bg-[#fffdf9] shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-[#411900]">Payment Method</h3>
          <p className="capitalize">{order.paymentMethod}</p>
        </div>

        {/* Back to Home Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-[#411900] text-white py-3 px-8 rounded-lg font-semibold shadow-md hover:scale-105 transform transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
