import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1a2e]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500">
        <p className="text-sm">&copy; {new Date().getFullYear()} Dr. Echo | Bat Ecology & Conservation. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;