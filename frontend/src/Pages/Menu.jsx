import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import axiosInstance from "../Components/axiosInstance";

// Load Stripe with key from .env
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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

  const addToCart = async (menuItemId) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login to add to cart.");

    try {
      await axiosInstance.post("/cart-items/", {
        menu_item_id: menuItemId,
        quantity: 1,
      });
      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      toast.error("Could not add item to cart.");
    }
  };

  const handleBuyNow = async (menuItemId) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login to purchase.");

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
    <div className="bg-gray-900 text-white min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Our Menu</h1>
      <p className="text-center text-gray-300 mb-8">
        Explore our diverse selection of chef-crafted dishes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-2xl transition-shadow"
          >
            <h3 className="text-xl font-semibold text-center pb-2">{item.title}</h3>
            <img
              src={item.image || "https://via.placeholder.com/300x200?text=No+Image"}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <p className="text-gray-400 text-sm">{item.description}</p>
            <p className="text-red-400 text-lg font-semibold mt-2 text-center">
              ${item.price}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex-1"
                onClick={() => addToCart(item.id)}
              >
                Add to Cart
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex-1"
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
