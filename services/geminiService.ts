import { GoogleGenAI } from "@google/genai";
import { type Message } from '../types';

// Initialize the Google GenAI client directly on the frontend.
// WARNING: This exposes the API key in the client-side bundle.
// For production, consider implementing a backend proxy to keep the API key secure.
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY is not configured. Please set it in your .env.local file.');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

/**
 * Streams a chat response from the Gemini API using the client-side SDK.
 * @param messages The full chat history for context.
 * @param systemInstruction A system-level instruction for the model.
 * @returns An async generator that yields the response text chunks.
 */
export async function* streamChatResponse(messages: Message[], systemInstruction: string) {
  // Validate API key is configured
  if (!apiKey) {
    throw new Error('API key is not configured. Please check your environment setup.');
  }

  // Use gemini-2.5-flash, a current and recommended model for this task.
  const modelName = 'gemini-2.5-flash';

  if (messages.length === 0) {
    return;
  }

  // The last message is the user's prompt.
  const userPrompt = messages[messages.length - 1].text;

  if (!userPrompt || userPrompt.trim().length === 0) {
    throw new Error('Message cannot be empty.');
  }

  try {
    // The history is all messages before the last one.
    // Map our Message type to the format expected by the GoogleGenAI SDK.
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const chat = ai.chats.create({
      model: modelName,
      history: history,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const responseStream = await chat.sendMessageStream({ message: userPrompt });

    for await (const chunk of responseStream) {
      // Each chunk from the stream contains a delta of the text.
      yield chunk.text;
    }
  } catch (error) {
    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        throw new Error('Invalid API key. Please check your Gemini API key configuration.');
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred while communicating with the AI.');
  }
}
