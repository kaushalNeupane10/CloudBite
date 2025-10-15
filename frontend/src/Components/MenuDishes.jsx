import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { toast } from "react-toastify";

const MenuDishes = ({ dishes = [], handleBuyNow = () => {}, loading = false }) => {
  const { addToCart } = useCart(); // use CartContext

  const handleAddToCart = async (id) => {
    try {
      await addToCart(id, 1); // Add 1 quantity
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add item to cart");
    }
  };

  if (loading || !dishes.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mb-4"></div>
        <p className="text-xl">Loading Top menu items...</p>
      </div>
    );
  }

  return (
    <div className="mb-10 px-4 mt-6 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mt-2 text-white text-center mb-6">
        Top Picks
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dishes.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-2xl border border-white p-4 shadow-lg hover:shadow-2xl transition-shadow flex flex-col"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-center text-white pb-2 truncate">
              {item.title}
            </h3>
            <img
              src={item.image || "https://via.placeholder.com/300x200?text=No+Image"}
              alt={item.title}
              className="w-full h-48 sm:h-52 object-cover rounded-md mb-4"
            />
            <p className="text-gray-400 text-sm sm:text-base flex-1">
              {item.description?.length > 80
                ? item.description.slice(0, 80) + "..."
                : item.description}
            </p>
            <p className="text-red-400 text-lg sm:text-xl font-semibold mt-2 text-center">
              ${parseFloat(item.price).toFixed(2)}
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                className="bg-red-500 border border-white hover:bg-red-600 text-white px-4 py-2 rounded-md flex-1 text-sm sm:text-base"
                onClick={() => handleAddToCart(item.id)}
              >
                Add to Cart
              </button>
              <button
                className="bg-gray-700 border border-white hover:bg-gray-600 text-white px-4 py-2 rounded-md flex-1 text-sm sm:text-base"
                onClick={() => handleBuyNow(item.id)}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/menu"
          className="text-orange-500 hover:text-orange-400 font-semibold text-base sm:text-lg"
        >
          See More →
        </Link>
      </div>
    </div>
  );
};

export default MenuDishes;
