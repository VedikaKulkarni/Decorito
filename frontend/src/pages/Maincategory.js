import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CategoriesPage() {
  const categories = [
    { name: "Birthday", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLEMzvILBf5G-ETUwCjRdXM2VUKw0-TO7zkA&s", link: "/category/Birthday" },
    { name: "Anniversary", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1qAOPbwq--Qff6B3lxHNnGcvcP5m5iMX9PQ&s", link: "/category/anniversary" },
    { name: "Navratri", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpVR_iLz6KhzxDr9vT5dbb9zYJ6qU46JhCew&s", link: "/category/navratri" },
    { name: "Diwali", image: "https://assets.giftalove.com/resources/assets/images/significance-of-diwali.jpg", link: "/category/diwali" },
    { name: "Dasara", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1nameN4qLQK5xrbbdMKxEupVJQcakLEvz7g&s", link: "/category/dasara" },
    { name: "Ganpati", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZR6RAzZca-tt-of2qnFAM3lDKQWC3JxwJWw&s", link: "/category/ganpati" },
    { name: "Mahalakshmi", image: "https://www.nagpurtoday.in/wp-content/uploads/2022/09/WhatsApp-Image-2022-08-31-at-1.48.00-AM-4.jpeg", link: "/category/mahalakshmi" },
    { name: "Christmas", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQXr0eghRvvkHd-czCEkA4oQRLFu0bS2c_xw&s", link: "/category/christmas" },
    { name: "Rakhi", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLdxUq8JUyRDMSWAvaxTm1-x2zgNZEkswz6w&s", link: "/category/rakhi" },
    { name: "Pola", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPFtYSgTmPunbuGrHoFtbMy7sZyHEdLjCd3w&s", link: "/category/pola" },
    { name: "Valentine", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXTzggZ229erWLSZZHswrfcU2RRZ4XrOfmZQ&s", link: "/category/valentine" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#411900]">
      {/* Navbar */}
      <Navbar />

      {/* Heading */}
      <div className="text-center mt-8">
        <h1 className="text-4xl font-extrabold tracking-wide">Product Categories</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Explore a wide range of categories for every occasion 🎉
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-10 mt-10 pb-10">
        {categories.map((cat, index) => (
          <Link to={cat.link} key={index}>
            <div className="relative rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300">
              
              {/* Image with gradient overlay */}
              <div className="relative h-60">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Title Overlay */}
                <h2 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xl font-semibold text-white drop-shadow-md">
                  {cat.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  );
}
