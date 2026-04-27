import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#411900] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4">Decorito</h3>
          <p className="text-gray-200">
            Bringing joy to every celebration with fresh flowers and unique decorations.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-yellow-400 transition">Home</Link></li>
            <li><Link to="/categories" className="hover:text-yellow-400 transition">Categories</Link></li>
            <li><Link to="/about" className="hover:text-yellow-400 transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2">
            <li><Link to="/faq" className="hover:text-yellow-400 transition">FAQ</Link></li>
            <li><Link to="/terms" className="hover:text-yellow-400 transition">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="hover:text-yellow-400 transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Social & Newsletter */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4 mb-4">
            <a href="#"><Facebook size={24} /></a>
            <a href="#"><Instagram size={24} /></a>
            <a href="#"><Twitter size={24} /></a>
            <a href="#"><Linkedin size={24} /></a>
          </div>
          <h4 className="text-lg font-semibold mb-2">Subscribe</h4>
          <form className="flex">
            <input
              type="email"
              placeholder="Email Address"
              className="px-3 py-2 rounded-l-lg text-gray-800 w-full"
            />
            <button
              type="submit"
              className="bg-yellow-500 px-4 py-2 rounded-r-lg hover:bg-yellow-600 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="text-center mt-8 text-gray-300 text-sm">
        &copy; {new Date().getFullYear()} Decorito. All rights reserved.
      </div>
    </footer>
  );
}
