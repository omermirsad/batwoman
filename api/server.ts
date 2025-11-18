/**
 * Backend API Server for Gemini Proxy
 * Secures API keys and provides rate limiting, monitoring, and error handling
 */
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
   
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is required');
  process.exit(1);
}

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // eslint-disable-next-line no-console
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });
  next();
});

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

// Gemini chat streaming endpoint
app.post('/api/chat/stream', async (req: Request, res: Response) => {
  try {
    const { messages, systemInstruction } = req.body;

    // Validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({
        error: 'Invalid request: messages array is required',
      });
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.text || lastMessage.text.trim().length === 0) {
      res.status(400).json({
        error: 'Invalid request: message cannot be empty',
      });
      return;
    }

    // Set headers for SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const modelName = 'gemini-2.5-flash';
    const userPrompt = lastMessage.text;

    // Prepare history
    const history = messages.slice(0, -1).map((msg: { role: string; text: string }) => ({
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

    const responseStream = await chat.sendMessageStream({ message: userPrompt });

    // Stream chunks to client
    for await (const chunk of responseStream) {
      const data = JSON.stringify({ text: chunk.text });
      res.write(`data: ${data}\n\n`);
    }

    // End stream
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error in chat stream:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Send error as SSE event
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/event-stream');
    }

    res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
    res.end();
  }
});

// Gemini chat non-streaming endpoint (fallback)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, systemInstruction } = req.body;

    // Validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({
        error: 'Invalid request: messages array is required',
      });
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.text || lastMessage.text.trim().length === 0) {
      res.status(400).json({
        error: 'Invalid request: message cannot be empty',
      });
      return;
    }

    const modelName = 'gemini-2.5-flash';
    const userPrompt = lastMessage.text;

    // Prepare history
    const history = messages.slice(0, -1).map((msg: { role: string; text: string }) => ({
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

    res.status(200).json({
      text: response.text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in chat:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Provide helpful error messages
    if (errorMessage.includes('API_KEY')) {
      res.status(401).json({
        error: 'Invalid API key configuration',
      });
      return;
    } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      res.status(429).json({
        error: 'API quota exceeded. Please try again later.',
      });
      return;
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      res.status(503).json({
        error: 'Network error. Please try again.',
      });
      return;
    }

    res.status(500).json({
      error: 'An unexpected error occurred',
      message: NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
});

// Contact form submission endpoint (optional - for future backend integration)
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      res.status(400).json({
        error: 'All fields are required',
      });
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: 'Invalid email address',
      });
      return;
    }

     
    // TODO: Implement actual email sending logic here
    // For now, just log and return success
    // eslint-disable-next-line no-console
    console.log('Contact form submission:', { name, email, subject, message });

    res.status(200).json({
      success: true,
      message: 'Message received successfully',
    });
  } catch (error) {
    console.error('Error in contact form:', error);
    res.status(500).json({
      error: 'Failed to process contact form',
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
   
   
   
   
   
   
app.listen(PORT, () => {
  console.log(`✅ API Server running on port ${PORT}`);
  console.log(`   Environment: ${NODE_ENV}`);
  console.log(`   Allowed Origins: ${allowedOrigins.join(', ')}`);
   
});

// Graceful shutdown
process.on('SIGTERM', () => {
   
  // eslint-disable-next-line no-console
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
