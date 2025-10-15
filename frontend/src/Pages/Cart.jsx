import { useEffect, useState, useContext } from "react";
import axiosInstance from "../Components/axiosInstance";
import { AuthContext } from "../context/AuthContext.jsx";

export default function CartPage({ updateCartCount }) {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Merge guest cart if any
    const mergeGuestCart = async () => {
      if (user) {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        for (const menuItemId of guestCart) {
          try {
            await axiosInstance.post("cart-items/", { menu_item_id: menuItemId, quantity: 1 });
          } catch (error) {
            console.error("Error merging guest cart item:", error);
          }
        }
        localStorage.removeItem("guestCart");
      }
    };

    const fetchCart = async () => {
      setLoading(true);
      try {
        await mergeGuestCart();
        const response = await axiosInstance.get("cart-items/");
        setCartItems(response.data);

        // Update cart notification in navbar
        if (updateCartCount) updateCartCount(response.data.length);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const handleRemove = async (id) => {
    try {
      await axiosInstance.delete(`cart-items/${id}/`);
      const updatedCart = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedCart);

      // Update cart notification in navbar
      if (updateCartCount) updateCartCount(updatedCart.length);
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      const lineItems = cartItems.map((item) => ({
        menu_item_id: item.menu_item.id,
        quantity: item.quantity,
      }));

      const response = await axiosInstance.post("create-multi-checkout-session/", { items: lineItems });

      const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.menu_item.price * item.quantity,
    0
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-4"></div>
        <p className="text-xl">Loading your cart...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-extrabold text-center text-orange-600 mb-8">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4"
              >
                <img
                  src={
                    item.menu_item?.image ||
                    "https://via.placeholder.com/100x100?text=No+Image"
                  }
                  alt={item.menu_item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg font-semibold">{item.menu_item.title}</h2>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-500">
                    ${(item.menu_item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="mt-2 bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="mt-8 text-right">
            <p className="text-2xl font-bold text-gray-800 mb-4">
              Total: ${total.toFixed(2)}
            </p>
            <button
              onClick={handleCheckout}
              className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-6 py-3 rounded-lg shadow-md transition"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
