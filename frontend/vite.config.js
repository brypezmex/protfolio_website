import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration.
 *
 * The dev server proxies `/api` to the Flask backend so that local development
 * uses the same relative API paths as production. In production, nginx (or any
 * reverse proxy) performs the equivalent mapping - see deploy/nginx.conf.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_DEV_API_PROXY || 'http://127.0.0.1:5001';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      target: 'es2020',
      // Source maps stay off for production to keep the deployed bundle small.
      sourcemap: false,
      rollupOptions: {
        output: {
          // Split React out of the app chunk so app-code changes do not
          // invalidate the (much larger, rarely changing) vendor chunk.
          // All four entry points must be listed - naming only 'react-dom'
          // leaves 'react-dom/client' and the JSX runtime in the app chunk.
          manualChunks: {
            react: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
          },
        },
      },
    },
  };
});
