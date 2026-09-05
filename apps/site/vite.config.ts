import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { siteCounts } from './scripts/site-counts';

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
 * rebuild step. The displayed import strings still read `@gerege-systems/ui`; this
 * alias just points that bare specifier (and the legacy `@/…` paths the ported
 * docs use) at the workspace source.
 */
/** `%COMPONENT_COUNT%` / `%TEMPLATE_COUNT%` / `%GUIDE_COUNT%` in index.html. */
function metaCounts(): Plugin {
  return {
    name: 'site-meta-counts',
    transformIndexHtml(html) {
      const c = siteCounts();
      return html
        .replaceAll('%COMPONENT_COUNT%', String(c.components))
        .replaceAll('%TEMPLATE_COUNT%', String(c.templates))
        .replaceAll('%GUIDE_COUNT%', String(c.guides));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), metaCounts()],
  define: { __UI_VERSION__: JSON.stringify(UI_VERSION) },
  resolve: {
    alias: {
      '@gerege-systems/ui': path.join(UI_SRC, 'index.ts'),
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
