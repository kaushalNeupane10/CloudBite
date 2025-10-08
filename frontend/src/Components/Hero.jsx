const Hero = () => {
  return (
    <section
      className="h-screen flex items-center justify-center bg-gray-900 bg-cover bg-center px-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
      }}
    >
      <div className="text-center p-6 sm:p-10 rounded-lg max-w-4xl mb-10 -mt-30">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
          Restaurant-<span className="text-orange-500">Quality</span> Meals,
          <br />
          Delivered to Your Door
        </h1>
        <p className="text-base sm:text-lg text-white mt-4 mb-6 leading-relaxed">
          Experience gourmet dining at home with our chef-crafted meals,
          <br />
          prepared in our state-of-the-art cloud kitchen.
        </p>
      </div>
    </section>
  );
};

export default Hero;
