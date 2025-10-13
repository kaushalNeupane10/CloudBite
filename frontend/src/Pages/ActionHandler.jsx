import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../Components/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function ActionHandler() {
  const { actionType, menuItemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const performAction = async () => {
      try {
        if (actionType === "addToCart") {
          await axiosInstance.post("cart-items/", {
            menu_item_id: menuItemId,
            quantity: 1,
          });
          toast.success("Item added to cart!");
          navigate("/");
        } else if (actionType === "buyNow") {
          const response = await axiosInstance.post("create-checkout-session/", {
            menu_item_id: menuItemId,
            quantity: 1,
          });
          const stripe = await stripePromise;
          await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("ActionHandler error:", error.response?.data || error.message);
        toast.error("Could not complete your action.");
        navigate("/");
      }
    };

    performAction();
  }, [actionType, menuItemId, navigate]);

  return null;
}
