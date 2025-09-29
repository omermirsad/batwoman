import React, { useState, useRef, useEffect, useCallback } from 'react';
import { type Message } from '../types';
import { createChatSession, sendMessage } from '../services/geminiService';
import type { Chat } from '@google/genai';
import { SendIcon } from './icons/SendIcon';
import { BatIcon } from './icons/BatIcon';
import { TypingIndicator } from './TypingIndicator';

const GeminiChat: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const chatSession = createChatSession();
      setChat(chatSession);
      setMessages([
        {
          role: 'model',
          text: "Hello! I am Dr. Echo, an AI assistant knowledgeable in bat ecology and conservation. How can I help you today?",
        },
      ]);
    } catch (e: unknown) {
        if (e instanceof Error) {
            setError(`Failed to initialize AI chat: ${e.message}`);
        } else {
            setError('An unknown error occurred during initialization.');
        }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    const modelMessage: Message = { role: 'model', text: '' };
    setMessages((prev) => [...prev, modelMessage]);

    try {
        const stream = sendMessage(chat, input);
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
      setMessages(prev => prev.slice(0, -2)); // remove user and empty model message on error
    } finally {
      setIsLoading(false);
    }
  }, [input, chat, isLoading]);

  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Ask Dr. Echo</h2>
        <p className="mt-4 text-lg text-gray-400">Have a question about bats? My AI assistant is here to help.</p>
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
                   {isTyping ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{msg.text}</p>}
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