import React from 'react';
import { ConsultIcon } from './icons/ConsultIcon';
import { ResearchIcon } from './icons/ResearchIcon';
import { SoundWaveIcon } from './icons/SoundWaveIcon';

const services = [
  {
    icon: <SoundWaveIcon className="w-10 h-10" />,
    title: 'Bat Sound Analysis',
    description: (
      <>
        Expert analysis of echolocation and social calls using advanced software like <strong className="font-semibold text-gray-200">BatExplorer</strong> and <strong className="font-semibold text-gray-200">Kaleidoscope Pro</strong>. We identify species, assess activity, and monitor population changes, delivering detailed reports with actionable insights for research and conservation projects.
      </>
    ),
  },
  {
    icon: <ResearchIcon className="w-10 h-10" />,
    title: 'Field Research',
    description: 'Comprehensive field research on bat populations. Our methodologies include acoustic monitoring, mist netting, radio-tracking, and roost surveys, tailored to your project\'s specific needs. We provide detailed reports on species composition, abundance, distribution, and habitat use.',
  },
  {
    icon: <ConsultIcon className="w-10 h-10" />,
    title: 'Ecological Consulting',
    description: 'Expert ecological consulting to support conservation planning and develop effective mitigation strategies for bats. Our expertise includes habitat and impact assessments, and the development of conservation management plans for developers, land managers, and conservation organizations.',
  },
];

const Services: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Professional Services</h2>
        <p className="text-lg text-gray-400">
          Specialized services to support bat research, conservation, and management with a professional, scientific approach.
        </p>
      </div>
      <div className="space-y-12">
        {services.map((service) => (
          <div key={service.title} className="p-8 rounded-lg bg-[#111121] border border-indigo-600/30 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start gap-6">
              <div className="bg-indigo-600/20 p-3 rounded-lg text-indigo-500">
                {service.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-base text-gray-400">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;