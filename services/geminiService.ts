import { type Message } from '../types';

/**
 * Sends the chat history to a server-side proxy and streams the response.
 * @param messages The full chat history.
 * @returns An async generator that yields response text chunks.
 */
export async function* streamChatResponse(messages: Message[]) {
  // This function now calls a relative endpoint, assuming a backend proxy
  // is set up to handle the request and securely call the Gemini API.
  const response = await fetch('/api/gemini-chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Send the entire message history for context.
    body: JSON.stringify({ history: messages }),
  });

  if (!response.ok || !response.body) {
    const errorText = await response.text();
    throw new Error(`Server error: ${response.status} ${errorText || response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  // Read and decode the streamed response
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const chunk = decoder.decode(value, { stream: true });
    yield chunk;
  }
}
