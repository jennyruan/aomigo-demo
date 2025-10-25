import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      'next/navigation': path.resolve(__dirname, './src/lib/next-shims/navigation.ts'),
      'next/router': path.resolve(__dirname, './src/lib/next-shims/router.ts'),
      'next/link': path.resolve(__dirname, './src/lib/next-shims/link.tsx'),
      'next/headers': path.resolve(__dirname, './src/lib/next-shims/headers.ts'),
    },
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
});
