import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import GeminiChat from './components/GeminiChat';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-300 antialiased">
      <Header />
      <main>
        <Hero />
        <section id="about" className="py-20 sm:py-32">
            <About />
        </section>
        <section id="services" className="py-20 sm:py-32 bg-gray-800">
            <Services />
        </section>
        <section id="ai-chat" className="py-20 sm:py-32">
            <GeminiChat />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;