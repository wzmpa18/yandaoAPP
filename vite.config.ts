import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    cacheDir: './node_modules/.vite-cache',
  },
  build: {
    cacheDir: './.vite/build-cache',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@supabase/supabase-js'],
          lucide: ['lucide-react'],
        },
      },
    },
    assetsInlineLimit: 4096,
    minify: 'esbuild',
    sourcemap: false,
  },
  server: {
    timeout: 60000,
    proxy: {
      '/api': {
        target: 'https://mfwvwohgpxgeihmqludt.supabase.co',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});