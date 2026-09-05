// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * The style layer reaches a component only through the `data-slot` its markup
 * carries, so the two ways that link breaks are both silent: a component that
 * hardcodes a radius without a slot keeps its own corners in every style, and a
 * rule written for a slot nothing emits styles nothing at all. Neither shows up
 * as an error — only as a component that ignores the style you picked. Both
 * directions are asserted here so the next one fails in CI instead.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS = path.resolve(__dirname, '../components/ui');
const STYLES = path.resolve(__dirname, '../styles/component-styles.css');

/**
 * Components that carry a radius but no slot of their own, with the reason.
 * An entry is only valid while the component really is slotless — the last test
 * here drops stale ones.
 */
const SHAPE_DELEGATED: Record<string, string> = {
  DataGrid: "its only radius is handed to Table's slotted scroll frame",
};

/** A Tailwind radius utility: `rounded`, `rounded-lg`, `rounded-[2px]`, … */
const RADIUS = /\brounded(?![\w-])|\brounded-/;
const HAS_SLOT = /data-slot="[a-z-]+"/;
const SLOT_IN_TSX = /data-slot="([a-z-]+)"/g;
const SLOT_IN_CSS = /\[data-slot='([a-z-]+)'\]/g;

const stripCssComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

const sources = readdirSync(COMPONENTS)
  .filter((f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx'))
  .map((file) => ({
    name: path.basename(file, '.tsx'),
    source: readFileSync(path.join(COMPONENTS, file), 'utf8'),
  }));

const emitted = new Set(
  sources.flatMap(({ source }) => [...source.matchAll(SLOT_IN_TSX)].map((m) => m[1])),
);

const styled = new Set(
  [...stripCssComments(readFileSync(STYLES, 'utf8')).matchAll(SLOT_IN_CSS)].map((m) => m[1]),
);

const hasSlot = ({ source }: { source: string }) => HAS_SLOT.test(source);

describe('style layer: slots and rules stay in step', () => {
  it('reads the component sources it means to check', () => {
    expect(sources.length).toBeGreaterThan(40);
    expect(styled.size).toBeGreaterThan(20);
  });

  it('every component with a radius declares a data-slot', () => {
    const missing = sources
      .filter((file) => RADIUS.test(file.source) && !hasSlot(file))
      .map(({ name }) => name)
      .filter((name) => !(name in SHAPE_DELEGATED));
    expect(
      missing,
      `these hold a radius the style layer cannot reach — add data-slot, or list them in ` +
        `SHAPE_DELEGATED with the reason: ${missing.join(', ')}`,
    ).toEqual([]);
  });

  it('every slot the stylesheet names is emitted by a component', () => {
    const dead = [...styled].filter((slot) => !emitted.has(slot));
    expect(dead, `component-styles.css styles slots nothing renders: ${dead.join(', ')}`).toEqual(
      [],
    );
  });

  it('SHAPE_DELEGATED holds only components that are still slotless', () => {
    const stale = Object.keys(SHAPE_DELEGATED).filter((name) => {
      const file = sources.find((s) => s.name === name);
      return !file || hasSlot(file);
    });
    expect(stale, `drop from SHAPE_DELEGATED — gone or slotted now: ${stale.join(', ')}`).toEqual(
      [],
    );
  });
});
