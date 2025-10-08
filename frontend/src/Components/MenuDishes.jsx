import { Link } from "react-router-dom";

const MenuDishes = ({
  dishes = [],
  addToCart = () => {},
  handleBuyNow = () => {},
}) => {
  return (
    <div className="mb-10 px-4 mt-6 sm:px-6 lg:px-8">
      {/* Header */}
      <h2 className="text-2xl font-bold mt-2 text-white text-center mb-6">
        Top Picks
      </h2>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dishes.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-2xl border border-white p-4 shadow-lg hover:shadow-2xl transition-shadow flex flex-col"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-center text-white pb-2">
              {item.title}
            </h3>
            <img
              src={
                item.image
                  ? item.image
                  : "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={item.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <p className="text-gray-400 text-sm flex-1">{item.description}</p>
            <p className="text-red-400 text-lg font-semibold mt-2 text-center">
              ${parseFloat(item.price).toFixed(2)}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex-1 text-sm sm:text-base"
                onClick={() => addToCart(item.id)}
              >
                Add to Cart
              </button>
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex-1 text-sm sm:text-base"
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
