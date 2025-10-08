import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-5">CloudBite</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Bringing restaurant-quality meals directly to your doorstep with our
            innovative cloud kitchen concept.
          </p>
          <div className="flex space-x-6 text-gray-400 text-xl">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-white transition"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-white transition"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-white transition"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-5">Quick Links</h3>
          <ul className="space-y-3 text-gray-400 text-sm sm:text-base">
            <li>
              <Link to="/" className="hover:text-white transition">
                Our Menu
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-5">Contact Us</h3>
          <address className="not-italic space-y-2 text-gray-400 text-sm sm:text-base">
            <p>123 Cloud Kitchen, NGT, Chitwan</p>
            <p>+977-99999999</p>
            <p>contact@cloudbite.com</p>
            <p>Mon-Sun: 10:00 AM - 10:00 PM</p>
          </address>
        </div>

        {/* Optional: Newsletter or Social media feed */}
        <div>
          <h3 className="text-xl font-semibold mb-5">Stay Connected</h3>
          <p className="text-gray-400 mb-4 text-sm sm:text-base leading-relaxed">
            Subscribe to our newsletter for exclusive deals and updates.
          </p>
          <form className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm sm:text-base">
        &copy; {new Date().getFullYear()} CloudBite. All rights reserved.
      </div>
    </footer>
  );
}
