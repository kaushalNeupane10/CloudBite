import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/cart-items/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart-items/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(cartItems.filter((item) => item.id !== id));
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

      const response = await axios.post(
        "http://localhost:8000/api/create-multi-checkout-session/",
        { items: lineItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sessionId = response.data.sessionId;
      const stripe = window.Stripe("pk_test_51RTzRuQlgYgZPrnh2q1XFwzgJ9T5GcEiXhhHztDDSlnqw8sjr87scKCMU3Lv7EFbIr0vGYnaWoGMCjWuL55qp7vA00BsM3PJ8Y");
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.menu_item.price * item.quantity,
    0
  );

  if (loading) return <p className="text-center py-10">Loading cart...</p>;

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
                  src={item.menu_item?.image || "https://via.placeholder.com/100x100?text=No+Image"}
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
