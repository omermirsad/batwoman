import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { type Message } from '../types';
import { streamChatResponse } from '../services/geminiService';
import { SendIcon } from './icons/SendIcon';
import { BatIcon } from './icons/BatIcon';
import { TypingIndicator } from './TypingIndicator';

const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with a greeting message.
    setMessages([
      {
        role: 'model',
        text: "Hello! I am the AI assistant for Dark Echology, knowledgeable in bat ecology and conservation. How can I help you today?",
      },
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Add a placeholder for the model's response
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    try {
      // Pass the entire chat history to the new service function
      const stream = streamChatResponse(newMessages);
      let accumulatedText = "";
      for await (const textChunk of stream) {
        accumulatedText += textChunk;
        setMessages(prev => prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, text: accumulatedText } : msg
        ));
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get response: ${errorMessage}`);
      // On error, remove the empty model message placeholder
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Ask the AI Expert</h2>
        <p className="mt-4 text-lg text-gray-400">Have a question about bats? Our AI assistant is here to help.</p>
      </div>

      <div className="bg-[#1a1a2e] rounded-lg shadow-xl h-[60vh] flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, index) => {
             const isLastMessage = index === messages.length - 1;
             const isTyping = isLastMessage && msg.role === 'model' && isLoading;

            return (
              <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center"><BatIcon className="w-5 h-5 text-white"/></div>}
                <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-[#2a2a3e] text-gray-200'}`}>
                   {isTyping ? <TypingIndicator /> : (
                      msg.role === 'model' ? (
                        // Fix: The `className` prop is not supported on `ReactMarkdown`. Wrap it in a div to apply styles.
                        <div className="markdown-content">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      )
                   )}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
        
        {error && <div className="p-4 text-red-400 bg-red-900/50 text-sm">{error}</div>}

        <div className="p-4 border-t border-[#2a2a3e]">
          <div className="flex items-center bg-[#111121] rounded-lg ring-1 ring-transparent focus-within:ring-indigo-500">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about bat species, habitats, myths..."
              className="flex-1 bg-transparent p-3 text-gray-200 placeholder-gray-500 focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 text-gray-400 rounded-r-lg hover:text-indigo-500 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-t-indigo-500 border-gray-600 rounded-full animate-spin"></div>
              ) : (
                <SendIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;
