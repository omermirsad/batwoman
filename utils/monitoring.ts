/**
 * Performance Monitoring and Web Vitals Tracking
 * Tracks Core Web Vitals and custom performance metrics
 */
import { onCLS, onFID, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { logger } from './logger';
import * as Sentry from '@sentry/react';

/**
 * Web Vitals thresholds (in milliseconds)
 */
const THRESHOLDS = {
  // Cumulative Layout Shift (score, not ms)
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  // First Input Delay
  FID: {
    good: 100,
    needsImprovement: 300,
  },
  // First Contentful Paint
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  // Largest Contentful Paint
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  // Time to First Byte
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
};

type MetricName = 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';

/**
 * Get rating for a metric value
 */
function getRating(name: MetricName, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) {
    return 'good';
  } else if (value <= threshold.needsImprovement) {
    return 'needs-improvement';
  }
  return 'poor';
}

/**
 * Handle Web Vitals metric
 */
function handleMetric(metric: Metric): void {
  const rating = getRating(metric.name as MetricName, metric.value);

  // Log the metric
  logger.performance(metric.name, metric.value, {
    rating,
    id: metric.id,
    delta: metric.delta,
  });

  // Send to analytics/monitoring if enabled
  if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Send to Sentry for monitoring
    if (import.meta.env.VITE_SENTRY_DSN) {
      Sentry.addBreadcrumb({
        category: 'web-vital',
        message: `${metric.name}: ${metric.value}`,
        level: rating === 'poor' ? 'warning' : 'info',
        data: {
          name: metric.name,
          value: metric.value,
          rating,
          delta: metric.delta,
        },
      });

      // Report poor metrics as issues
      if (rating === 'poor') {
        Sentry.captureMessage(`Poor Web Vital: ${metric.name}`, {
          level: 'warning',
          tags: {
            metric: metric.name,
            rating,
          },
          contexts: {
            'web-vitals': {
              name: metric.name,
              value: metric.value,
              rating,
              id: metric.id,
            },
          },
        });
      }
    }
  }
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals(): void {
  if (typeof window === 'undefined') {
    return;
  }

  logger.info('Initializing Web Vitals monitoring');

  // Track all Core Web Vitals
  onCLS(handleMetric);
  onFID(handleMetric);
  onFCP(handleMetric);
  onLCP(handleMetric);
  onTTFB(handleMetric);
}

/**
 * Track custom performance metric
 */
export function trackPerformance(
  name: string,
  startTime: number,
  metadata?: Record<string, unknown>
): void {
  const duration = globalThis.performance.now() - startTime;
  logger.performance(name, duration, metadata);

  // Send to Sentry if enabled
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `${name}: ${duration}ms`,
      level: 'info',
      data: {
        name,
        duration,
        ...metadata,
      },
    });
  }
}

/**
 * Create a performance tracker
 * Returns a function to end tracking
 */
export function startPerformanceTracking(
  name: string,
  metadata?: Record<string, unknown>
): () => void {
  const startTime = globalThis.performance.now();

  return () => {
    trackPerformance(name, startTime, metadata);
  };
}

/**
 * Track page load performance
 */
export function trackPageLoad(): void {
  if (typeof window === 'undefined' || !window.performance) {
    return;
  }

  // Wait for page to fully load
  window.addEventListener('load', () => {
    globalThis.setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;

      logger.info('Page Load Performance', {
        pageLoadTime,
        connectTime,
        renderTime,
      });

      // Send to Sentry
      if (import.meta.env.VITE_SENTRY_DSN) {
        Sentry.addBreadcrumb({
          category: 'navigation',
          message: `Page loaded in ${pageLoadTime}ms`,
          level: 'info',
          data: {
            pageLoadTime,
            connectTime,
            renderTime,
          },
        });
      }
    }, 0);
  });
}
