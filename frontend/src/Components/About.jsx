export default function About() {
  return (
    <>
      <div className="bg-gray-900 text-white min-h-screen">
        {/* About Section */}
        <section className="py-12 container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-orange-400">
              About CloudBite
            </h2>
            <p className="mt-2 text-gray-400">
              Revolutionizing food delivery with our innovative cloud kitchen
              concept
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-3xl font-semibold text-orange-400">
                Our Story
              </h3>
              <p className="mt-4 text-gray-300">
                Founded in 2025, CloudBite emerged from a vision to
                revolutionize the food delivery industry. We recognized the
                growing demand for high-quality, restaurant-grade meals
                delivered directly to people&apos;s homes.
              </p>
              <p className="mt-4 text-gray-300">
                Our state-of-the-art cloud kitchen combines culinary expertise
                with technological innovation, allowing us to create exceptional
                dining experiences while maintaining the highest standards of
                quality.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80"
                alt="Our Kitchen"
                className="rounded-md shadow-lg"
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
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
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-4 bg-gray-800 rounded-md"
              >
                <div className="text-orange-400 text-4xl mb-2">
                  {feature.icon}
                </div>
                <h4 className="font-semibold">{feature.title}</h4>
                <p className="text-gray-300">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
