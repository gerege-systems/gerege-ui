import { useMemo } from 'react';
import { UI_BLOCKS } from '../uiblocks/registry';

/**
 * The wall the theme is judged on — every block from the Blocks section,
 * composed from library components only, so a token change lands everywhere at
 * once. It renders the same registry the Blocks page does: one set of blocks,
 * two places to look at them.
 *
 * The order is shuffled from a seed. A fixed order teaches you the page rather
 * than the theme: you learn where to look and stop seeing the rest. Reshuffling
 * puts a different pair of blocks side by side, which is where mismatched
 * spacing and contrast actually show up.
 */
export function ThemePreviewWall({ seed }: { seed: number }) {
  const blocks = useMemo(() => shuffle(UI_BLOCKS, seed), [seed]);
  return (
    <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
      {blocks.map(({ slug, Component }) => (
        <div key={slug}>
          <Component />
        </div>
      ))}
    </div>
  );
}

/** mulberry32 — small, seedable, and stable across reloads for a given seed. */
function shuffle<T>(items: readonly T[], seed: number): T[] {
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Block count, for the page header. */
export const BLOCK_COUNT = UI_BLOCKS.length;
