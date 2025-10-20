import { GoogleGenAI } from "@google/genai";
import { type Message } from '../types';

// Initialize the Google GenAI client directly on the frontend.
// The API key is expected to be available via process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Streams a chat response from the Gemini API using the client-side SDK.
 * @param messages The full chat history for context.
 * @returns An async generator that yields the aggregated response text chunks.
 */
export async function* streamChatResponse(messages: Message[]) {
  // Use gemini-2.5-flash, the current and recommended model for this task.
  const modelName = 'gemini-2.0-flash';

  if (messages.length === 0) {
    return;
  }

  // The last message is the user's prompt.
  const userPrompt = messages[messages.length - 1].text;

  // The history is all messages before the last one.
  // Map our Message type to the format expected by the GoogleGenAI SDK.
  const history = messages.slice(0, -1).map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));

  const chat = ai.chats.create({
    model: modelName,
    history: history,
  });

  const responseStream = await chat.sendMessageStream({ message: userPrompt });

  for await (const chunk of responseStream) {
    // The `text` property on the chunk provides the full, aggregated text
    // from the stream up to that point.
    yield chunk.text;
  }
}
