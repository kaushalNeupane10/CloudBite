import React from "react";

const HappyCustomers = () => {
  const testimonials = [
    {
      id: 1,
      name: "Aarav Sharma",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      message:
        "CloudBite made my weekends so much easier! The food always arrives hot, fresh, and absolutely delicious. It’s like having a restaurant right in my kitchen.",
    },
    {
      id: 2,
      name: "Sneha Gurung",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      message:
        "I love the variety CloudBite offers. Every meal tastes premium, and the delivery is super fast. Definitely my go-to for a quick gourmet experience.",
    },
    {
      id: 3,
      name: "Rohan Thapa",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
      message:
        "CloudBite is simply awesome! The meals are healthy, perfectly cooked, and full of flavor. The customer support is also top-notch. Highly recommended!",
    },
  ];


  return (
    <div className="text-white min-h-screen py-16 px-4 sm:px-8 lg:px-16">
      {/* Header */}
      <h1 className="text-3xl sm:text-5xl font-bold text-center text-orange-400 mb-6">
        Happy Customers 🎉
      </h1>
      <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12 text-base sm:text-lg leading-relaxed">
        At CloudBite, customer satisfaction is at the heart of everything we do.
        Here’s what our food lovers have to say about their experience — from
        flavor to freshness, they’re all smiles!
      </p>

      {/* Testimonials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((customer) => (
          <div
            key={customer.id}
            className="bg-gray-900 border border-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
          >
            <p className="text-gray-200 text-base mb-6 leading-relaxed flex-1">
              “{customer.message}”
            </p>
            <div className="flex items-center gap-4 mt-4">
              <img
                src={customer.image}
                alt={customer.name}
                className="w-14 h-14 rounded-full border-2 border-white object-cover"
              />
              <div>
                <h4 className="text-lg font-semibold text-orange-400">
                  {customer.name}
                </h4>
                <p className="text-gray-400 text-sm">CloudBite Customer</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HappyCustomers;
