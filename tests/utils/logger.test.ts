/**
 * Tests for Logger utility
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Logger } from '../../utils/logger';

describe('Logger', () => {
  let logger: Logger;
  let consoleInfoSpy: any;
  let consoleErrorSpy: any;
  let consoleWarnSpy: any;

  beforeEach(() => {
    logger = new Logger();
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs info messages', () => {
    logger.info('Test info message');
    expect(consoleInfoSpy).toHaveBeenCalled();
  });

  it('logs error messages', () => {
    const error = new Error('Test error');
    logger.error('Test error message', error);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('logs warning messages', () => {
    logger.warn('Test warning message');
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it('includes context in log messages', () => {
    const context = { userId: '123', action: 'test' };
    logger.info('Test with context', context);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Test with context'),
      expect.anything()
    );
  });

  it('logs API requests', () => {
    logger.apiRequest('GET', '/api/test');
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('API Request: GET /api/test'),
      expect.anything()
    );
  });

  it('logs API responses', () => {
    logger.apiResponse('GET', '/api/test', 200, 150);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('API Response: GET /api/test - 200 (150ms)'),
      expect.anything()
    );
  });

  it('logs user actions', () => {
    logger.userAction('Button Click', { buttonId: 'submit' });
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('User Action: Button Click'),
      expect.anything()
    );
  });

  it('logs performance metrics', () => {
    logger.performance('Page Load', 1250);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Performance: Page Load = 1250ms'),
      expect.anything()
    );
  });
});
