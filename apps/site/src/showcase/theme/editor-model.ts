/**
 * Theme editor model — the state behind `#theme`.
 *
 * One rule shapes everything here: a token the user has not touched is never
 * emitted. The live preview and the generated CSS both come from
 * `deriveTokens()`, so what the wall shows is exactly what pasting the snippet
 * gives you, and the snippet stays short enough to read.
 *
 * Accent values are OKLCH because that is what the library's own presets use.
 * The library's `brandPresets` are the source of truth for the named accents:
 * picking one of them previews the library's exact light/dark tokens and the
 * snippet hands over `data-accent="…"` instead of repeating those values.
 */
import {
  brandPresets,
  type BrandName,
  type BrandTokens,
} from '@/components/ui/DesignSystemProvider';
import { ACCENT_PAIRS, type AccentPair } from '@/lib/accent-pairs';
import { BASE_COLORS, CHART_PALETTES, DEPTHS, STYLES, findPreset } from './presets';
import { FONTS, MONO_FONTS, findFont, googleFontsUrl } from './fonts';

export interface ThemeState {
  /** Accent lightness in light mode (OKLCH L). */
  lightness: number;
  /** Accent chroma (OKLCH C). Capped at 0.2 — design-research 01-color. */
  chroma: number;
  /** Accent hue (OKLCH H, degrees). */
  hue: number;
  /** Named style — radius, control size, density (`data-style`). */
  style: string;
  /** Named elevation step — how far surfaces float (`data-depth`). */
  depth: string;
  /** Named neutral family — surfaces, borders, secondary text. */
  base: string;
  /** Named categorical series palette. */
  chart: string;
  /**
   * Explicit control radius in px; `null` follows the style. `PILL` (9999)
   * is the "Full" choice. Ignored under a style that owns its shape (vega, lyra).
   */
  radius: number | null;
  /** Body family — a key into FONTS. */
  fontSans: string;
  /** Heading family; headings resolve through their own token. */
  fontHeading: string;
  /** Monospace family — a key into MONO_FONTS. */
  fontMono: string;
}

/** The "Full" radius: every corner a pill. */
export const PILL = 9999;

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
  depth: 'soft',
  base: 'slate',
  chart: 'default',
  radius: null,
  fontSans: 'geist',
  fontHeading: 'geist',
  fontMono: 'geist-mono',
};

export const MAX_CHROMA = 0.2;

export interface AccentPreset {
  name: string;
  label: string;
  hint: string;
  l: number;
  c: number;
  h: number;
  /** Set when the accent is one of the library's `brandPresets` (or its default). */
  library?: BrandName;
}

