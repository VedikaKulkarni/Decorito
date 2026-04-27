import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    role: "user",
    shopName: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.cpassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          shopName: formData.role === 'shopkeeper' ? formData.shopName : undefined
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful!");
        navigate("/signin");
      } else {
        alert(data.message || "Something went wrong");
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

      {/* Signup Card */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-lg border border-[#411900]/20 rounded-3xl shadow-xl p-10 z-10">
        <h1 className="text-3xl font-bold text-center text-[#411900] mb-6">
          Create Account ✨
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Join <span className="font-semibold">Decorito</span> and start your journey!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#411900] focus:outline-none"
          />

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

          <input
            type="password"
            name="cpassword"
            placeholder="Confirm Password"
            value={formData.cpassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#411900] focus:outline-none"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#411900] focus:outline-none bg-white text-gray-700"
          >
            <option value="user">User</option>
            <option value="shopkeeper">Shopkeeper</option>
          </select>

          {formData.role === "shopkeeper" && (
            <input
              type="text"
              name="shopName"
              placeholder="Shop Name"
              value={formData.shopName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#411900] focus:outline-none"
            />
          )}

          <button
            type="submit"
            className="w-full bg-[#411900] text-white py-2 rounded-lg font-semibold hover:bg-[#2a1200] transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already registered?{" "}
          <Link
            to="/signin"
            className="text-[#411900] font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
