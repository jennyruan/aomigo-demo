import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      'next/navigation': '/src/lib/next-shims/navigation.ts',
      'next/router': '/src/lib/next-shims/router.ts',
      'next/link': '/src/lib/next-shims/link.tsx',
      'next/headers': '/src/lib/next-shims/headers.ts',
    },
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
});
