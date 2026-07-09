import path from 'path';
import { defineConfig } from 'vite';

// In Replit workflows PORT and BASE_PATH are always injected.
// For external deployments (GitHub Pages, Netlify, Vercel) we fall back to
// safe defaults so the build never hard-fails due to missing env vars.
const port = Number(process.env.PORT) || 5173;
const basePath = process.env.BASE_PATH || '/';

// Only load the Replit overlay plugin when running inside Replit
const plugins: import('vite').PluginOption[] = [];
if (process.env.REPL_ID !== undefined) {
  const { default: runtimeErrorOverlay } = await import(
    '@replit/vite-plugin-runtime-error-modal'
  );
  plugins.push(runtimeErrorOverlay());
}

export default defineConfig({
  base: basePath,
  plugins,
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5012',
        changeOrigin: true,
      }
    }
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
