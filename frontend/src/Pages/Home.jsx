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
  const { user } = useContext(AuthContext); // <-- Get user from context
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("menu-items/")
      .then((res) => {
        setTopDishes(res.data.slice(0, 4));
      })
      .catch((err) => {
        console.error("Failed to fetch top dishes:", err);
        toast.error("Couldn't load top dishes.");
      });
  }, []);

  const addToCart = async (menuItemId) => {
    if (!user) {
      toast.info("Please login or signup first!");
      navigate("/login");
      return;
    }

    try {
      await axiosInstance.post("cart-items/", {
        menu_item_id: menuItemId,
        quantity: 1,
      });
      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error.response?.data || error.message);
      toast.error("Could not add item to cart.");
    }
  };

  const handleBuyNow = async (menuItemId) => {
    if (!user) {
      toast.info("Please login or signup first!");
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.post("create-checkout-session/", {
        menu_item_id: menuItemId,
        quantity: 1,
      });

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
    } catch (error) {
      console.error("Buy Now error:", error.response?.data || error.message);
      toast.error("Payment failed. Try again.");
    }
  };

  return (
    <div className="bg-gray-900 text-gray-400">
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
