import React from 'react';

const About: React.FC = () => {
  const expertiseItems = [
    { title: 'Research Focus', tags: ['Biodiversity Conservation', 'Renewable Energy', 'Climate Change'] },
    { title: 'Technical Expertise', tags: ['Acoustic Analysis', 'Molecular DNA'] },
    { title: 'Languages', tags: ['English', 'French', 'Arabic', 'Turkish'] },
  ];

  const educationItems = [
    { school: 'Boğaziçi University', degree: 'PhD, Environmental Science (2021 - 2025)' },
    { school: 'Université de Bordeaux', degree: 'Master of Science, Ecology and Evolutionary Biology (2017 - 2019)' },
    { school: 'Lebanese University - Faculty of Sciences', degree: 'Bachelor of Science, Biology (2014 - 2017)' },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold tracking-tight text-white mb-12 text-center">About Dark Echology</h2>
      <div className="space-y-16">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
          <div className="md:col-span-1 flex justify-center">
            <img 
              src="https://kabecology.com/wp-content/uploads/2022/09/20220429_110541_ed.jpg"
              alt="Maha Salameh, a chiropterologist and bat ecology researcher."
              className="rounded-xl shadow-lg w-full max-w-xs md:max-w-none ring-2 ring-offset-4 ring-offset-[#111121] ring-indigo-600/50"
            />
          </div>
          <div className="md:col-span-2">
            <p className="text-lg leading-relaxed text-gray-300">
              I am Maha Salameh, a chiropterologist and PhD researcher in Molecular Ecology and Evolution at Boğaziçi University, Istanbul. My work in bat ecology focuses on biodiversity conservation, renewable energy impacts, and climate change mitigation. At KAB Ecology, I help advise on bat–wind farm interactions by analyzing acoustic data with BatExplorer and Kaleidoscope Pro and conducting molecular DNA analyses from field samples. My goal is to reduce bat mortality while supporting the transition to clean wind energy. I hold a Master’s degree in Terrestrial Ecology and Evolution from the University of Bordeaux, where my research examined the global distribution of termite mound landscapes and the reproductive strategies of Cryphonectria parasitica, the fungus responsible for chestnut blight. I earned my Bachelor’s in Biology from the Lebanese University in 2017.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Education</h3>
            <ul className="space-y-4">
              {educationItems.map((item, index) => (
                <li key={index} className="p-4 rounded-lg bg-indigo-600/10">
                  <p className="font-semibold text-gray-200">{item.school}</p>
                  <p className="text-sm text-gray-400">{item.degree}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Professional Experience</h3>
            <div className="p-4 rounded-lg bg-indigo-600/10">
              <p className="font-semibold text-gray-200">KAB Ecology</p>
              <p className="text-sm text-gray-400">Ecology Consultant</p>
            </div>
          </div>
          {expertiseItems.map((section) => (
            <div key={section.title}>
              <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
              <div className="flex flex-wrap gap-2">
                {section.tags.map(tag => (
                   <span key={tag} className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-600/20 text-indigo-300">
                     {tag}
                   </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4">My Motivation</h3>
          <div className="border-l-4 border-indigo-600 pl-4">
            <p className="italic text-lg leading-relaxed text-gray-400">
              "Growing up in Lebanon, developed a deep appreciation for the natural world and a strong desire to protect its biodiversity. This passion led to the creation of Dark Echology, a platform to contribute to the preservation of these fascinating creatures and their vital role in our ecosystems."
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;