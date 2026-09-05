// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { contrast, parseColor, toHex } from './helpers/color';
import { parseTheme, type TokenMap } from './helpers/theme';
import { ACCENT_PAIRS } from '../lib/accent-pairs';

/**
 * WCAG contrast for every semantic colour pair theme.css promises in its
 * header, in light and dark mode and for every `[data-accent]` preset.
 * Text pairs ≥ 4.5:1 (1.4.3), UI boundaries ≥ 3:1 (1.4.11).
 */

const theme = parseTheme();
const STATUSES = ['success', 'warning', 'danger', 'info'] as const;

interface Check {
  fg: string;
  bg: string;
  min: number;
}

const textOnSurfaces: Check[] = [];
for (const fg of ['--foreground', '--foreground-muted', '--foreground-subtle']) {
  for (const bg of ['--background', '--background-muted', '--card', '--popover']) {
    textOnSurfaces.push({ fg, bg, min: 4.5 });
  }
}
const uiOnSurfaces: Check[] = [];
for (const fg of ['--border-input', '--switch-track-off', '--ring', '--accent']) {
  for (const bg of ['--background', '--background-muted']) uiOnSurfaces.push({ fg, bg, min: 3 });
}
// The accent rule lives in src/lib/accent-pairs.ts, shared with the showcase
// theme editor; `--accent-foreground` is what `text-on-accent` resolves to.
const accentPairs: Check[] = ACCENT_PAIRS.map((p) => ({
  fg: `--${p.fg}`,
  bg: `--${p.bg}`,
  min: p.min,
}));
const statusPairs: Check[] = STATUSES.flatMap((s) => [
  { fg: `--${s}-foreground`, bg: `--${s}-subtle`, min: 4.5 },
  { fg: `--on-${s}`, bg: `--${s}-solid`, min: 4.5 },
  { fg: `--${s}-foreground`, bg: '--background', min: 4.5 },
]);
const otherPairs: Check[] = [
  { fg: '--card-foreground', bg: '--card', min: 4.5 },
  { fg: '--popover-foreground', bg: '--popover', min: 4.5 },
  { fg: '--tooltip-foreground', bg: '--tooltip', min: 4.5 },
  { fg: '--selection-foreground', bg: '--selection', min: 4.5 },
];

const ALL: Check[] = [
  ...textOnSurfaces,
  ...uiOnSurfaces,
  ...accentPairs,
  ...statusPairs,
  ...otherPairs,
];

function resolve(tokens: TokenMap, name: string): string {
  const v = tokens[name];
  if (!v) throw new Error(`token ${name} missing`);
  const ref = /^var\((--[\w-]+)\)$/.exec(v);
  return ref ? resolve(tokens, ref[1]) : v;
}

function ratio(tokens: TokenMap, c: Check) {
  const fg = parseColor(resolve(tokens, c.fg));
  const bg = parseColor(resolve(tokens, c.bg));
  return { value: contrast(fg, bg), fgHex: toHex(fg), bgHex: toHex(bg) };
}

function table(tokens: TokenMap, checks: Check[], label: string) {
  const rows = checks.map((c) => {
    const r = ratio(tokens, c);
    return { ...c, ...r, ok: r.value >= c.min };
  });
  const failures = rows.filter((r) => !r.ok);
  if (failures.length) {
    const fmt = (r: (typeof rows)[number]) =>
      `${r.ok ? ' ok ' : 'FAIL'}  ${r.fg.padEnd(28)} on ${r.bg.padEnd(22)} ${r.value.toFixed(2).padStart(6)} (min ${r.min})  ${r.fgHex} / ${r.bgHex}`;
    console.error(`\n[${label}] contrast table\n${rows.map(fmt).join('\n')}\n`);
  }
  return failures.map((f) => `${f.fg} on ${f.bg}: ${f.value.toFixed(2)} < ${f.min}`);
}

describe('theme.css parses', () => {
  it('has light, dark, and accent blocks with the same token names', () => {
    expect(Object.keys(theme.light).length).toBeGreaterThan(50);
    expect(Object.keys(theme.dark).sort()).toEqual(Object.keys(theme.light).sort());
    expect(Object.keys(theme.accents).sort()).toEqual([
      'amber',
      'blue',
      'emerald',
      'rose',
      'violet',
    ]);
  });

  it('every checked token is a colour we can parse', () => {
    for (const t of new Set(ALL.flatMap((c) => [c.fg, c.bg]))) {
      expect(() => parseColor(resolve(theme.light, t)), `${t} light`).not.toThrow();
      expect(() => parseColor(resolve(theme.dark, t)), `${t} dark`).not.toThrow();
    }
  });
});

describe('colour maths sanity', () => {
  it('white on black is 21:1, hsl and oklch agree with known values', () => {
    expect(contrast(parseColor('hsl(0 0% 100%)'), parseColor('hsl(0 0% 0%)'))).toBeCloseTo(21, 1);
    expect(toHex(parseColor('oklch(1 0 0)'))).toBe('#ffffff');
    expect(toHex(parseColor('oklch(0 0 0)'))).toBe('#000000');
    // oklch(0.627955 0.257683 29.2339) ≈ #ff0000 (OKLab reference value).
    expect(toHex(parseColor('oklch(0.627955 0.257683 29.2339)'))).toBe('#ff0000');
    expect(toHex(parseColor('hsl(238 50% 49%)'))).toBe('#3e43bb');
  });
});

describe('WCAG contrast — base theme', () => {
  it('light mode', () => {
    expect(table(theme.light, ALL, 'light')).toEqual([]);
  });
  it('dark mode', () => {
    expect(table(theme.dark, ALL, 'dark')).toEqual([]);
  });
});

describe('WCAG contrast — [data-accent] presets', () => {
  const presetChecks: Check[] = [
    ...uiOnSurfaces.filter((c) => c.fg === '--accent' || c.fg === '--ring'),
    ...accentPairs,
  ];
  for (const [name, preset] of Object.entries(theme.accents)) {
    it(`${name} light`, () => {
      const tokens = { ...theme.light, ...preset.light };
      expect(table(tokens, presetChecks, `accent=${name} light`)).toEqual([]);
    });
    it(`${name} dark`, () => {
      const tokens = { ...theme.dark, ...preset.dark };
      expect(table(tokens, presetChecks, `accent=${name} dark`)).toEqual([]);
    });
  }
});

describe('header comment ratios are not stale', () => {
  it.each([
    ['--foreground', '--background', 17.9],
    ['--foreground-muted', '--background', 7.4],
    ['--foreground-subtle', '--background', 5.1],
    ['--border-input', '--background', 3.55],
    ['--border-input', '--background-muted', 3.24],
    ['--accent-foreground', '--accent', 7.7],
  ])('light %s on %s ≈ %s', (fg, bg, documented) => {
    expect(ratio(theme.light, { fg, bg, min: 0 }).value).toBeCloseTo(documented, 0);
  });
});
