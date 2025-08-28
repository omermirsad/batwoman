import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3')" }}></div>
      <div className="absolute inset-0 bg-gray-900 bg-opacity-70"></div>
      <div className="relative z-10 p-4">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-4">
          WELCOME TO DARK ECHOLOGY
        </h1>
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-300 mb-8">
          Unveiling the secrets of the night. Thinking about the ecological balance in nature and how we can protect BATS and reduce the negative impact of human activities.
        </p>
        <a href="#about" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300">
            Discover More
        </a>
      </div>
    </section>
  );
};

export default Hero;