/** `oklch(l c h)` → numbers; the only colour syntax `brandPresets` uses. */
function parseOklch(v: string): [number, number, number] {
  const m = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(v);
  if (!m) throw new Error(`not an oklch() value: ${v}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function fromLibrary(name: BrandName, label: string, hint: string): AccentPreset {
  const [l, c, h] = parseOklch(brandPresets[name].light.accent);
  return { name, label, hint, l, c, h, library: name };
}

/**
 * Accent presets in hue order. The five named after `brandPresets` read their
 * numbers from the library, so the two can never disagree; the rest are
 * editor-only and go out as plain tokens.
 */
export const ACCENT_PRESETS: AccentPreset[] = [
  {
    name: 'default',
    label: 'Indigo',
    hint: 'Library default — graphite indigo',
    l: DEFAULT_STATE.lightness,
    c: DEFAULT_STATE.chroma,
    h: DEFAULT_STATE.hue,
    library: 'default',
  },
  {
    name: 'neutral',
    label: 'Neutral',
    hint: 'Greyscale — the accent recedes',
    l: 0.44,
    c: 0.012,
    h: 260,
  },
  {
    name: 'red',
    label: 'Red',
    hint: 'Alarm-adjacent; keep destructive distinct',
    l: 0.54,
    c: 0.2,
    h: 27,
  },
  fromLibrary('rose', 'Rose', 'Warm pink-red'),
  { name: 'orange', label: 'Orange', hint: 'Warm, high energy', l: 0.58, c: 0.16, h: 50 },
  fromLibrary('amber', 'Amber', 'Golden; white text is borderline'),
  // 0.53: at 0.57 white text sat at 4.45:1, under AA.
  {
    name: 'yellow',
    label: 'Yellow',
    hint: 'Darkened so white text passes',
    l: 0.53,
    c: 0.13,
    h: 95,
  },
  fromLibrary('emerald', 'Emerald', 'Calm green'),
  { name: 'teal', label: 'Teal', hint: 'Cool green', l: 0.54, c: 0.12, h: 190 },
  fromLibrary('blue', 'Blue', 'Cooler and brighter than indigo'),
  fromLibrary('violet', 'Violet', 'Saturated purple-violet'),
  { name: 'purple', label: 'Purple', hint: 'Deep magenta-violet', l: 0.5, c: 0.21, h: 312 },
];

/** The library preset the state's accent matches exactly, if any. */
export function libraryAccent(s: ThemeState): BrandName | null {
  const hit = ACCENT_PRESETS.find(
    (p) => p.library && p.l === s.lightness && p.c === s.chroma && p.h === s.hue,
  );
  return hit?.library ?? null;
}

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

/** `hsl(h s% l%)` → linear sRGB. theme.css writes its neutrals this way. */
function hslToLinearRgb(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return [lin(f(0)), lin(f(8)), lin(f(4))];
}

/** Linear sRGB of an `oklch()` / `hsl()` string — the two syntaxes the tokens use. */
function linearRgb(color: string): [number, number, number] {
  const ok = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(color);
  if (ok) return oklchToLinearRgb(Number(ok[1]), Number(ok[2]), Number(ok[3]));
  const hsl = /^hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)$/.exec(color);
  if (hsl) return hslToLinearRgb(Number(hsl[1]), Number(hsl[2]) / 100, Number(hsl[3]) / 100);
  throw new Error(`unsupported colour: ${color}`);
}

/** WCAG relative luminance. */
function luminance(color: string): number {
  const [r, g, b] = linearRgb(color).map((v) => clamp(v, 0, 1));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio between two token colours. */
export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return round((hi + 0.05) / (lo + 0.05), 2);
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

/* --------------------------------------------------------------- contrast -- */

/**
 * The accent tokens theme.css ships, per mode — what the preview and a
 * consumer see whenever the editor emits nothing for the accent.
 */
const THEME_ACCENT = {
  light: {
    accent: oklch(DEFAULT_STATE.lightness, DEFAULT_STATE.chroma, DEFAULT_STATE.hue),
    'accent-foreground': 'hsl(0 0% 100%)',
    'accent-subtle': 'hsl(232 100% 97%)',
    'accent-subtle-foreground': 'hsl(238 48% 40%)',
    background: 'hsl(0 0% 100%)',
  },
  dark: {
    accent: 'hsl(238 60% 67%)',
    'accent-foreground': 'hsl(229 50% 6%)',
    'accent-subtle': 'hsl(238 50% 16%)',
    'accent-subtle-foreground': 'hsl(234 71% 78%)',
    background: 'hsl(229 50% 6%)',
  },
} as const;

export interface ContrastCheck extends AccentPair {
  ratio: number;
  passes: boolean;
}

/**
 * One check per pair in the library's accent rule (`ACCENT_PAIRS` — the same
 * list the token test holds every preset to), plus the verdict over all.
 */
export interface ContrastReport {
  checks: ContrastCheck[];
  passes: boolean;
}

export function accentContrast(s: ThemeState, mode: 'light' | 'dark'): ContrastReport {
  const base = THEME_ACCENT[mode];
  const derived = deriveTokens(s)[mode];
  const tok = (k: string) => derived[k] ?? base[k as keyof typeof base];
  const checks = ACCENT_PAIRS.map((p) => {
    const ratio = contrast(tok(p.fg), tok(p.bg));
    return { ...p, ratio, passes: ratio >= p.min };
  });
  return { checks, passes: checks.every((c) => c.passes) };
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
  if (base >= PILL) return { sm: PILL, md: PILL, lg: PILL, xl: PILL };
  return { sm: Math.max(2, base - 2), md: base, lg: base + 2, xl: base + 6 };
}

/** `9999px` reads as nonsense in copy; the choice is called Full. */
export function formatRadius(px: number): string {
  return px >= PILL ? 'full' : `${px}px`;
}

/** vega and lyra set absolute radii, so the radius tokens cannot reach them. */
export function styleOwnsRadius(style: string): boolean {
  return findPreset(STYLES, style).absoluteRadius === true;
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

const ACCENT_KEYS = ['accent', 'accent-subtle', 'accent-subtle-foreground', 'ring'] as const;

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

  const lib = libraryAccent(s);
  if (lib && lib !== 'default') {
    // The library's own numbers, so the wall shows what `data-accent` gives.
    const preset = brandPresets[lib];
    Object.assign(light, preset.light);
    Object.assign(dark, preset.dark ?? {});
  } else if (accentChanged(s)) {
    const { lightness: l, chroma: c, hue: h } = s;
    light.accent = oklch(l, c, h);
    light['accent-subtle'] = oklch(0.96, Math.min(0.03, c), h);
    // Two steps darker than the fill: warm hues (orange, teal) sat under 4.5:1
    // on the soft surface at l - 0.02.
    light['accent-subtle-foreground'] = oklch(Math.max(0.2, l - 0.06), Math.max(0.04, c - 0.01), h);
    light.ring = oklch(Math.min(0.8, l + 0.07), c, h);

    dark.accent = oklch(darkL(s), darkC(s), h);
    dark['accent-subtle'] = oklch(0.24, Math.min(0.07, c), h);
    dark['accent-subtle-foreground'] = oklch(0.82, Math.min(0.12, c), h);
    dark.ring = oklch(Math.min(0.84, darkL(s) + 0.04), darkC(s), h);
  }

  if (s.radius !== null && !styleOwnsRadius(s.style)) {
    const r = radiusScale(s.radius);
    light['radius-sm'] = `${r.sm}px`;
    light['radius-md'] = `${r.md}px`;
    light['radius-lg'] = `${r.lg}px`;
    light['radius-xl'] = `${r.xl}px`;
  }

  if (s.fontSans !== DEFAULT_STATE.fontSans) light['font-sans'] = findFont(FONTS, s.fontSans).stack;
  if (s.fontHeading !== DEFAULT_STATE.fontHeading) {
    light['font-heading'] = findFont(FONTS, s.fontHeading).stack;
  }
  if (s.fontMono !== DEFAULT_STATE.fontMono) {
    light['font-mono'] = findFont(MONO_FONTS, s.fontMono).stack;
  }

  return { light, dark };
}

/**
 * What the wall renders. Same tokens as the snippet plus one preview-only
 * line: theme.css declares `--font-heading: var(--font-sans)` on `:root`, and
 * a `var()` inside a custom property is substituted where it is declared —
 * so headings under the provider would keep the old body face while a
 * consumer's `:root { --font-sans }` moves both. Re-declaring the alias on the
 * provider makes the preview resolve it against the new body face too.
 */
export function previewTokens(s: ThemeState): DerivedTokens {
  const t = deriveTokens(s);
  if (t.light['font-sans'] && !t.light['font-heading']) {
    t.light['font-heading'] = 'var(--font-sans)';
  }
  return t;
}

export function changedCount(s: ThemeState): number {
  const { light, dark } = deriveTokens(s);
  return Object.keys(light).length + Object.keys(dark).length;
}

/* -------------------------------------------------------------------- css -- */

/** How the consumer loads the library — the two setups the README documents. */
export type CssSetup = 'tailwind' | 'plain';

const IMPORTS: Record<CssSetup, string> = {
  tailwind: [
    "@import 'tailwindcss';",
    "@import 'tw-animate-css';",
    "@import '@gerege-systems/ui/theme.css';",
    '@source "../node_modules/@gerege-systems/ui/dist-lib";',
  ].join('\n'),
  plain: "@import '@gerege-systems/ui/styles.css';",
};

function block(selector: string, tokens: BrandTokens): string {
  const body = Object.entries(tokens)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
}

/**
 * The snippet the Get code dialog hands over: imports for the chosen setup,
 * the attributes to set, and the changed tokens. An accent that is one of the
 * library's presets becomes `data-accent="…"` rather than its values.
 */
export function generateCss(s: ThemeState, setup: CssSetup | null): string {
  const { light, dark } = deriveTokens(s);
  const parts: string[] = [];
  const fontsUrl = googleFontsUrl([
    s.fontSans !== DEFAULT_STATE.fontSans ? findFont(FONTS, s.fontSans).google : null,
    s.fontHeading !== DEFAULT_STATE.fontHeading ? findFont(FONTS, s.fontHeading).google : null,
    s.fontMono !== DEFAULT_STATE.fontMono ? findFont(MONO_FONTS, s.fontMono).google : null,
  ]);
  if (setup) {
    // The font import has to come first: CSS drops an @import that follows a
    // rule, and the families must be there before the tokens name them.
    parts.push(fontsUrl ? `@import url('${fontsUrl}');\n${IMPORTS[setup]}` : IMPORTS[setup]);
  }

  const lib = libraryAccent(s);
  const attrs: [string, string][] = [];
  if (s.style !== DEFAULT_STATE.style) attrs.push(['data-style', s.style]);
  if (s.depth !== DEFAULT_STATE.depth) attrs.push(['data-depth', s.depth]);
  if (lib && lib !== 'default') {
    attrs.push(['data-accent', lib]);
    for (const k of ACCENT_KEYS) {
      delete light[k];
      delete dark[k];
    }
  }

  if (!Object.keys(light).length && !Object.keys(dark).length && !attrs.length) {
    parts.push('/* Nothing changed — the library defaults still apply. */');
    return parts.join('\n\n');
  }
  for (const [attr, value] of attrs) {
    parts.push(
      `/* Put ${attr}="${value}" on <html> (or any subtree).
` + '   The values ship with the library — nothing to copy for this line. */',
    );
  }
  if (Object.keys(light).length || Object.keys(dark).length) {
    parts.push('/* Theme editor — ui.gecore.mn/#theme */');
    if (Object.keys(light).length) parts.push(block(':root', light));
    if (Object.keys(dark).length) parts.push(block('.dark', dark));
  }
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
  if (s.depth !== DEFAULT_STATE.depth) p.set('dp', s.depth);
  if (s.base !== DEFAULT_STATE.base) p.set('bc', s.base);
  if (s.chart !== DEFAULT_STATE.chart) p.set('ch', s.chart);
  if (s.radius !== null) p.set('r', String(s.radius));
  if (s.fontSans !== DEFAULT_STATE.fontSans) p.set('fs', s.fontSans);
  if (s.fontHeading !== DEFAULT_STATE.fontHeading) p.set('fh', s.fontHeading);
  if (s.fontMono !== DEFAULT_STATE.fontMono) p.set('fm', s.fontMono);
  const q = p.toString();
  return q ? `?${q}` : '';
}

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
  s.hue = num('h', 0, 360, s.hue) % 360;
  for (const [key, list, field] of [
    ['st', STYLES, 'style'],
    ['dp', DEPTHS, 'depth'],
    ['bc', BASE_COLORS, 'base'],
    ['ch', CHART_PALETTES, 'chart'],
  ] as const) {
    const v = p.get(key);
    if (v && list.some((x) => x.name === v)) s[field] = v;
  }
  // Full (9999) is a named choice, not a length — it must survive the clamp.
  const rawRadius = p.get('r');
  if (rawRadius !== null && !styleOwnsRadius(s.style)) {
    s.radius = Number(rawRadius) >= PILL ? PILL : num('r', 0, 24, 6);
  }
  for (const [key, list, field] of [
    ['fs', FONTS, 'fontSans'],
    ['fh', FONTS, 'fontHeading'],
    ['fm', MONO_FONTS, 'fontMono'],
  ] as const) {
    const v = p.get(key);
    if (v && list.some((x) => x.name === v)) s[field] = v;
  }
  return s;
}
