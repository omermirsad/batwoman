import React from 'react';
import { SoundWaveIcon } from './icons/SoundWaveIcon';
import { ResearchIcon } from './icons/ResearchIcon';
import { ConsultIcon } from './icons/ConsultIcon';

const services = [
  {
    icon: <SoundWaveIcon className="h-10 w-10 text-indigo-400" />,
    title: 'Bat Sound Analysis',
    description: 'Utilizing state-of-the-art software to analyze and identify bat species from echolocation calls for environmental assessments.',
  },
  {
    icon: <ResearchIcon className="h-10 w-10 text-indigo-400" />,
    title: 'Field Research',
    description: 'Expert-led field surveys, including mist-netting, acoustic monitoring, and roost identification for conservation efforts.',
  },
  {
    icon: <ConsultIcon className="h-10 w-10 text-indigo-400" />,
    title: 'Ecological Consulting',
    description: 'Providing expert advice on habitat management, mitigation strategies, and conservation planning to protect bat populations.',
  },
];

const Services: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Our Services</h2>
        <p className="mt-4 text-lg text-gray-400">Advancing bat conservation through science and technology.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-gray-900 p-8 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-800 mb-6">
                {service.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
            <p className="text-gray-400">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;