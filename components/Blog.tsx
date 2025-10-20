import React, { useState, useEffect } from 'react';
import { blogPosts } from '../data/blogData';
import { SearchIcon } from './icons/SearchIcon';

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  useEffect(() => {
    const results = blogPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(results);
  }, [searchTerm]);

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">From the Field: Latest Insights</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Explore our latest findings, stories, and updates from the world of bat research and conservation.
        </p>
      </div>

      <div className="relative mb-12 max-w-lg mx-auto">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
          <SearchIcon className="h-5 w-5" />
        </span>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search articles by title, category, or keyword..."
          className="w-full pl-11 pr-4 py-3 bg-[#1a1a2e] border border-indigo-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Search blog posts"
        />
      </div>
      
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <a
              key={post.title}
              href={`#/blog/${post.slug}`}
              className="bg-[#1a1a2e] rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 flex flex-col group"
            >
              <img src={post.imageSrc} alt={post.imageAlt} className="w-full h-48 object-cover" />
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm font-medium text-indigo-400 mb-1">{post.category}</p>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-base flex-grow">{post.excerpt}</p>
                <div className="mt-4">
                  <span className="font-semibold text-indigo-400">
                    Read More &rarr;
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-400">No articles found for "{searchTerm}".</p>
          <p className="mt-2 text-gray-500">Please try a different search term.</p>
        </div>
      )}
    </div>
  );
};

export default Blog;