/**
 * Theme editor model — the state behind `#theme`.
 *
 * One rule shapes everything here: a token the user has not touched is never
 * emitted. The live preview and the generated CSS both come from
 * `deriveTokens()`, so what the wall shows is exactly what pasting the snippet
 * gives you, and the snippet stays short enough to read.
 *
 * Accent values are OKLCH because that is what the library's own presets use
 * (see `brandPresets`); the derived steps mirror their shape so a custom accent
 * behaves like a built-in one in both modes.
 */
import type { BrandTokens } from '@/components/ui/DesignSystemProvider';
import { BASE_COLORS, CHART_PALETTES, STYLES, findPreset } from './presets';

export type FontChoice = 'geist' | 'system' | 'custom';

export interface ThemeState {
  /** Accent lightness in light mode (OKLCH L). */
  lightness: number;
  /** Accent chroma (OKLCH C). Capped at 0.2 — design-research 01-color. */
  chroma: number;
  /** Accent hue (OKLCH H, degrees). */
  hue: number;
  /** Named style bundle — radius, type scale, spacing. */
  style: string;
  /** Named neutral family — surfaces, borders, secondary text. */
  base: string;
  /** Named categorical series palette. */
  chart: string;
  /** Explicit radius override in px; `null` follows the style. */
  radius: number | null;
  fontSans: FontChoice;
  fontMono: FontChoice;
  /** Family name used when the matching choice is `custom`. */
  customSans: string;
  customMono: string;
}

/**
 * The library's own `--accent` (`hsl(238 50% 49%)`) converted to OKLCH, so the
 * editor opens exactly where theme.css sits and "unchanged" really means
 * unchanged.
 */
export const DEFAULT_STATE: ThemeState = {
  lightness: 0.457,
  chroma: 0.185,
  hue: 274.5,
  style: 'nova',
  base: 'slate',
  chart: 'default',
  radius: null,
  fontSans: 'geist',
  fontMono: 'geist',
  customSans: '',
  customMono: '',
};

export const MAX_CHROMA = 0.2;

/** Accent presets, mirroring `brandPresets` in the library. */
export const ACCENT_PRESETS: {
  name: string;
  label: string;
  hint: string;
  l: number;
  c: number;
  h: number;
}[] = [
  { name: 'default', label: 'Indigo', hint: 'Library default', l: 0.457, c: 0.185, h: 274.5 },
  { name: 'blue', label: 'Blue', hint: 'Cool, brighter blue', l: 0.55, c: 0.16, h: 250 },
  { name: 'violet', label: 'Violet', hint: 'Violet', l: 0.53, c: 0.2, h: 295 },
  { name: 'emerald', label: 'Emerald', hint: 'Green', l: 0.55, c: 0.13, h: 160 },
  { name: 'rose', label: 'Rose', hint: 'Pink red', l: 0.55, c: 0.19, h: 15 },
  { name: 'amber', label: 'Amber', hint: 'Amber', l: 0.56, c: 0.14, h: 65 },
];

const SANS_STACK = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const MONO_STACK =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";

/* ---------------------------------------------------------------- colour -- */

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

export function oklch(l: number, c: number, h: number): string {
  return `oklch(${round(l, 3)} ${round(c, 3)} ${round(h, 1)})`;
}

function round(n: number, places: number): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

