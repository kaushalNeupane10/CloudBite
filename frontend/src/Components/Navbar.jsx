import { useState } from "react";
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
} from "@heroicons/react/24/outline";
import { logout } from "../utils/auth";
import { Link } from "react-router-dom";
import myLogo from "../image/logo.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen(false); 
    }
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src={myLogo}
            alt="CloudBite Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <h1 className="text-2xl font-bold">CloudBite</h1>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex items-center w-1/3">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-l-lg bg-white text-gray-800 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-r-lg"
          >
            Search
          </button>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-6">
          <li>
            <Link to="/" className="hover:text-red-400">
              Home
            </Link>
          </li>
          <li>
            <Link to="/menu" className="hover:text-red-400">
              Menu
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-red-400">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/cart" className="hover:text-red-400">
              Cart
            </Link>
          </li>
          <li>
            <Link to="/order" className="hover:text-red-400">
              Order History
            </Link>
          </li>
          <li>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4">
          {/* Mobile Search */}
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-l-lg bg-white text-gray-800 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-r-lg"
            >
              Search
            </button>
          </div>

          {/* Mobile Links */}
          <ul className="flex flex-col space-y-2">
            <li>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block text-white hover:text-red-400"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/menu"
                onClick={() => setIsOpen(false)}
                className="block text-white hover:text-red-400"
              >
                Menu
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block text-white hover:text-red-400"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="block text-white hover:text-red-400"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                to="/order"
                onClick={() => setIsOpen(false)}
                className="block text-white hover:text-red-400"
              >
                Order History
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
