import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "birthday",
    isFeatured: "false",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Categories aligned with the Navbar
  const categories = [
    "birthday",
    "anniversary",
    "navratri",
    "diwali",
    "dasra",
    "ganpati",
    "mahalakshmi",
    "christmas",
    "rakhi",
    "pola",
    "valentine",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select an image file for the product.");
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);
      data.append("isFeatured", formData.isFeatured);
      data.append("image", imageFile);

      const token = sessionStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/addproduct", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const resData = await res.json();

      if (res.ok) {
        alert("Product successfully added!");
        navigate(`/category/${formData.category}`);
      } else {
        alert(resData.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to connect to backend");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#411900] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-[#411900]">
          Add New Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6"
        >
          <div>
            <label className="block text-sm font-semibold mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Elegant Birthday Cake"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8c4b18] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Provide a detailed description of the product..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8c4b18] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Price (₹)</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="299"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8c4b18] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                required
                min="1"
                value={formData.stock}
                onChange={handleChange}
                placeholder="e.g. 50"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8c4b18] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8c4b18] focus:outline-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Featured</label>
              <select
                name="isFeatured"
                value={formData.isFeatured}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8c4b18] focus:outline-none bg-white"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8c4b18] focus:outline-none bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 mt-4 ${
              isLoading
                ? "bg-[#8c4b18]/60 cursor-not-allowed"
                : "bg-[#8c4b18] hover:bg-[#6b2b00] shadow-md hover:shadow-lg"
            }`}
          >
            {isLoading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
