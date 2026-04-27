import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartContext } from "./Cart/CartProvider";
export default function ProductDetails() {
  const navigate=useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const {addToCart}=useContext(CartContext);
   const handleAddToCart = async () => {
    await addToCart(product._id); 
    navigate("/cartpage");         
  };
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/getproduct/${id}`);
        const data = await res.json();

        if (!res.ok) {
          console.error(data.message);
          return;
        }

        setProduct(data);
      } catch (err) {
        console.error("Error fetching product", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="text-center p-10">Loading product...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-[#411900]">
      <Navbar />

      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
  {/* Product Image */}
  <div className="flex justify-center">
    <img
      src={product.image}
      alt={product.name}
      className="w-full max-w-lg rounded-xl shadow-lg hover:scale-105 transition"
    />
  </div>

  {/* Product Info */}
  <div className="space-y-6">
    <h1 className="text-4xl font-bold">{product.name}</h1>

    {/* Shop Name */}
    {product.shopName && (
      <div className="text-md text-gray-500 font-medium -mt-4">
        Sold by: <span className="text-[#8c4b18]">{product.shopName}</span>
      </div>
    )}

    {/* Rating (static for now) */}
    <div className="flex items-center space-x-2">
      <span className="text-yellow-500 text-lg">★★★★☆</span>
      <span className="text-gray-600 text-sm">128 reviews</span>
    </div>

    {/* Price */}
    <div className="text-3xl font-bold text-green-600">
      ₹ {product.price}
    </div>

    {/* Key Features */}
    <div>
      <h2 className="text-lg font-semibold mb-2">Highlights</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-1">
        <li>Eco-friendly material</li>
        <li>Handmade with care</li>
        <li>Perfect for festive decoration</li>
      </ul>
    </div>

    {/* Delivery info */}
    <div className="p-4 border rounded-lg bg-gray-50">
      <p>✅ Free delivery within 20 minutes</p>
      <p>🔄 Easy 2-day replacement</p>
    </div>

    {/* Action Buttons */}
    {product.stock <= 0 ? (
      <div className="mt-4 text-red-600 font-bold text-xl flex items-center bg-red-50 p-4 rounded-lg border border-red-200 shadow-sm w-fit">
        🚫 Out of Stock
      </div>
    ) : (
      <div className="flex space-x-4">
        <Link to ={`/order/${id}`} className="px-6 py-2 rounded-full font-semibold shadow-md 
          bg-yellow-500 text-[#411900] hover:bg-yellow-600 transition">
          Buy Now
        </Link>
        <button onClick={handleAddToCart}  className="px-6 py-2 rounded-full font-semibold shadow-md 
          bg-white text-[#411900] border-2 border-[#411900] hover:bg-[#411900] hover:text-white transition">
    
          Add to Cart
        </button>
      </div>
    )}
  </div>
</div>


      <Footer />
    </div>
  );
}
