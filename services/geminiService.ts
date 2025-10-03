import { GoogleGenAI, Chat } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are an AI assistant for Dark Echology, a platform specializing in chiropterology (the study of bats). Your purpose is to provide scientifically accurate and engaging information about bats, their ecology, and conservation efforts. Answer questions clearly and dispel common myths. Maintain a helpful, informative, and professional tone.`;

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export function createChatSession(): Chat {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
  return chat;
}

export async function* sendMessage(chat: Chat, message: string) {
  const result = await chat.sendMessageStream({ message });
  for await (const chunk of result) {
    yield chunk.text;
  }
}