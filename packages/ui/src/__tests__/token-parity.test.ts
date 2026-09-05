// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parseTheme } from './helpers/theme';
import { ACCENT_PAIRS } from '../lib/accent-pairs';

/**
 * design-research/08-design-tokens.md mirrors theme.css by hand. If the doc is
 * checked out next to this repo, assert every value it lists still matches the
 * source of truth. The doc is never edited here — mismatches are reported.
 *
 * The path is resolved from this repo, not from a home directory: an absolute
 * one only ever matched a single machine, so the whole check skipped in silence
 * everywhere else. CI has no checkout of the doc and skips.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOC = path.resolve(__dirname, '../../../../../gerege-design-research/08-design-tokens.md');
const exists = existsSync(DOC);

const COLOR = /(?:hsl|oklch)\([^)]*\)/g;
const WHITE = 'hsl(0 0% 100%)';

interface Expectation {
  token: string;
  mode: 'light' | 'dark' | 'raw';
  expected: string;
}

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim());
}

function expandTokens(cell: string): string[] {
  const range = /`(--[\w-]+?)-(\d+)…(\d+)`/.exec(cell);
  if (range) {
    const out: string[] = [];
    for (let i = Number(range[2]); i <= Number(range[3]); i++) out.push(`${range[1]}-${i}`);
    return out;
  }
  return [...cell.matchAll(/`(--[\w-]+)`/g)].map((m) => m[1]);
}

function parseDoc(md: string): { expectations: Expectation[]; skipped: string[] } {
  const expectations: Expectation[] = [];
  const skipped: string[] = [];
  const lines = md.split('\n');

  // Table 1: | token | light | dark | use |
  for (const line of lines) {
    if (!line.startsWith('| `--')) continue;
    const [tokenCell, lightCell, darkCell] = cells(line);
    const tokens = expandTokens(tokenCell);
    const light = lightCell.match(COLOR) ?? [];
    const dark = darkCell.match(COLOR) ?? [];
    if (tokens.length === 0 || light.length !== tokens.length || dark.length !== tokens.length) {
      skipped.push(tokenCell);
      continue;
    }
    tokens.forEach((token, i) => {
      expectations.push({ token, mode: 'light', expected: light[i] });
      expectations.push({ token, mode: 'dark', expected: dark[i] });
    });
  }

  // Status table: | success | l1 / l2 / l3 / l4 / цагаан | d1 / … |
  const parts = ['subtle', 'border', 'foreground', 'solid'];
  for (const line of lines) {
    const m = /^\| (success|warning|danger|info) \|/.exec(line);
    if (!m) continue;
    const [, lightCell, darkCell] = cells(line);
    const status = m[1];
    for (const [mode, cell] of [
      ['light', lightCell],
      ['dark', darkCell],
    ] as const) {
      const values = cell.split('/').map((v) => v.trim());
      const colors = values.map((v) => (v === 'цагаан' ? WHITE : v.match(COLOR)?.[0]));
      if (colors.length !== 5 || colors.some((c) => !c)) {
        skipped.push(`${status} ${mode}`);
        continue;
      }
      parts.forEach((part, i) =>
        expectations.push({ token: `--${status}-${part}`, mode, expected: colors[i]! }),
      );
      expectations.push({ token: `--on-${status}`, mode, expected: colors[4]! });
    }
  }

  // Text scale: | `--text-xs` | 0.75rem (12) | 1rem (16) | 0.005em | use |
  for (const line of lines) {
    const m = /^\| `(--text-[\w]+)` \|/.exec(line);
    if (!m) continue;
    const [, size, lh, tracking] = cells(line);
    const num = (s: string) =>
      s
        .replace(/\(.*?\)/g, '')
        .replace('−', '-')
        .trim();
    expectations.push({ token: m[1], mode: 'raw', expected: num(size) });
    expectations.push({ token: `${m[1]}--line-height`, mode: 'raw', expected: num(lh) });
    expectations.push({ token: `${m[1]}--letter-spacing`, mode: 'raw', expected: num(tracking) });
  }

  // Radius / z-index / motion inline lists: `--radius-md` 6px · `--z-modal` 1300 · `--duration-fast` 120ms
  for (const line of lines) {
    if (!/^\*\*(Radius|Z-index|Motion)\*\*/.test(line)) continue;
    for (const m of line.matchAll(/`(--[\w-]+)` (`?)([^·`]+?)\2(?: ·|\.|$)/g)) {
      expectations.push({ token: m[1], mode: 'raw', expected: m[3].trim() });
    }
  }

  return { expectations, skipped };
}

