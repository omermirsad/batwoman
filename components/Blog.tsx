import React from 'react';

const blogPosts = [

  {
    imageSrc: 'https://images.pexels.com/photos/38008/pexels-photo-38008.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Conservation',
    title: 'The Critical Role of Bats in Pest Control',
    excerpt: 'Did you know a single bat can eat thousands of insects in one night? Discover how bats are a farmer\'s best friend and vital for our ecosystems.',
    href: '#',
  },
  {
    imageSrc: 'https://i.ibb.co/Gb5bsH5/wind-turbine-bat.png',
    category: 'Research',
    title: 'Impact of Wind Turbines on Bat Populations',
    excerpt: 'Exploring the challenges and solutions for mitigating the impact of renewable energy infrastructure on local bat populations.',
    href: '#',
  },
];

const Blog: React.FC = () => {
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">From the Field: Latest Insights</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Explore our latest findings, stories, and updates from the world of bat research and conservation.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div key={post.title} className="bg-[#1a1a2e] rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-default">
            <img src={post.imageSrc} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
              <p className="text-sm font-medium text-indigo-400 mb-1">{post.category}</p>
              <h3 className="text-xl font-bold text-white mb-2">
                {post.title}
              </h3>
              <p className="text-gray-400 text-base flex-grow">{post.excerpt}</p>
              <div className="mt-4">
                <span className="font-semibold text-indigo-400">
                  Read More &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;