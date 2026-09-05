/**
 * Registry sizes for the static `<meta>` copy in index.html. Read from the
 * registry sources at build time (vite.config.ts injects them), so the numbers
 * crawlers see never drift from what the home page renders — the home page
 * takes the same counts from the registry at runtime, and
 * src/showcase/__tests__/site-counts.test.ts asserts the two agree.
 *
 * Kept as a file scan rather than importing the registry: the registry pulls
 * in every doc page (JSX, CSS, the library), which vite.config.ts cannot load.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/showcase');

export interface SiteCounts {
  components: number;
  templates: number;
  guides: number;
}

const count = (file: string, re: RegExp) =>
  (fs.readFileSync(path.join(SRC, file), 'utf8').match(re) ?? []).length;

export function siteCounts(): SiteCounts {
  return {
    // One `*.docs.tsx` per component doc, each exporting a single ComponentDoc.
    components: fs.readdirSync(path.join(SRC, 'components')).filter((f) => f.endsWith('.docs.tsx'))
      .length,
    // blockMeta entries (4-space indent inside the array literal).
    templates: count('blocks/meta.ts', /^ {4}slug: '/gm),
    // Top-level GuideDoc objects (2-space indent).
    guides: count('registry/guides.tsx', /^ {2}slug: '/gm),
  };
}
