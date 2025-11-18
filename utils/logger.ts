/**
 * Structured logging utility for production-grade logging
 * Provides consistent log formatting, levels, and integration with monitoring services
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
}

class Logger {
  private isDevelopment: boolean;
  private enableConsole: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.MODE === 'development';
    this.enableConsole = true;
  }

  /**
   * Formats log entry for consistent output
   */
  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context } = entry;
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Sends log to external monitoring service (Sentry, DataDog, etc.)
   */
  private sendToMonitoring(entry: LogEntry): void {
    // In production, this would send to Sentry or other monitoring service
    // For now, we'll handle this through Sentry's automatic breadcrumbs
    if (!this.isDevelopment && entry.level === LogLevel.ERROR && entry.error) {
      // Sentry will capture this automatically through our error boundary
    }
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    // Console output (development or enabled)
    if (this.enableConsole) {
      const formatted = this.formatLog(entry);
      switch (level) {
        case LogLevel.ERROR:
          console.error(formatted, error || '');
          break;
        case LogLevel.WARN:
          console.warn(formatted);
          break;
        case LogLevel.INFO:
          // eslint-disable-next-line no-console
          console.info(formatted);
          break;
        case LogLevel.DEBUG:
           
          if (this.isDevelopment) {
            console.debug(formatted);
          }
          break;
      }
    }

    // Send to monitoring service
    this.sendToMonitoring(entry);
  }

  /**
   * Log debug message (development only)
   */
  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log informational message
   */
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Log API request
   */
  apiRequest(method: string, url: string, context?: LogContext): void {
    this.info(`API Request: ${method} ${url}`, { ...context, type: 'api_request' });
  }

  /**
   * Log API response
   */
  apiResponse(method: string, url: string, status: number, duration: number, context?: LogContext): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    this.log(
      level,
      `API Response: ${method} ${url} - ${status} (${duration}ms)`,
      { ...context, type: 'api_response', status, duration }
    );
  }

  /**
   * Log user action
   */
  userAction(action: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, { ...context, type: 'user_action' });
  }

  /**
   * Log performance metric
   */
  performance(metric: string, value: number, context?: LogContext): void {
    this.info(`Performance: ${metric} = ${value}ms`, { ...context, type: 'performance', metric, value });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for testing
export { Logger };
