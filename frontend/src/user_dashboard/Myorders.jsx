import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded-lg shadow-md bg-white"
            >
              <h3 className="font-bold text-[#411900]">
                Order #{order._id.slice(-6).toUpperCase()}
              </h3>
              <p className="text-sm text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <ul className="mt-3 space-y-2">
                {order.items.map((item) => (
                  <li
                    key={item._id}
                    className="flex items-center gap-4 border-b pb-2"
                  >
                    {/* 🔹 Product Image */}
                    <img
                      src={item.productId.image || "/placeholder.png"}
                      alt={item.productId.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />

                    {/* 🔹 Product Details */}
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.productId.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: ₹{item.productId.price}
                      </p>
                      <p className="text-sm text-gray-600">
                       Expected to deliver on:{order.expectedDelivery}
                      </p>
                    </div>
                    {/* 🔹 Chat Button */}
                    <div className="ml-auto">
                      <Link 
                        to={`/chat/${order._id}/${item.productId.shopkeeperId}`}
                        className="bg-[#411900] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2a1200] transition"
                      >
                        💬 Chat with Seller
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
