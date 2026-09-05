import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Library build only. The showcase site lives in `apps/site` and has its own
 * Vite config — this package never builds an HTML app, only the distributable
 * ESM modules + type declarations under `dist-lib/`.
 *
 * ESM-only, one output file per source module (`preserveModules`) so a
 * consumer's bundler can drop every component it does not import — including
 * their heavy deps (react-day-picker, vaul, cmdk, embla, react-hook-form).
 * CJS was dropped with this change: with per-module output the `.d.cts`
 * story breaks (every module would need a duplicate), and every supported
 * React 18/19 toolchain resolves ESM packages.
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      entryRoot: 'src',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/__tests__/**', 'src/test/**'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist-lib',
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        icon: path.resolve(__dirname, 'src/icon.ts'),
      },
      formats: ['es'],
      cssFileName: 'styles',
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Rollup strips module-level directives; re-add per file so Next.js App Router
        // treats every module as a Client Component (all export hooks/context).
        banner: "'use client';",
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        /^@radix-ui\//,
        'class-variance-authority',
        'clsx',
        'cmdk',
        /^embla-carousel/,
        // Regex: keeps subpaths external too — lucide-react/dynamicIconImports
        // powers <Icon name="…"> (the `./icon` entry).
        /^lucide-react/,
        'react-day-picker',
        'react-hook-form',
        'tailwind-merge',
        'vaul',
      ],
    },
  },
});
