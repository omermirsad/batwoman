/**
 * API Client with retry logic, interceptors, and monitoring
 * Enterprise-grade HTTP client for external API communication
 */
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from './logger';

/**
 * Retry configuration
 */
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
};

/**
 * Calculate exponential backoff delay with jitter
 */
function calculateBackoff(attempt: number, config: RetryConfig): number {
  const exponentialDelay = Math.min(
    config.baseDelay * Math.pow(2, attempt),
    config.maxDelay
  );
  // Add jitter (random value between 0 and delay)
  const jitter = Math.random() * exponentialDelay;
  return exponentialDelay + jitter;
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: AxiosError): boolean {
  // Retry on network errors
  if (!error.response) {
    return true;
  }

  // Retry on 5xx server errors and 429 (rate limit)
  const status = error.response.status;
  return status >= 500 || status === 429;
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => globalThis.setTimeout(resolve, ms));
}

/**
 * Create API client with interceptors and retry logic
 */
export function createApiClient(baseURL?: string, retryConfig?: Partial<RetryConfig>): AxiosInstance {
  const retryConf = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };

  const client = axios.create({
    baseURL: baseURL || import.meta.env.VITE_API_URL || 'http://localhost:3001',
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - log and add metadata
  client.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      const startTime = Date.now();

      // Attach start time to config for duration calculation
      (requestConfig as any).metadata = { startTime };

      logger.apiRequest(
        requestConfig.method?.toUpperCase() || 'UNKNOWN',
        requestConfig.url || '',
        {
          headers: requestConfig.headers,
        }
      );

      return requestConfig;
    },
    (error: AxiosError) => {
      logger.error('API Request Error', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - log and handle errors
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      const requestConfig = response.config as any;
      const duration = requestConfig.metadata?.startTime
        ? Date.now() - requestConfig.metadata.startTime
        : 0;

      logger.apiResponse(
        requestConfig.method?.toUpperCase() || 'UNKNOWN',
        requestConfig.url || '',
        response.status,
        duration
      );

      return response;
    },
    async (error: AxiosError) => {
      const config = error.config as any;

      if (!config) {
        return Promise.reject(error);
      }

      const duration = config.metadata?.startTime
        ? Date.now() - config.metadata.startTime
        : 0;

      logger.apiResponse(
        config.method?.toUpperCase() || 'UNKNOWN',
        config.url || '',
        error.response?.status || 0,
        duration,
        {
          error: error.message,
        }
      );

      // Initialize retry count
      config._retryCount = config._retryCount || 0;

      // Check if we should retry
      if (config._retryCount < retryConf.maxRetries && isRetryableError(error)) {
        config._retryCount += 1;

        const delay = calculateBackoff(config._retryCount - 1, retryConf);

        logger.warn(
          `Retrying request (attempt ${config._retryCount}/${retryConf.maxRetries})`,
          {
            url: config.url,
            method: config.method,
            delay,
          }
        );

        // Wait before retrying
        await sleep(delay);

        // Retry the request
        return client(config);
      }

      return Promise.reject(error);
    }
  );

  return client;
}

/**
 * Default API client instance
 */
export const apiClient = createApiClient();

/**
 * Helper to handle API errors with user-friendly messages
 */
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;

    // Network error
    if (!axiosError.response) {
      return 'Network error. Please check your internet connection and try again.';
    }

    // Server returned an error message
    if (axiosError.response.data?.error) {
      return axiosError.response.data.error;
    }

    if (axiosError.response.data?.message) {
      return axiosError.response.data.message;
    }

    // Status-based messages
    switch (axiosError.response.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication failed. Please refresh the page.';
      case 403:
        return 'Access denied.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred.';
}
