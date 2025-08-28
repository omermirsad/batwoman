import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="md:col-span-1">
          <img 
            src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3" 
            alt="A team of environmental scientists in the field" 
            className="rounded-lg shadow-xl object-cover w-full h-full" 
          />
        </div>
        <div className="md:col-span-1 text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-indigo-400 mb-4">About Our Work</h2>
          <p className="text-lg text-gray-300 mb-4">
            We are dedicated to the study of chiropterology (the study of bats). Our work combines field research with advanced bioacoustic analysis to understand bat populations and advocate for their conservation.
          </p>
          <p className="text-gray-400 mb-6">
            With a mission to dispel myths and highlight their ecological importance, our organization works to protect these vital creatures of the night and their habitats.
          </p>
          <a href="#contact" className="bg-transparent border-2 border-indigo-500 text-indigo-400 px-6 py-3 rounded-md hover:bg-indigo-500 hover:text-white transition-all duration-300">
            Get In Touch
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;