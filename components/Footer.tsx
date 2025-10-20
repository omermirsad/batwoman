import React from 'react';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { GitHubIcon } from './icons/GitHubIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1a2e]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500">
        <div className="flex justify-center gap-6 mb-6">
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="text-gray-400 hover:text-indigo-400 transition-colors"
          >
            <LinkedInIcon className="w-6 h-6" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile"
            className="text-gray-400 hover:text-indigo-400 transition-colors"
          >
            <InstagramIcon className="w-6 h-6" />
          </a>
          <a
            href="https://github.com/darkechology"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="text-gray-400 hover:text-indigo-400 transition-colors"
          >
            <GitHubIcon className="w-6 h-6" />
          </a>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} Dark Echology | Bat Ecology & Conservation. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;