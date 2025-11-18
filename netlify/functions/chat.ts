/**
 * Netlify Function: Non-streaming Chat with Gemini AI
 * Fallback endpoint for non-streaming chat responses
 */
import { Config } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

interface ChatRequest {
  messages: Array<{ role: string; text: string }>;
  systemInstruction?: string;
}

export default async (req: Request) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // Will be configured via environment
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    // Validate API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API configuration error' }),
        { status: 500, headers }
      );
    }

    // Parse request body
    const body: ChatRequest = await req.json();
    const { messages, systemInstruction } = body;

    // Validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array is required' }),
        { status: 400, headers }
      );
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.text || lastMessage.text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: message cannot be empty' }),
        { status: 400, headers }
      );
    }

    // Initialize Gemini AI
    const ai = new GoogleGenAI({ apiKey });
    const modelName = 'gemini-2.5-flash';
    const userPrompt = lastMessage.text;

    // Prepare history
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    const chat = ai.chats.create({
      model: modelName,
      history: history,
      config: {
        systemInstruction: systemInstruction || '',
      },
    });

    const response = await chat.sendMessage({ message: userPrompt });

    return new Response(
      JSON.stringify({
        text: response.text,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isProduction = process.env.NODE_ENV === 'production';

    // Provide helpful error messages
    if (errorMessage.includes('API_KEY')) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key configuration' }),
        { status: 401, headers }
      );
    } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      return new Response(
        JSON.stringify({ error: 'API quota exceeded. Please try again later.' }),
        { status: 429, headers }
      );
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return new Response(
        JSON.stringify({ error: 'Network error. Please try again.' }),
        { status: 503, headers }
      );
    }

    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred',
        message: isProduction ? undefined : errorMessage,
      }),
      { status: 500, headers }
    );
  }
};

export const config: Config = {
  path: '/api/chat',
};
