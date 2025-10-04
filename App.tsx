import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Blog from './components/Blog';
import GeminiChat from './components/GeminiChat';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnimatedSection from './components/AnimatedSection';
import BlogPostPage from './components/BlogPostPage';
import { blogPosts } from './data/blogData';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange, false);
    
    // Handle initial load with hash
    if (window.location.hash) {
        handleHashChange();
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
    };
  }, []);
  
  const renderContent = () => {
    if (route.startsWith('#/blog/')) {
      const slug = route.substring('#/blog/'.length);
      const post = blogPosts.find(p => p.slug === slug);
      
      if (post) {
        return <BlogPostPage post={post} />;
      }
      // If post is not found, redirect to the homepage's blog section
      window.location.hash = '#blog';
      return null;
    }

    return (
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
    );
  };

  return (
    <div className="bg-[#111121] text-gray-300 antialiased">
      <Header />
      {renderContent()}
      <Footer />
    </div>
  );
};

export default App;
