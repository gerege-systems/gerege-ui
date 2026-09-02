import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UI_SRC = path.resolve(__dirname, '../../packages/ui/src');
// Library version shown in the showcase — read from the package so a release
// bump (changesets) never leaves a stale badge.
const UI_VERSION = (
  JSON.parse(readFileSync(path.resolve(__dirname, '../../packages/ui/package.json'), 'utf8')) as {
    version: string;
  }
).version;

/**
 * Showcase site build. The library is consumed straight from source via the
 * aliases below, so editing a component hot-reloads the docs instantly — no
 * rebuild step. The displayed import strings still read `@gerege/ui`; this
 * alias just points that bare specifier (and the legacy `@/…` paths the ported
 * docs use) at the workspace source.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: { __UI_VERSION__: JSON.stringify(UI_VERSION) },
  resolve: {
    alias: {
      '@gerege/ui': path.join(UI_SRC, 'index.ts'),
      '@': UI_SRC,
      '@site': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // One vendor chunk for all third-party code: it changes far less often
        // than app code, so it stays cached across deploys. Everything lives in
        // a single chunk (React included), so there's no cross-chunk init order
        // to get wrong — route pages, blocks and the generated-props table are
        // split off separately via dynamic import().
        //
        // Exception: lucide's per-icon modules. <Icon name="…"> imports them
        // lazily via lucide-react/dynamicIconImports; folding them into vendor
        // would inline the entire icon set (~900 kB). Returning undefined
        // keeps each one its own lazy chunk.
        manualChunks: (id) => {
          if (/lucide-react.*icons/.test(id)) return undefined;
          return id.includes('node_modules') ? 'vendor' : undefined;
        },
      },
    },
  },
});
