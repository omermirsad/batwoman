import React, { useState } from 'react';
import { SoundWaveIcon } from './icons/SoundWaveIcon';

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
            Dark Echology is dedicated to advancing bat ecology research and conservation efforts. Explore our work and discover how we're making a difference for these vital creatures of the night.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp animation-delay-400">
            <a href="#about" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-indigo-500/50">
              Explore Our Work
            </a>
            <button
              onClick={() => setIsPopupOpen(true)}
              className="inline-flex items-center justify-center rounded-lg border border-indigo-600/50 bg-indigo-600/20 px-8 py-3 text-base font-bold text-indigo-300 transition-colors hover:bg-indigo-600/30"
              aria-haspopup="dialog"
              aria-expanded={isPopupOpen}
            >
              Listen to the bats
            </button>
          </div>
        </div>
      </div>
      {isPopupOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsPopupOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
        >
          <div 
            className="bg-[#1a1a2e] p-8 rounded-lg shadow-xl max-w-sm w-full text-center border border-indigo-600/30 animate-scaleIn transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-500">
                <SoundWaveIcon className="h-7 w-7" />
            </div>
            <h3 id="popup-title" className="text-2xl font-bold text-white mb-3">Want to hear a bat joke?</h3>
            <p className="text-base text-gray-400 leading-relaxed">
                ...You can't! Their calls are ultrasonic—so high-pitched they are imperceptible to the human ear. This is how they use echolocation to "see" with sound in complete darkness.
            </p>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-2.5 text-base font-bold text-white shadow-lg transition-transform hover:scale-105"
            >
              Fascinating!
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;