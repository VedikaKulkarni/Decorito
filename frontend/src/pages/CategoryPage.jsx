import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// A simple Skeleton component for loading state
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-4 animate-pulse flex flex-col h-[400px]">
    <div className="w-full h-64 bg-gray-200 rounded-xl mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-4 flex-1"></div>
    <div className="flex justify-between items-center mt-auto">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

export default function CategoryPage() {
  const { categoryName } = useParams(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Capitalize first letter for display
  const displayCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/getproductsbycategory/${categoryName}`
        );
        const data = await res.json();

        if (!res.ok) {
          console.error(data.message);
          setProducts([]);
        } else {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching products", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-white text-[#411900] flex flex-col">
      <Navbar />

      {/* Dynamic Breadcrumbs & Hero Banner */}
      <div className="bg-gradient-to-r from-[#411900] to-[#6b2b00] text-white py-16 px-6 mt-1 shadow-lg relative overflow-hidden">
        {/* Subtle background decorative circle */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-100px] left-[10%] w-80 h-80 bg-[#e7d7c1] opacity-10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <nav className="flex justify-center text-sm font-medium text-gray-300 mb-6 space-x-2">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link to="/maincategory" className="hover:text-white transition">Categories</Link>
            <span>/</span>
            <span className="text-white">{displayCategory}</span>
          </nav>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">
            {displayCategory} Collection
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto font-light">
            Discover our exclusive {displayCategory.toLowerCase()} selections crafted to bring joy and elegance to your special moments.
          </p>
        </div>
      </div>

      {/* Products Filter/Sort Bar (Placeholder for future) */}
      <div className="max-w-7xl mx-auto w-full px-6 mt-10 flex justify-between items-center">
         <p className="text-gray-600 font-medium">
           {loading ? 'Finding products...' : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
         </p>
         <div className="hidden md:flex gap-4">
            <select className="bg-white border text-sm text-[#411900] border-gray-300 px-4 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8c4b18]">
                <option>Sort by Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
            </select>
         </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            {/* Empty State Illustration SVG */}
            <svg className="w-40 h-40 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-2xl font-bold text-[#411900] mb-2">No products available just yet</h3>
            <p className="text-gray-500 text-center max-w-md mb-8">
              We're currently stocking up on beautiful items for {displayCategory}. Check back soon or explore our other wonderful collections.
            </p>
            <Link 
              to="/maincategory" 
              className="px-8 py-3 bg-[#8c4b18] hover:bg-[#6b2b00] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Alternative Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((prod) => (
              <Link 
                to={`/product/${prod._id}`}
                key={prod._id} 
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col transform hover:-translate-y-2 border border-gray-200"
              >
                {/* Product Image with Zoom Effect */}
                <div className="relative overflow-hidden aspect-w-4 aspect-h-3 w-full bg-gray-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    loading="lazy"
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Product Info */}
                <div className="p-5 flex flex-col flex-1 relative z-10 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-[#411900] group-hover:text-[#8c4b18] transition-colors line-clamp-1">
                      {prod.name}
                    </h2>
                  </div>
                  <p className="text-gray-500 text-sm flex-1 line-clamp-2 leading-relaxed mb-4">
                    {prod.description}
                  </p>

                  {/* Price + Button */}
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-auto">
                    <p className="text-[#411900] font-extrabold text-xl tracking-tight">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </p>
                    <span className="px-5 py-2 bg-[#f4ece3] text-[#6b2b00] font-semibold text-sm rounded-lg group-hover:bg-[#411900] group-hover:text-white transition-all duration-300 ease-in-out shadow-lg">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
