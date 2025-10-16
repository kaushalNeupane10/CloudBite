// src/pages/Home.jsx
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

import Hero from "../Components/Hero";
import MenuDishes from "../Components/MenuDishes";
import About from "../Components/About";
import axiosInstance from "../Components/axiosInstance";
import HappyCustomers from "../Components/HappyCustomers";
import Feature from "../Components/Feature";
import { AuthContext } from "../context/AuthContext.jsx";

// Load Stripe using env variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Home() {
  const [topDishes, setTopDishes] = useState([]);
  const { user, loading } = useContext(AuthContext); // <-- AuthContext
  const navigate = useNavigate();

  // Fetch top dishes
  useEffect(() => {
    const fetchTopDishes = async () => {
      try {
        const res = await axiosInstance.get("/menu-items/");
        if (Array.isArray(res.data)) {
          setTopDishes(res.data.slice(0, 4)); // Take first 4 items
        } else {
          console.warn("Unexpected response data:", res.data);
          toast.error("Failed to load top dishes.");
        }
      } catch (err) {
        console.error("Failed to fetch top dishes:", err.response?.data || err.message);
        toast.error("Couldn't load top dishes.");
      }
    };

    fetchTopDishes();
  }, []);

  // Add item to cart
  const addToCart = async (menuItemId) => {
    if (!user) {
      toast.info("Please login or signup first!");
      navigate("/login");
      return;
    }

    try {
      await axiosInstance.post("/cart-items/", {
        menu_item_id: menuItemId,
        quantity: 1,
      });
      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error.response?.data || error.message);
      toast.error(error.response?.data?.detail || "Could not add item to cart.");
    }
  };

  // Buy now with Stripe checkout
  const handleBuyNow = async (menuItemId) => {
    if (!user) {
      toast.info("Please login or signup first!");
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.post("/create-checkout-session/", {
        menu_item_id: menuItemId,
        quantity: 1,
      });

      const stripe = await stripePromise;
      if (stripe && response.data.sessionId) {
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      } else {
        toast.error("Stripe checkout failed.");
      }
    } catch (error) {
      console.error("Buy Now error:", error.response?.data || error.message);
      toast.error(error.response?.data?.detail || "Payment failed. Try again.");
    }
  };

  // Show loading if user data is still being fetched
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mb-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-400 min-h-screen">
      <Hero />
      <MenuDishes
        dishes={topDishes}
        addToCart={addToCart}
        handleBuyNow={handleBuyNow}
      />
      <About />
      <HappyCustomers />
      <Feature />
    </div>
  );
}
