export default function Feature() {
  const features = [
    {
      icon: "⏱️",
      title: "Fast Delivery",
      text: "Quick and reliable delivery to your doorstep",
    },
    {
      icon: "🏅",
      title: "Quality First",
      text: "Premium ingredients and expert preparation",
    },
    {
      icon: "👩‍🍳",
      title: "Expert Team",
      text: "Skilled chefs and kitchen professionals",
    },
    {
      icon: "🚚",
      title: "Wide Coverage",
      text: "Serving multiple locations in the city",
    },
  ];

  return (
    <div className="text-white py-16 px-4 sm:px-8 lg:px-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-orange-400 mb-12">
        Why Choose CloudBite?
      </h2>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-2xl border border-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center"
          >
            <div className="text-orange-400 text-5xl mb-4">{feature.icon}</div>
            <h4 className="font-semibold text-lg sm:text-xl mb-2">{feature.title}</h4>
            <p className="text-gray-300 text-sm sm:text-base">{feature.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
