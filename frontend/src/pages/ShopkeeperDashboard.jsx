import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ShopkeeperDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);

  // Get Shopkeeper ID
  const token = sessionStorage.getItem("token");
  let shopkeeperId = "";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      shopkeeperId = payload.id;
    } catch (e) {}
  }

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role !== "shopkeeper") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        
        // Fetch specific products owned by the shopkeeper
        const productsRes = await fetch("http://localhost:5000/api/myshop-products", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }

        // Fetch orders associated with those products
        const ordersRes = await fetch("http://localhost:5000/api/myshop-orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white text-[#411900]">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-[#411900] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#411900]">Shopkeeper Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your inventory and track incoming customer orders.</p>
          </div>
          <Link
            to="/add-product"
            className="bg-[#8c4b18] hover:bg-[#6b2b00] text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all active:scale-95"
          >
            + Add New Product
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 font-medium text-lg">Total Active Products</h3>
              <p className="text-4xl font-bold text-[#411900] mt-2">{products?.length || 0}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-2xl">📦</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 font-medium text-lg">Orders Received</h3>
              <p className="text-4xl font-bold text-[#411900] mt-2">{orders?.length || 0}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl">🚚</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === "products" ? "text-[#8c4b18]" : "text-gray-500 hover:text-gray-800"}`}
          >
            My Products
            {activeTab === "products" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8c4b18]"></span>}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === "orders" ? "text-[#8c4b18]" : "text-gray-500 hover:text-gray-800"}`}
          >
            Track Orders
            {activeTab === "orders" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8c4b18]"></span>}
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {activeTab === "products" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-600">Product</th>
                    <th className="p-4 font-semibold text-gray-600">Category</th>
                    <th className="p-4 font-semibold text-gray-600">Price</th>
                    <th className="p-4 font-semibold text-gray-600">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">You haven't added any products yet.</td>
                    </tr>
                  ) : (
                    products.map(product => (
                      <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="p-4 flex items-center gap-4">
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover border" />
                          <span className="font-medium">{product.name}</span>
                        </td>
                        <td className="p-4 capitalize">{product.category}</td>
                        <td className="p-4 font-medium text-green-700">₹{product.price}</td>
                        <td className="p-4">
                          {product.stock <= 0 ? (
                            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-red-200">Out of Stock</span>
                          ) : (
                            <span>{product.stock} units</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-600">Order ID</th>
                    <th className="p-4 font-semibold text-gray-600">Customer</th>
                    <th className="p-4 font-semibold text-gray-600">Products Ordered</th>
                    <th className="p-4 font-semibold text-gray-600">Status</th>
                    <th className="p-4 font-semibold text-gray-600">Date</th>
                    <th className="p-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">No orders received for your items yet.</td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="p-4 font-mono text-sm text-gray-500">#{order._id.slice(-6)}</td>
                        <td className="p-4">
                          <div className="font-medium">{order.userId?.name || "Unknown"}</div>
                          <div className="text-sm text-gray-500">{order.userId?.email}</div>
                        </td>
                        <td className="p-4">
                          {order.items.map((item, idx) => (
                             <div key={idx} className="text-sm">{item.quantity}x {item.productId?.name}</div>
                          ))}
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Link 
                            to={`/chat/${order._id}/${shopkeeperId}`}
                            className="bg-[#411900] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#2a1200] transition whitespace-nowrap block text-center"
                          >
                            💬 Chat
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
