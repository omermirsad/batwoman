/**
 * Environment variable validation and configuration
 * Uses Zod for runtime type checking and validation
 */
import { z } from 'zod';

/**
 * Client-side environment schema
 * These variables are safe to expose in the browser
 */
const clientEnvSchema = z.object({
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_EMAILJS_SERVICE_ID: z.string().optional(),
  VITE_EMAILJS_TEMPLATE_ID: z.string().optional(),
  VITE_EMAILJS_PUBLIC_KEY: z.string().optional(),
  VITE_API_URL: z.string().url().default('http://localhost:3001'),
  VITE_ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('false'),
  MODE: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Server-side environment schema
 * These variables must never be exposed to the client
 */
const serverEnvSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  PORT: z.string().transform(Number).default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ALLOWED_ORIGINS: z.string().transform(val => val.split(',')).default('http://localhost:3000'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
});

/**
 * Validates client-side environment variables
 * @throws {Error} if validation fails
 */
export function validateClientEnv() {
  try {
    return clientEnvSchema.parse({
      VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
      VITE_EMAILJS_SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      VITE_EMAILJS_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      VITE_EMAILJS_PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS,
      MODE: import.meta.env.MODE,
    });
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Failed to load environment configuration');
  }
}

/**
 * Validates server-side environment variables
 * @throws {Error} if validation fails
 */
export function validateServerEnv() {
  try {
    return serverEnvSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid server environment variables:', error);
    throw new Error('Failed to load server configuration');
  }
}

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
