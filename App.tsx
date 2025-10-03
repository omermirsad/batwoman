import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Blog from './components/Blog';
import GeminiChat from './components/GeminiChat';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnimatedSection from './components/AnimatedSection';

const App: React.FC = () => {
  return (
    <div className="bg-[#111121] text-gray-300 antialiased">
      <Header />
      <main>
        <Hero />
        <AnimatedSection>
          <section id="about" className="py-20 sm:py-32 bg-[#111121]">
              <About />
          </section>
        </AnimatedSection>
        <AnimatedSection>
          <section id="services" className="py-20 sm:py-32 bg-[#1a1a2e]">
              <Services />
          </section>
        </AnimatedSection>
        <AnimatedSection>
          <section id="blog" className="py-20 sm:py-32 bg-[#111121]">
              <Blog />
          </section>
        </AnimatedSection>
        <AnimatedSection>
          <section id="ai-chat" className="py-20 sm:py-32 bg-[#1a1a2e]">
              <GeminiChat />
          </section>
        </AnimatedSection>
        <AnimatedSection>
          <section id="contact" className="py-20 sm:py-32 bg-[#111121]">
            <Contact />
          </section>
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
};

export default App;
