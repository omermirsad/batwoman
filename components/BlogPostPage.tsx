import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { type BlogPost } from '../data/blogData';

interface BlogPostPageProps {
  post: BlogPost;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  return (
    <main className="pt-24 sm:pt-32 pb-16 animate-fadeIn">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <a href="/#blog" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to All Articles
          </a>
        </div>
        <article>
          <img src={post.imageSrc} alt={post.imageAlt} className="w-full h-56 sm:h-64 object-cover rounded-lg mb-8 shadow-lg" />
          <p className="text-sm font-medium text-indigo-400 mb-2">{post.category}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">{post.title}</h1>
          <div className="markdown-content text-gray-300 leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />
              }}
            >
              {post.fullContent}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </main>
  );
};

export default BlogPostPage;