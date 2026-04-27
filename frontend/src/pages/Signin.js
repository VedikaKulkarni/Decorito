import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";

export default function Signin() {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");
        if (data.token) {
           const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 1 day in ms
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("userRole", data.role);
            sessionStorage.setItem("expiry", expiryTime);
            sessionStorage.setItem("isLoggedIn", true);
          if (data.role === "shopkeeper") {
            navigate("/shopkeeper-dashboard");
          } else {
            navigate("/");
          }

        }
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to backend");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white px-4">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#411900]/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#411900]/10 rounded-full blur-2xl -z-10"></div>

      {/* Signin Card */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-lg border border-[#411900]/20 rounded-3xl shadow-xl p-10 z-10">
        <h1 className="text-3xl font-bold text-center text-[#411900] mb-6">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sign in to continue to <span className="font-semibold">Decorito</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#411900] focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#411900] focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-[#411900] text-white py-2 rounded-lg font-semibold hover:bg-[#2a1200] transition"
          >
            Sign In
          </button>
        </form>

        {/* Extra Links */}
        <div className="mt-6 flex justify-between text-sm text-gray-600">
          <Link to="/forgot-password" className="hover:underline">
            Forgot password?
          </Link>
          <Link to="/help" className="hover:underline">
            Need Help?
          </Link>
        </div>

        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-[#411900] font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
