import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Categories array
  const categories = [
    { name: "Birthday", link: "/birthday" },
    { name: "Anniversary", link: "/anniversary" },
    { name: "Navratri", link: "/navratri" },
    { name: "Diwali", link: "/diwali" },
    { name: "Dasra", link: "/dasra" },
    { name: "Ganpati", link: "/ganpati" },
    { name: "Mahalakshmi", link: "/mahalakshmi" },
    { name: "Christmas", link: "/xmas" },
    { name: "Rakhi", link: "/rakhi" },
    { name: "Pola", link: "/pola" },
    { name: "Valentine", link: "/valentine" },
  ];

  // Filter categories
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔹 Check login before navigating
  const handleLoggedin = (route) => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true"; 
    if (isLoggedIn) {
      navigate(route);
    } else {
      navigate("/signin"); // redirect to signin if not logged in
    }
  };

  const userRole = sessionStorage.getItem("userRole");

  return (
    <nav className="bg-[#411900] shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 md:px-6 relative">
        
        {/* Left: Logo */}
        <Link to="/" className="text-xl md:text-2xl font-bold text-white mr-3">
          Decorito
        </Link>

        {/* Center: Search bar */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full border rounded-full px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#f0e6df] text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Search results dropdown */}
          {searchQuery && (
            <div className="absolute top-12 left-0 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat, index) => (
                  <button
                    key={index}
                    onClick={() => handleLoggedin(cat.link)}
                    className="block w-full text-left px-4 py-2 hover:bg-[#f0e6df] text-[#411900]"
                  >
                    {cat.name}
                  </button>
                ))
              ) : (
                <p className="px-4 py-2 text-gray-500">No categories found</p>
              )}
            </div>
          )}
        </div>

        {/* Right: Desktop links */}
        <div className="hidden md:flex items-center gap-6 ml-6">
          {(userRole === "shopkeeper" || userRole === "admin") && (
            <button
              onClick={() => handleLoggedin("/add-product")}
              className="flex items-center rounded-md text-white hover:text-[#411900] hover:bg-white px-3 py-2 border border-white"
            >
              Add Product
            </button>
          )}

          <button
            onClick={() => handleLoggedin("/user-dashboard")}
            className="flex items-center rounded-md text-white hover:text-[#411900] hover:bg-white px-3 py-2"
          >
            <User className="w-5 h-5 mr-1" />
            Profile
          </button>

          <button
            onClick={() => navigate("/signin")}
            className="px-3 py-1 rounded-md text-white hover:text-[#411900] hover:bg-white px-3 py-2"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-3 py-1 rounded-md text-white hover:text-[#411900] hover:bg-white px-3 py-2"
          >
            Sign Up
          </button>

          <button
            onClick={() => handleLoggedin("/cartpage")}
            className="flex items-center rounded-md text-white hover:text-[#411900] hover:bg-white px-3 py-2"
          >
            <ShoppingCart className="w-5 h-5 mr-1" />
            Cart
          </button>
        </div>
      </div>
    </nav>
  );
}