const norm = (s: string) =>
  s
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/,\s*/g, ',')
    .replace(/^0(px|rem|ms)$/, '0')
    .trim();

const doc = exists ? readFileSync(DOC, 'utf8') : '';

describe.skipIf(!exists)('design-research/08-design-tokens.md ↔ theme.css parity', () => {
  const theme = parseTheme();
  const { expectations, skipped } = parseDoc(doc);

  it('parsed a meaningful number of doc tokens', () => {
    expect(expectations.length).toBeGreaterThan(80);
    console.info(
      `[token-parity] ${expectations.length} expectations; skipped composite rows: ${skipped.join(', ')}`,
    );
  });

  it('every documented token exists in theme.css', () => {
    const missing = expectations
      .filter((e) => !(e.token in theme[e.mode]))
      .map((e) => `${e.mode} ${e.token}`);
    expect([...new Set(missing)]).toEqual([]);
  });

  it('every documented value equals theme.css', () => {
    const mismatches = expectations
      .filter((e) => e.token in theme[e.mode])
      .filter((e) => norm(theme[e.mode][e.token]) !== norm(e.expected))
      .map((e) => `${e.mode} ${e.token}: doc=${e.expected} css=${theme[e.mode][e.token]}`);
    if (mismatches.length) console.error(`[token-parity] mismatches:\n${mismatches.join('\n')}`);
    expect(mismatches).toEqual([]);
  });
});

/**
 * The prose makes structural claims the value tables cannot carry: which
 * presets exist, which tokens a preset writes, and which pairs an accent is
 * held to. Each is parsed from the sentence that states it, so rewording the
 * doc without keeping the claim breaks the test — that is the point.
 */
describe.skipIf(!exists)('design-research/08-design-tokens.md prose ↔ theme.css', () => {
  const theme = parseTheme();
  const line = (startsWith: string) => {
    const hit = doc.split('\n').find((l) => l.startsWith(startsWith));
    if (!hit) throw new Error(`doc line not found: ${startsWith}`);
    return hit;
  };
  const tokens = (text: string) => [...text.matchAll(/`(--[\w-]+)`/g)].map((m) => m[1]);

  it('names exactly the presets theme.css ships', () => {
    const m = /data-accent="([a-z|]+)"/.exec(line('- Accent preset'));
    expect(m, 'data-accent="a|b|…" in the preset bullet').not.toBeNull();
    expect(m![1].split('|').sort()).toEqual(Object.keys(theme.accents).sort());
  });

  it('lists exactly the tokens every preset writes, in both modes', () => {
    // The list sits before "сольдог"; later clauses mention other tokens.
    const bullet = line('- Accent preset');
    const claimed = [...new Set(tokens(bullet.slice(0, bullet.indexOf('сольдог'))))].sort();
    expect(claimed.length).toBeGreaterThan(0);
    for (const [name, preset] of Object.entries(theme.accents)) {
      expect(Object.keys(preset.light).sort(), `${name} light`).toEqual(claimed);
      expect(Object.keys(preset.dark).sort(), `${name} dark`).toEqual(claimed);
    }
  });

  it('states the accent contrast rule as accent-pairs.ts has it', () => {
    const rule = line('4. Контраст');
    const after = rule.slice(rule.indexOf('Accent бүр'));
    const pairs = [...after.matchAll(/`([\w-]+)` × `([\w-]+)`/g)].map(([, fg, bg]) => ({ fg, bg }));
    expect(pairs).toEqual(ACCENT_PAIRS.map(({ fg, bg }) => ({ fg, bg })));
    expect(after).toContain('accent-pairs.ts');
  });
});
