/**
 * Production Gemini Service
 * Uses backend API proxy for security and proper error handling
 */
import { type Message } from '../types';
import { apiClient, handleApiError } from '../utils/apiClient';
import { logger } from '../utils/logger';

const systemInstruction = `You are an AI assistant for Dark Echology, a professional website run by chiropterologist Maha Salameh. Your expertise is in bat ecology, conservation, sound analysis, and the ecological balance of the night.
- Your tone should be expert, scientific, yet accessible and engaging for a general audience.
- When answering questions, be factual and rely on established scientific knowledge about bats.
- You can reference the work of Dark Echology and Maha Salameh where relevant.
- You should encourage users to explore the website's sections (About, Services, Blog).
- Do not make up information. If you don't know an answer, say so.
- Format your answers using Markdown for readability (e.g., lists, bold text, italics).`;

/**
 * Streams a chat response from the Gemini API via backend proxy
 * @param messages The full chat history for context
 * @returns An async generator that yields the response text chunks
 */
export async function* streamChatResponse(messages: Message[]): AsyncGenerator<string, void, unknown> {
  if (messages.length === 0) {
    logger.warn('streamChatResponse called with empty messages array');
    return;
  }

  const lastMessage = messages[messages.length - 1];
  const userPrompt = lastMessage?.text;

  if (!userPrompt || userPrompt.trim().length === 0) {
    throw new Error('Message cannot be empty.');
  }

  logger.userAction('AI Chat Request', {
    messageCount: messages.length,
    promptLength: userPrompt.length,
  });

  try {
    // Use relative URL if VITE_API_URL is not set (for Netlify Functions)
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const endpoint = apiUrl ? `${apiUrl}/api/chat/stream` : '/api/chat/stream';

    const response = await globalThis.fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        systemInstruction,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new globalThis.TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        logger.info('AI Chat Response completed');
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          if (data === '[DONE]') {
            return;
          }

          try {
            const parsed = JSON.parse(data);

            if (parsed.error) {
              throw new Error(parsed.error);
            }

            if (parsed.text) {
              yield parsed.text;
            }
          } catch (e) {
            // Skip invalid JSON lines
            if (e instanceof Error && !e.message.includes('error')) {
              logger.debug('Failed to parse SSE data', { data });
            } else {
              throw e;
            }
          }
        }
      }
    }
  } catch (error) {
    logger.error('Error in streamChatResponse', error instanceof Error ? error : undefined);

    if (error instanceof Error) {
      // Provide helpful error messages
      if (error.message.includes('API_KEY') || error.message.includes('401')) {
        throw new Error('Authentication error. Please contact support.');
      } else if (error.message.includes('quota') || error.message.includes('limit') || error.message.includes('429')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Request timeout. Please try again.');
      }
      throw error;
    }

    throw new Error('An unexpected error occurred while communicating with the AI.');
  }
}

/**
 * Non-streaming chat response (fallback)
 * @param messages The full chat history for context
 * @returns The complete response text
 */
export async function sendChatMessage(messages: Message[]): Promise<string> {
  if (messages.length === 0) {
    throw new Error('Messages array cannot be empty');
  }

  const lastMessage = messages[messages.length - 1];
  const userPrompt = lastMessage?.text;

  if (!userPrompt || userPrompt.trim().length === 0) {
    throw new Error('Message cannot be empty.');
  }

  logger.userAction('AI Chat Request (Non-streaming)', {
    messageCount: messages.length,
    promptLength: userPrompt.length,
  });

  try {
    const response = await apiClient.post('/api/chat', {
      messages,
      systemInstruction,
    });

    logger.info('AI Chat Response completed (Non-streaming)');

    return response.data.text;
  } catch (error) {
    logger.error('Error in sendChatMessage', error instanceof Error ? error : undefined);
    throw new Error(handleApiError(error));
  }
}
