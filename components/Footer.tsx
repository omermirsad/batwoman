import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-gray-800 mt-20 sm:mt-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-400">
        <p>For inquiries, please email: contact@darkechology.com</p>
        <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} Dark Echology. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;