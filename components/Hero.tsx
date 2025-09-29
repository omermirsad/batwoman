import React, { useState } from 'react';

const Hero: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          src="https://www.pexels.com/download/video/7181665/"
          poster="https://images.pexels.com/videos/2864313/free-video-2864313.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111121] via-[#111121]/70 to-transparent"></div>
      </div>
      <div className="relative z-10 p-4 container mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl animate-fadeInUp">
            Protecting Our Ecosystems, One Bat at a Time
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300 animate-fadeInUp animation-delay-200">
            Dr. Echo is dedicated to advancing bat ecology research and conservation efforts. Explore our work and discover how we're making a difference for these vital creatures of the night.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp animation-delay-400">
            <a href="#about" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-indigo-500/50">
              Explore Our Work
            </a>
            <button
              onClick={() => setIsPopupOpen(true)}
              className="inline-flex items-center justify-center rounded-lg border border-indigo-600/50 bg-indigo-600/20 px-8 py-3 text-base font-bold text-indigo-300 transition-colors hover:bg-indigo-600/30"
            >
              Listen to the bats
            </button>
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a2e] p-8 rounded-lg shadow-xl max-w-sm w-full text-center border border-indigo-600/30">
            <h3 className="text-2xl font-bold text-white mb-4">Shhh... listen closely!</h3>
            <p className="text-lg text-gray-300">
              You can't hear them, can you? That's because bat calls are too high for humans to hear! 😉
            </p>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2 text-base font-bold text-white shadow-lg transition-transform hover:scale-105"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;