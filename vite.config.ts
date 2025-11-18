import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProd = mode === 'production';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
      ],
      define: {
        // Remove API key from client bundle in production
        'process.env.API_KEY': isProd ? JSON.stringify('') : JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': isProd ? JSON.stringify('') : JSON.stringify(env.GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: !isProd,
        minify: isProd ? 'terser' : false,
        terserOptions: isProd ? {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        } : undefined,
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'markdown-vendor': ['react-markdown', 'remark-gfm'],
              'monitoring-vendor': ['@sentry/react', 'web-vitals'],
            }
          }
        },
        chunkSizeWarningLimit: 1000,
      },
      optimizeDeps: {
        include: ['react', 'react-dom', '@sentry/react', 'web-vitals'],
      },
    };
});