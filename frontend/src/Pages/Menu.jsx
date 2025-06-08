import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { toast } from "react-toastify";
// import MenuDishes from "../Components/MenuDishes";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const stripePromise = loadStripe(
    "pk_test_51RTzRuQlgYgZPrnh2q1XFwzgJ9T5GcEiXhhHztDDSlnqw8sjr87scKCMU3Lv7EFbIr0vGYnaWoGMCjWuL55qp7vA00BsM3PJ8Y"
  );

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/menu-items/")
      .then((response) => {
        setMenuItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
        toast.error("Failed to load menu items.");
        setLoading(false);
      });
  }, []);

  const addToCart = async (menuItemId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add to cart.");
        return;
      }

      await axios.post(
        "http://localhost:8000/api/cart-items/",
        {
          menu_item_id: menuItemId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Item added to cart!");
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data || error.message
      );
      toast.error("Could not add item to cart.");
    }
  };

  const handleBuyNow = async (menuItemId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to purchase.");
      return;
    }

    const response = await axios.post(
      "http://localhost:8000/api/create-checkout-session/",
      {
        menu_item_id: menuItemId,
        quantity: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
  } catch (error) {
    console.error("Payment error:", error.response?.data || error.message);
    toast.error("Payment failed. Try again.");
  }
};


  if (loading)
    return <div className="text-center text-white py-10">Loading menu...</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Our Menu</h1>
      <p className="text-center text-gray-300 mb-8">
        Explore our diverse selection of chef-crafted dishes, prepared with
        premium ingredients in our cloud kitchen.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-2xl transition-shadow"
          >
            <h3 className="text-xl font-semibold text-center pb-2">
              {item.title}
            </h3>
            <img
              src={
                item.image
                  ? item.image
                  : "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={item.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <p className="text-gray-400 text-sm">{item.description}</p>
            <p className="text-red-400 text-lg font-semibold mt-2 text-center">{`$${item.price}`}</p>
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
            {/* <MenuDishes dishes={menuItems.slice(0, 4)} addToCart={addToCart} /> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
