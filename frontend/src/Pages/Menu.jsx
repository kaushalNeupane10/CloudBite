import { useEffect, useState, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../Components/axiosInstance";
import { AuthContext } from "../context/AuthContext.jsx";

// Load Stripe with public key from .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const search = params.get("search") || "";
        const response = await axiosInstance.get(`/menu-items/?search=${search}`);
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
        toast.error("Failed to load menu items.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [location.search]);

  // Add item to cart
  const addToCart = async (menuItemId) => {
    if (!user) {
      toast.info("Please login or signup first!");
      navigate("/login");
      return; // stop function if not logged in
    }

    try {
      await axiosInstance.post("/cart-items/", {
        menu_item_id: menuItemId,
        quantity: 1,
      });
      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error.response?.data || error.message);
      toast.error("Could not add item to cart.");
    }
  };

  // Buy Now using Stripe
  const handleBuyNow = async (menuItemId) => {
    if (!user) {
      toast.info("Please login or signup first!");
      navigate("/login");
      return; // stop function if not logged in
    }

    try {
      const response = await axiosInstance.post("/create-checkout-session/", {
        menu_item_id: menuItemId,
        quantity: 1,
      });

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      toast.error("Payment failed. Try again.");
    }
  };

  if (loading) {
    return <div className="text-center text-white py-10">Loading menu...</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Our Menu</h1>
      <p className="text-center text-gray-300 mb-8">
        Explore our diverse selection of chef-crafted dishes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-xl border border-white p-4 sm:p-5 shadow-lg hover:shadow-2xl transition-all max-w-sm w-full mx-auto hover:-translate-y-1 duration-300 flex flex-col"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-center pb-2 truncate">
              {item.title}
            </h3>
            <img
              src={item.image || "https://via.placeholder.com/300x200?text=No+Image"}
              alt={item.title}
              className="w-full h-44 sm:h-48 object-cover rounded-md mb-4"
            />
            <p className="text-gray-400 text-sm sm:text-base text-center leading-relaxed flex-1">
              {item.description?.length > 80
                ? item.description.slice(0, 80) + "..."
                : item.description}
            </p>
            <p className="text-red-400 text-lg sm:text-xl font-semibold mt-3 text-center">
              ${parseFloat(item.price).toFixed(2)}
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm sm:text-base font-medium w-full sm:w-1/2"
                onClick={() => addToCart(item.id)}
              >
                Add to Cart
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm sm:text-base font-medium w-full sm:w-1/2"
                onClick={() => handleBuyNow(item.id)}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
