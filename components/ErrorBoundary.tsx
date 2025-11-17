import { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
      Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }

    this.setState({
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.hash = '';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#111121] flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-[#1a1a2e] rounded-lg shadow-xl p-8 border border-red-500/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Oops! Something went wrong</h1>
                <p className="text-gray-400 mt-1">We apologize for the inconvenience</p>
              </div>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 bg-[#111121] rounded-lg p-4 border border-red-500/20">
                <p className="text-sm font-semibold text-red-400 mb-2">Error Details (Dev Only):</p>
                <pre className="text-xs text-gray-300 overflow-auto max-h-40">{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-300">Component Stack</summary>
                    <pre className="text-xs text-gray-400 mt-2 overflow-auto max-h-40">{this.state.errorInfo.componentStack}</pre>
                  </details>
                )}
              </div>
            )}

            <div className="space-y-3">
              <p className="text-gray-300">The error has been logged and our team will investigate. You can try the following:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                <li>Refresh the page</li>
                <li>Clear your browser cache</li>
                <li>Return to the home page</li>
              </ul>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Return to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>

            {import.meta.env.PROD && (
              <p className="mt-6 text-sm text-gray-500 text-center">Error ID: {Sentry.lastEventId() || 'N/A'}</p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
