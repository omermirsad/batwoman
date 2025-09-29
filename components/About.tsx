import React from 'react';

const About: React.FC = () => {
  const expertiseItems = [
    { title: 'Research Focus', tags: ['Biodiversity Conservation', 'Renewable Energy', 'Climate Change'] },
    { title: 'Technical Expertise', tags: ['Acoustic Analysis', 'Molecular DNA'] },
    { title: 'Languages', tags: ['English', 'French', 'Arabic', 'Turkish'] },
  ];

  const educationItems = [
    { school: 'University of California, Berkeley', degree: 'PhD Candidate, Ecology' },
    { school: 'University of Michigan', degree: 'MSc in Environmental Science' },
    { school: 'American University of Beirut', degree: 'BSc in Biology' },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold tracking-tight text-white mb-8 text-center sm:text-left">About Me</h2>
      <div className="space-y-10">
        <section>
          <p className="text-lg leading-relaxed text-gray-300">
            I am a PhD candidate specializing in bat ecology and conservation, with a focus on biodiversity conservation, renewable energy, and climate change. My research investigates the complex interactions between bats and wind farms, aiming to develop effective mitigation strategies. I have extensive professional experience with KAB Ecology, where I've contributed to numerous projects assessing and mitigating the impacts of wind energy on bat populations.
          </p>
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
          <h3 className="text-2xl font-bold text-white mb-4">Personal Motivation</h3>
          <div className="border-l-4 border-indigo-600 pl-4">
            <p className="italic text-lg leading-relaxed text-gray-400">
              "Growing up in Lebanon, I developed a deep appreciation for the natural world and a strong desire to protect its biodiversity. This passion led me to pursue a career in bat ecology and conservation, where I can contribute to the preservation of these fascinating creatures and their vital role in our ecosystems."
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;