/** OKLCH → linear sRGB (Björn Ottosson's matrices), unclipped. */
function oklchToLinearRgb(l: number, c: number, hDeg: number): [number, number, number] {
  const h = (hDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
}

/** WCAG relative luminance of an OKLCH colour. */
function luminance(l: number, c: number, h: number): number {
  const [r, g, b] = oklchToLinearRgb(l, c, h).map((v) => clamp(v, 0, 1));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio between two OKLCH colours. */
export function contrastRatio(a: [number, number, number], b: [number, number, number]): number {
  const la = luminance(...a);
  const lb = luminance(...b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** OKLCH → `#rrggbb`, for the hex field and the swatches. */
export function oklchToHex(l: number, c: number, h: number): string {
  const to = (v: number) => {
    const s = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
    return Math.round(clamp(s, 0, 1) * 255)
      .toString(16)
      .padStart(2, '0');
  };
  const [r, g, b] = oklchToLinearRgb(l, c, h);
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** `#rrggbb` → OKLCH. Returns null for anything that is not a 6-digit hex. */
export function hexToOklch(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const int = parseInt(m[1], 16);
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const r = lin((int >> 16) & 0xff);
  const g = lin((int >> 8) & 0xff);
  const b = lin(int & 0xff);
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return [round(L, 3), round(Math.hypot(A, B), 3), round(h, 1)];
}

/** White in OKLCH — `--accent-foreground` in light mode. */
const WHITE: [number, number, number] = [1, 0, 0];
/** `hsl(229 50% 6%)` — `--background` and `--accent-foreground` in dark mode. */
const NEUTRAL_950: [number, number, number] = [0.16, 0.036, 273];

export interface ContrastReport {
  /** Accent fill + its foreground, the ratio a solid button actually renders. */
  ratio: number;
  passes: boolean;
}

export function accentContrast(s: ThemeState, mode: 'light' | 'dark'): ContrastReport {
  const ratio =
    mode === 'light'
      ? contrastRatio([s.lightness, s.chroma, s.hue], WHITE)
      : contrastRatio([darkL(s), darkC(s), s.hue], NEUTRAL_950);
  return { ratio: round(ratio, 2), passes: ratio >= 4.5 };
}

/* ----------------------------------------------------------------- tokens -- */

/** Dark-mode accent: the library lifts it to the 400 step so it reads on neutral-950. */
function darkL(s: ThemeState): number {
  return clamp(s.lightness + 0.18, 0.55, 0.78);
}
function darkC(s: ThemeState): number {
  return Math.max(0.04, s.chroma - 0.02);
}

/** Radius scale derived from the base control radius. */
export function radiusScale(base: number): { sm: number; md: number; lg: number; xl: number } {
  if (base === 0) return { sm: 0, md: 0, lg: 0, xl: 0 };
  return { sm: Math.max(2, base - 2), md: base, lg: base + 2, xl: base + 6 };
}

function fontValue(choice: FontChoice, custom: string, kind: 'sans' | 'mono'): string | null {
  const stack = kind === 'sans' ? SANS_STACK : MONO_STACK;
  if (choice === 'geist') return null; // the library default
  if (choice === 'system') return stack;
  const name = custom.trim();
  if (!name) return null;
  return `'${name.replace(/'/g, '')}', ${stack}`;
}

export function accentChanged(s: ThemeState): boolean {
  return (
    s.lightness !== DEFAULT_STATE.lightness ||
    s.chroma !== DEFAULT_STATE.chroma ||
    s.hue !== DEFAULT_STATE.hue
  );
}

/** Both halves always present, so callers never have to guard `dark`. */
export interface DerivedTokens {
  light: BrandTokens;
  dark: BrandTokens;
}

/**
 * The only place tokens are computed. Returns `{light, dark}` holding just the
 * overrides — both empty when nothing has been touched.
 */
export function deriveTokens(s: ThemeState): DerivedTokens {
  const light: BrandTokens = {};
  const dark: BrandTokens = {};

  // Named bundles first; the fine-tune controls below deliberately win.
  for (const [list, name] of [
    [STYLES, s.style],
    [BASE_COLORS, s.base],
    [CHART_PALETTES, s.chart],
  ] as const) {
    const { tokens } = findPreset(list, name);
    Object.assign(light, tokens.light);
    Object.assign(dark, tokens.dark ?? {});
  }

  if (accentChanged(s)) {
    const { lightness: l, chroma: c, hue: h } = s;
    light.accent = oklch(l, c, h);
    light['color-accent-700'] = oklch(Math.max(0.2, l - 0.08), c, h);
    light['color-accent-800'] = oklch(Math.max(0.15, l - 0.16), Math.max(0.03, c - 0.02), h);
    light['accent-subtle'] = oklch(0.96, Math.min(0.03, c), h);
    light['accent-subtle-foreground'] = oklch(Math.max(0.2, l - 0.02), Math.max(0.04, c - 0.01), h);
    light.ring = oklch(Math.min(0.8, l + 0.07), c, h);

    dark.accent = oklch(darkL(s), darkC(s), h);
    dark['accent-subtle'] = oklch(0.24, Math.min(0.07, c), h);
    dark['accent-subtle-foreground'] = oklch(0.82, Math.min(0.12, c), h);
    dark.ring = oklch(Math.min(0.84, darkL(s) + 0.04), darkC(s), h);
  }

  if (s.radius !== null) {
    const r = radiusScale(s.radius);
    light['radius-sm'] = `${r.sm}px`;
    light['radius-md'] = `${r.md}px`;
    light['radius-lg'] = `${r.lg}px`;
    light['radius-xl'] = `${r.xl}px`;
  }

  const sans = fontValue(s.fontSans, s.customSans, 'sans');
  if (sans) light['font-sans'] = sans;
  const mono = fontValue(s.fontMono, s.customMono, 'mono');
  if (mono) light['font-mono'] = mono;

  return { light, dark };
}

export function changedCount(s: ThemeState): number {
  const { light, dark } = deriveTokens(s);
  return Object.keys(light).length + Object.keys(dark).length;
}

/* -------------------------------------------------------------------- css -- */

const IMPORTS = [
  "@import 'tailwindcss';",
  "@import 'tw-animate-css';",
  "@import '@gerege-systems/ui/theme.css';",
  '@source "../node_modules/@gerege-systems/ui/dist-lib";',
].join('\n');

function block(selector: string, tokens: BrandTokens): string {
  const body = Object.entries(tokens)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
}

/** The snippet the Get code dialog hands over — imports plus changed tokens. */
export function generateCss(s: ThemeState, withImports: boolean): string {
  const { light, dark } = deriveTokens(s);
  const parts: string[] = [];
  if (withImports) parts.push(IMPORTS);
  if (!Object.keys(light).length && !Object.keys(dark).length) {
    parts.push('/* Nothing changed — the library defaults still apply. */');
    return parts.join('\n\n');
  }
  if (s.style !== DEFAULT_STATE.style) {
    parts.push(
      `/* Style: put data-style="${s.style}" on <html> (or any subtree).
` + '   The rules ship with the library — nothing to copy for this line. */',
    );
  }
  parts.push('/* Theme editor — ui.gecore.mn/#theme */');
  if (Object.keys(light).length) parts.push(block(':root', light));
  if (Object.keys(dark).length) parts.push(block('.dark', dark));
  return parts.join('\n\n');
}

/* -------------------------------------------------------------------- url -- */

/** Encode the state into the hash tail so a theme can be shared as a link. */
export function encodeState(s: ThemeState): string {
  const p = new URLSearchParams();
  if (accentChanged(s)) {
    p.set('l', String(s.lightness));
    p.set('c', String(s.chroma));
    p.set('h', String(s.hue));
  }
  if (s.style !== DEFAULT_STATE.style) p.set('st', s.style);
  if (s.base !== DEFAULT_STATE.base) p.set('bc', s.base);
  if (s.chart !== DEFAULT_STATE.chart) p.set('ch', s.chart);
  if (s.radius !== null) p.set('r', String(s.radius));
  if (s.fontSans !== DEFAULT_STATE.fontSans) p.set('fs', s.fontSans);
  if (s.fontMono !== DEFAULT_STATE.fontMono) p.set('fm', s.fontMono);
  if (s.customSans) p.set('cs', s.customSans);
  if (s.customMono) p.set('cm', s.customMono);
  const q = p.toString();
  return q ? `?${q}` : '';
}

const isFont = (v: string): v is FontChoice => v === 'geist' || v === 'system' || v === 'custom';

/** Read a state back out of a hash tail. Unknown or malformed values fall back. */
export function decodeState(hash: string): ThemeState {
  const tail = hash.split('?')[1];
  const s = { ...DEFAULT_STATE };
  if (!tail) return s;
  const p = new URLSearchParams(tail);
  const num = (key: string, lo: number, hi: number, fallback: number) => {
    const raw = p.get(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? clamp(n, lo, hi) : fallback;
  };
  s.lightness = num('l', 0.3, 0.8, s.lightness);
  s.chroma = num('c', 0, MAX_CHROMA, s.chroma);
  s.hue = num('h', 0, 360, s.hue);
  const rawRadius = p.get('r');
  s.radius = rawRadius === null ? null : num('r', 0, 24, 6);
  for (const [key, list, field] of [
    ['st', STYLES, 'style'],
    ['bc', BASE_COLORS, 'base'],
    ['ch', CHART_PALETTES, 'chart'],
  ] as const) {
    const v = p.get(key);
    if (v && list.some((x) => x.name === v)) s[field] = v;
  }
  const fs = p.get('fs');
  if (fs && isFont(fs)) s.fontSans = fs;
  const fm = p.get('fm');
  if (fm && isFont(fm)) s.fontMono = fm;
  s.customSans = (p.get('cs') ?? '').slice(0, 60);
  s.customMono = (p.get('cm') ?? '').slice(0, 60);
  return s;
}
