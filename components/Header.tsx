import React, { useState, useEffect } from 'react';
import { BatIcon } from './icons/BatIcon';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Ask Dr. Echo', href: '#ai-chat' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center space-x-3 text-xl font-bold text-white hover:text-indigo-400 transition-colors">
            <BatIcon className="w-8 h-8" />
            <span>Dark Echology</span>
          </a>
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 font-medium">
                {link.name}
              </a>
            ))}
          </nav>
          <a href="#contact" className="hidden sm:inline-block bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 font-semibold">
            Contact
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;