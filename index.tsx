import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { initSentry } from './utils/sentry';
import { initWebVitals, trackPageLoad } from './utils/monitoring';
import { logger } from './utils/logger';

// Initialize monitoring and error tracking
try {
  // Initialize Sentry
  initSentry();

  // Initialize Web Vitals tracking
  initWebVitals();

  // Track page load performance
  trackPageLoad();

  logger.info('Application initializing', {
    version: '1.0.0',
    environment: import.meta.env.MODE,
  });
} catch (error) {
  console.error('Failed to initialize monitoring:', error);
}

// Get root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  const error = new Error('Could not find root element to mount to');
  logger.error('Root element not found', error);
  throw error;
}

// Create root and render
const root = ReactDOM.createRoot(rootElement);

// Wrap App with Sentry's ErrorBoundary for additional tracking
const AppWithMonitoring = Sentry.withProfiler(App);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppWithMonitoring />
    </ErrorBoundary>
  </React.StrictMode>
);

// Log successful mount
logger.info('Application mounted successfully');
