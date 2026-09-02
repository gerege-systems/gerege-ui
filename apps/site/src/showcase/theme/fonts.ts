/**
 * Font choices for the theme editor.
 *
 * `cyrillic` is not decoration: half of these families ship no Cyrillic subset,
 * and a Mongolian product picking one gets fallback glyphs for Өө and Үү — so
 * the rail says which is which rather than letting you find out later.
 *
 * Families are loaded from Google Fonts on demand (see `useFontLoader`); Geist
 * is already in the page, and System loads nothing.
 */
export interface FontChoice {
  name: string;
  label: string;
  /** Google Fonts family name; null for stacks that need no load. */
  google: string | null;
  /** The CSS value the token gets. */
  stack: string;
  cyrillic: boolean;
  mono?: boolean;
}

const SANS_FALLBACK =
  "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const MONO_FALLBACK =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";
const SERIF_FALLBACK = "ui-serif, Georgia, 'Times New Roman', serif";

const sans = (
  name: string,
  label: string,
  google: string | null,
  cyrillic: boolean,
  fallback = SANS_FALLBACK,
): FontChoice => ({
  name,
  label,
  google,
  cyrillic,
  stack: google ? `'${google}', ${fallback}` : fallback,
});

/** Body and heading share one list — a display face is a legitimate body face. */
export const FONTS: FontChoice[] = [
  sans('geist', 'Geist', 'Geist', true),
  sans('inter', 'Inter', 'Inter', true),
  sans('noto-sans', 'Noto Sans', 'Noto Sans', true),
  sans('nunito-sans', 'Nunito Sans', 'Nunito Sans', true),
  sans('figtree', 'Figtree', 'Figtree', false),
  sans('manrope', 'Manrope', 'Manrope', true),
  sans('onest', 'Onest', 'Onest', true),
  sans('rubik', 'Rubik', 'Rubik', true),
  sans('outfit', 'Outfit', 'Outfit', false),
  sans('dm-sans', 'DM Sans', 'DM Sans', false),
  sans('source-serif', 'Source Serif 4', 'Source Serif 4', true, SERIF_FALLBACK),
  sans('lora', 'Lora', 'Lora', true, SERIF_FALLBACK),
  sans('system', 'System', null, true),
];

export const MONO_FONTS: FontChoice[] = [
  {
    name: 'geist-mono',
    label: 'Geist Mono',
    google: 'Geist Mono',
    cyrillic: true,
    mono: true,
    stack: `'Geist Mono', ${MONO_FALLBACK}`,
  },
  {
    name: 'jetbrains-mono',
    label: 'JetBrains Mono',
    google: 'JetBrains Mono',
    cyrillic: true,
    mono: true,
    stack: `'JetBrains Mono', ${MONO_FALLBACK}`,
  },
  {
    name: 'ibm-plex-mono',
    label: 'IBM Plex Mono',
    google: 'IBM Plex Mono',
    cyrillic: true,
    mono: true,
    stack: `'IBM Plex Mono', ${MONO_FALLBACK}`,
  },
  {
    name: 'space-mono',
    label: 'Space Mono',
    google: 'Space Mono',
    cyrillic: false,
    mono: true,
    stack: `'Space Mono', ${MONO_FALLBACK}`,
  },
  {
    name: 'system-mono',
    label: 'System',
    google: null,
    cyrillic: true,
    mono: true,
    stack: MONO_FALLBACK,
  },
];

export function findFont(list: FontChoice[], name: string): FontChoice {
  return list.find((f) => f.name === name) ?? list[0];
}

/** The families a theme needs, as one Google Fonts URL — or null if none do. */
export function googleFontsUrl(names: (string | null)[]): string | null {
  const families = [...new Set(names.filter((n): n is string => Boolean(n)))];
  if (!families.length) return null;
  const q = families.map((f) => `family=${f.replace(/ /g, '+')}:wght@400;500;600`).join('&');
  return `https://fonts.googleapis.com/css2?${q}&display=swap`;
}
