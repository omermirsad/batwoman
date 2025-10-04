import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// Fix: The BlogPost type is exported from blogData.ts, not Blog.tsx.
import { type BlogPost } from '../data/blogData';

interface BlogPostModalProps {
  post: BlogPost;
  onClose: () => void;
}

const BlogPostModal: React.FC<BlogPostModalProps> = ({ post, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-post-title"
    >
      <div
        className="bg-[#1a1a2e] rounded-lg shadow-xl max-w-3xl w-[95%] h-[90vh] flex flex-col border border-indigo-600/30 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 relative">
          <img src={post.imageSrc} alt={post.title} className="w-full h-56 object-cover rounded-t-lg" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-1.5 hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close post"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <p className="text-sm font-medium text-indigo-400 mb-2">{post.category}</p>
          <h2 id="blog-post-title" className="text-2xl sm:text-3xl font-bold text-white mb-4">{post.title}</h2>
          <div className="markdown-content text-gray-300">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />
              }}
            >
              {post.fullContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostModal;