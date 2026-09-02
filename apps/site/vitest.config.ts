import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UI_SRC = path.resolve(__dirname, '../../packages/ui/src');

/** Showcase tests — same aliases as vite.config.ts, jsdom, no Tailwind. */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@gerege/ui': path.join(UI_SRC, 'index.ts'),
      '@': UI_SRC,
      '@site': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./scripts/test-setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
