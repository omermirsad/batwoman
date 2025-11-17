/**
 * Tests for API Client utility
 */
import { describe, it, expect } from 'vitest';
import { handleApiError } from '../../utils/apiClient';
import { AxiosError } from 'axios';

describe('API Client', () => {
  describe('handleApiError', () => {
    it('handles network errors', () => {
      const error = new Error('Network Error');
      (error as any).isAxiosError = true;
      const message = handleApiError(error);
      expect(message).toContain('Network error');
    });

    it('handles 400 errors', () => {
      const error: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {},
        } as any,
      };
      const message = handleApiError(error);
      expect(message).toContain('Invalid request');
    });

    it('handles 401 errors', () => {
      const error: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 401,
          data: {},
        } as any,
      };
      const message = handleApiError(error);
      expect(message).toContain('Authentication failed');
    });

    it('handles 429 errors', () => {
      const error: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 429,
          data: {},
        } as any,
      };
      const message = handleApiError(error);
      expect(message).toContain('Too many requests');
    });

    it('handles 500 errors', () => {
      const error: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 500,
          data: {},
        } as any,
      };
      const message = handleApiError(error);
      expect(message).toContain('Server error');
    });

    it('uses server error message when available', () => {
      const error: Partial<AxiosError> = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { error: 'Custom error message' },
        } as any,
      };
      const message = handleApiError(error);
      expect(message).toBe('Custom error message');
    });

    it('handles generic Error instances', () => {
      const error = new Error('Generic error');
      const message = handleApiError(error);
      expect(message).toBe('Generic error');
    });

    it('handles unknown errors', () => {
      const message = handleApiError('some string');
      expect(message).toBe('An unknown error occurred.');
    });
  });
});
