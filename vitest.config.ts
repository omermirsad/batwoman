import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**', '**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.{js,ts}',
        '**/icons/**',
        '**/*.d.ts',
        'dist/',
        'dist-server/',
        'api/',
        'components/', // Exclude components from coverage for now
        'data/', // Exclude static data
        'config/', // Exclude config
        'services/', // Exclude services (production service uses backend)
        'hooks/', // Exclude hooks
        'utils/monitoring.ts', // Exclude monitoring (external service integration)
        'utils/sentry.ts', // Exclude sentry (external service integration)
        'App.tsx',
        'index.tsx',
        'types.ts',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
