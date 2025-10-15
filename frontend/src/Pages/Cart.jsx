import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import axiosInstance from "../Components/axiosInstance";
import { toast } from "react-toastify";
import { FiShoppingCart } from "react-icons/fi";
export default function CartPage() {
  const { user } = useContext(AuthContext);
  const {
    cartItems,
    setCartCount,
    removeFromCart,
    updateCartQuantity,
    fetchCart,
  } = useCart();
  const [loading, setLoading] = useState(true);

  // Fetch cart on load
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        await fetchCart();
      } catch (err) {
        console.error("Error loading cart:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [user]);

  const handleRemove = async (menuItemId) => {
    await removeFromCart(menuItemId);
  };

  const handleQuantityChange = async (menuItemId, delta) => {
    const item = cartItems.find((i) => i.menu_item?.id === menuItemId);
    if (!item) return;
    await updateCartQuantity(menuItemId, item.quantity + delta);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.info("Your cart is empty");
      return;
    }
    try {
      const lineItems = cartItems.map((item) => ({
        menu_item_id: item.menu_item.id,
        quantity: item.quantity,
      }));

      const response = await axiosInstance.post(
        "/create-multi-checkout-session/",
        { items: lineItems }
      );
      const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.menu_item.price || 0) * item.quantity,
    0
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-4"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-extrabold text-center text-orange-600 mb-8 flex items-center justify-center gap-2">
          Cart
          <FiShoppingCart className="w-8 h-8" />
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.menu_item.id}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4"
              >
                <img
                  src={
                    item.menu_item.image ||
                    "https://via.placeholder.com/100x100?text=No+Image"
                  }
                  alt={item.menu_item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg font-semibold">
                    {item.menu_item.title}
                  </h2>
                  <div className="flex justify-center sm:justify-start items-center mt-1 gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.menu_item.id, -1)
                      }
                      className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded"
                    >
                      -
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.menu_item.id, 1)}
                      className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-500">
                    ${(item.menu_item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item.menu_item.id)}
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
