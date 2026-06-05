import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  optimizeDeps: {
    cacheDir: './node_modules/.vite-cache',
  },
  build: {
    cacheDir: './.vite/build-cache',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@supabase/supabase-js'],
        },
      },
    },
    assetsInlineLimit: 4096,
    minify: 'esbuild',
    sourcemap: false,
    // 确保大文件不被内联
    chunkSizeWarningLimit: 5000,
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