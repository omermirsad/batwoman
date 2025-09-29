import React, { useState, useEffect } from 'react';
import { EchoIcon } from './icons/EchoIcon';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Ask Dr. Echo', href: '#ai-chat' },
];

const MobileMenu: React.FC<{onClose: () => void}> = ({onClose}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#111121] text-gray-300 flex flex-col items-center justify-center">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
        </button>
        <nav className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={onClose} className="text-2xl font-medium text-gray-300 hover:text-indigo-500 transition-colors">
                {link.name}
              </a>
            ))}
        </nav>
        <a href="#contact" onClick={onClose} className="mt-12 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105">
            Contact
        </a>
    </div>
  )
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#111121]/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#" className="flex items-center gap-3 text-white">
              <EchoIcon className="h-8 w-8 text-indigo-500" />
              <span className="text-xl font-bold tracking-tight">Dr. Echo</span>
            </a>
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-sm font-medium text-gray-300 hover:text-indigo-500 transition-colors">
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <a href="#contact" className="hidden md:inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105">
                Contact
              </a>
              <button className="md:hidden text-white" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
    </>
  );
};

export default Header;