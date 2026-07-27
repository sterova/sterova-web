import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  // The Supabase integration provisions its keys with a NEXT_PUBLIC_ prefix, so
  // allow that prefix through alongside Vite's own.
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: 'https://sterova.tech',
      // The CMS must never be advertised to crawlers.
      exclude: ['/sterova-admin'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'lucide';
            if (id.includes('@radix-ui')) return 'radix';
            if (id.includes('framer-motion')) return 'framer';
            if (id.includes('react') || id.includes('react-dom')) return 'react';
            return 'vendor';
          }
        },
      },
    },
  },
});
