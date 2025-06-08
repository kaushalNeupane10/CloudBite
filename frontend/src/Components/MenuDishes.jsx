export default function MenuDishes({ dishes = [], addToCart }) {
  if (!Array.isArray(dishes)) {
    return null; // or fallback UI
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {dishes.map((item) => (
        <div
          key={item.id}
          className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-2xl transition-shadow"
        >
          <h3 className="text-xl font-semibold text-center">{item.title}</h3>
          <img
            src={
              item.image
                ? item.image
                : "https://via.placeholder.com/300x200?text=No+Image"
            }
            alt={item.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <p className="text-gray-400 text-sm">{item.description}</p>
          <p className="text-red-400 text-lg font-semibold mt-2 text-center">
            ${item.price}
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => addToCart?.(item.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex-1"
            >
              Add to Cart
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex-1">
              Buy Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
