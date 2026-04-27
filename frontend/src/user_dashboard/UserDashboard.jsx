import React, { useState } from "react";
import { User, ShoppingBag, ShoppingCart, LogOut, Edit } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UpdateProfile from "./UpdateProfile";
import MyOrders from "./Myorders";
import MyCart from "./Mycart";
import Logout from "./Logout";

export default function Dashboard() {
  const [active, setActive] = useState("profile");

  const menuItems = [
    { id: "profile", label: "Update Profile", icon: <Edit size={20} /> },
    { id: "orders", label: "My Orders", icon: <ShoppingBag size={20} /> },
    { id: "cart", label: "My Cart", icon: <ShoppingCart size={20} /> },
    { id: "logout", label: "Logout", icon: <LogOut size={20} /> },
  ];

  const renderContent = () => {
    switch (active) {
      case "profile":
        return <UpdateProfile />;
      case "orders":
        return <MyOrders />;
      case "cart":
        return <MyCart />;
      case "logout":
        return <Logout />;
      default:
        return <div>Welcome!</div>;
    }
  };

  return (
    <>
    <Navbar/>
    <div className="flex h-screen bg-[#f4ece6]">
      {/* Sidebar */}
      <div className="w-64 bg-[#411900] text-white flex flex-col shadow-lg">
        <div className="p-6 border-b border-[#63300d] flex items-center space-x-2">
          <User size={28} className="text-white" />
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition
                ${
                  active === item.id
                    ? "bg-[#63300d] shadow"
                    : "hover:bg-[#5a1f00]"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md min-h-[80%]">
          {renderContent()}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
