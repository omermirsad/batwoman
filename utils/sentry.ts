/**
 * Sentry Configuration and Initialization
 * Provides error tracking and performance monitoring in production
 */
import * as Sentry from '@sentry/react';
import { logger } from './logger';

/**
 * Initialize Sentry error tracking
 */
export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    logger.warn('Sentry DSN not configured, error tracking disabled');
    return;
  }

  if (import.meta.env.MODE === 'development') {
    logger.info('Skipping Sentry initialization in development mode');
    return;
  }

  try {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      release: `dark-echology@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,

      // Performance monitoring
      tracesSampleRate: 0.1, // 10% of transactions for performance monitoring

      // Session replay (optional)
      replaysSessionSampleRate: 0.01, // 1% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

      // Integrations
      integrations: [
        // React Router integration
        Sentry.browserTracingIntegration(),
        // Replay integration for debugging
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],

      // Before send hook - filter sensitive data
      beforeSend(event, hint) {
        // Filter out events in development
        if (import.meta.env.MODE === 'development') {
          console.log('Sentry event (dev only):', event);
          return null;
        }

        // Remove sensitive data from breadcrumbs
        if (event.breadcrumbs) {
          event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
            if (breadcrumb.data) {
              // Remove email addresses
              if (breadcrumb.data.email) {
                breadcrumb.data.email = '[REDACTED]';
              }
              // Remove API keys
              if (breadcrumb.data.apiKey || breadcrumb.data.api_key) {
                breadcrumb.data.apiKey = '[REDACTED]';
                breadcrumb.data.api_key = '[REDACTED]';
              }
            }
            return breadcrumb;
          });
        }

        return event;
      },

      // Ignore certain errors
      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        'chrome-extension://',
        'moz-extension://',
        // Random network errors
        'NetworkError',
        'Network request failed',
        // Cancelled requests
        'Request aborted',
        'AbortError',
      ],

      // Deny URLs (don't track errors from these sources)
      denyUrls: [
        // Browser extensions
        /extensions\//i,
        /^chrome:\/\//i,
        /^moz-extension:\/\//i,
      ],
    });

    logger.info('Sentry initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Sentry', error instanceof Error ? error : undefined);
  }
}

/**
 * Set user context for Sentry
 */
export function setUserContext(userId: string, email?: string, username?: string): void {
  Sentry.setUser({
    id: userId,
    email: email ? `[REDACTED]` : undefined, // Don't send actual email
    username,
  });
}

/**
 * Clear user context
 */
export function clearUserContext(): void {
  Sentry.setUser(null);
}

/**
 * Add custom context to Sentry events
 */
export function addContext(key: string, context: Record<string, unknown>): void {
  Sentry.setContext(key, context);
}

/**
 * Capture exception manually
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  logger.error('Captured exception', error, context);

  if (import.meta.env.VITE_SENTRY_DSN && import.meta.env.PROD) {
    Sentry.captureException(error, {
      contexts: context ? { custom: context } : undefined,
    });
  }
}

/**
 * Capture message manually
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: Record<string, unknown>
): void {
  logger.info(`Captured message: ${message}`, context);

  if (import.meta.env.VITE_SENTRY_DSN && import.meta.env.PROD) {
    Sentry.captureMessage(message, {
      level,
      contexts: context ? { custom: context } : undefined,
    });
  }
}
