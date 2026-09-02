/**
 * Named preset bundles for the theme editor — the four dropdowns in the rail.
 *
 * Each entry is a plain token bundle so switching one is a whole-look change,
 * not a single hue nudge: a style moves radius, type scale and spacing; a base
 * colour moves every neutral surface and border; a chart palette moves the
 * categorical series. Values are literal because the whole point is that the
 * generated CSS can be pasted into a project that has none of this code.
 */
import type { BrandTokens } from '@/components/ui/DesignSystemProvider';

export interface Bundle {
  light: BrandTokens;
  dark?: BrandTokens;
}

export interface NamedPreset {
  name: string;
  label: string;
  hint: string;
  /**
   * Colour swatch for the colour dropdowns; for Style it is a radius value,
   * drawn as a rounded square — a colour dot there would suggest Style moves
   * colour, which it deliberately does not.
   */
  swatch: string;
  tokens: Bundle;
}

/* ------------------------------------------------------------------ style -- */

/**
 * Shape only — colour belongs to the other three dropdowns.
 *
 * A style is not a token bundle: it is the `data-style` attribute, and the
 * per-component rules in the library's component-styles.css do the work. That
 * is what lets a style change a control's height, border width or letter
 * spacing, none of which any single token can express.
 */
export const STYLES: NamedPreset[] = [
  {
    name: 'nova',
    label: 'Nova',
    hint: 'Library default — 6px radius, 14px base',
    swatch: '6px',
    tokens: { light: {} },
  },
  {
    name: 'vega',
    label: 'Vega',
    hint: 'Square — no radius anywhere',
    swatch: '0px',
    tokens: { light: {} },
  },
  {
    name: 'maia',
    label: 'Maia',
    hint: 'Soft — 12px controls, 16px cards',
    swatch: '12px',
    tokens: { light: {} },
  },
  {
    name: 'lyra',
    label: 'Lyra',
    hint: 'Pill — controls fully rounded',
    swatch: '9999px',
    tokens: { light: {} },
  },
  {
    name: 'mira',
    label: 'Mira',
    hint: 'Dense — 13px base, tight spacing (ERP)',
    swatch: '4px',
    tokens: { light: {} },
  },
  {
    name: 'luma',
    label: 'Luma',
    hint: 'Airy — 15px base, wide spacing',
    swatch: '10px',
    tokens: { light: {} },
  },
  {
    name: 'sera',
    label: 'Sera',
    hint: 'Editorial — bigger headings, normal controls',
    swatch: '6px',
    tokens: { light: {} },
  },
  {
    name: 'rhea',
    label: 'Rhea',
    hint: 'Quiet — smaller labels, 8px radius',
    swatch: '8px',
    tokens: { light: {} },
  },
];

/* ------------------------------------------------------------- base colour -- */

/** The neutral family every surface, border and secondary text is built from. */
export const BASE_COLORS: NamedPreset[] = [
  {
    name: 'slate',
    label: 'Slate',
    hint: 'Library default — cool grey',
    swatch: 'hsl(210 40% 90%)',
    tokens: { light: {} },
  },
  {
    name: 'gray',
    label: 'Gray',
    hint: 'Barely cool',
    swatch: 'hsl(220 9% 88%)',
    tokens: {
      light: {
        'background-subtle': 'hsl(220 9% 98%)',
        'background-muted': 'hsl(220 9% 96%)',
        border: 'hsl(220 9% 90%)',
        'border-strong': 'hsl(220 9% 84%)',
        'border-input': 'hsl(220 8% 55%)',
        'surface-hover': 'hsl(220 9% 90%)',
        'surface-active': 'hsl(220 9% 84%)',
        'foreground-muted': 'hsl(220 8% 32%)',
        'foreground-subtle': 'hsl(220 8% 45%)',
      },
      dark: {
        background: 'hsl(220 9% 7%)',
        'background-subtle': 'hsl(220 9% 10%)',
        'background-muted': 'hsl(220 9% 14%)',
        card: 'hsl(220 9% 11%)',
        popover: 'hsl(220 9% 11%)',
        border: 'hsl(220 9% 18%)',
        'border-strong': 'hsl(220 9% 27%)',
        'border-input': 'hsl(220 8% 45%)',
        'surface-hover': 'hsl(220 9% 18%)',
        'surface-active': 'hsl(220 9% 27%)',
      },
    },
  },
  {
    name: 'zinc',
    label: 'Zinc',
    hint: 'Neutral, almost hueless',
    swatch: 'hsl(240 5% 88%)',
    tokens: {
      light: {
        'background-subtle': 'hsl(240 5% 98%)',
        'background-muted': 'hsl(240 5% 96%)',
        border: 'hsl(240 5% 90%)',
        'border-strong': 'hsl(240 5% 84%)',
        'border-input': 'hsl(240 4% 55%)',
        'surface-hover': 'hsl(240 5% 90%)',
        'surface-active': 'hsl(240 5% 84%)',
        'foreground-muted': 'hsl(240 4% 32%)',
        'foreground-subtle': 'hsl(240 4% 45%)',
      },
      dark: {
        background: 'hsl(240 5% 7%)',
        'background-subtle': 'hsl(240 5% 10%)',
        'background-muted': 'hsl(240 5% 14%)',
        card: 'hsl(240 5% 11%)',
        popover: 'hsl(240 5% 11%)',
        border: 'hsl(240 5% 18%)',
        'border-strong': 'hsl(240 5% 27%)',
        'border-input': 'hsl(240 4% 45%)',
        'surface-hover': 'hsl(240 5% 18%)',
        'surface-active': 'hsl(240 5% 27%)',
      },
    },
  },
  {
    name: 'neutral',
    label: 'Neutral',
    hint: 'No hue at all',
    swatch: 'hsl(0 0% 88%)',
    tokens: {
      light: {
        'background-subtle': 'hsl(0 0% 98%)',
        'background-muted': 'hsl(0 0% 96%)',
        border: 'hsl(0 0% 90%)',
        'border-strong': 'hsl(0 0% 84%)',
        'border-input': 'hsl(0 2% 55%)',
        'surface-hover': 'hsl(0 0% 90%)',
        'surface-active': 'hsl(0 0% 84%)',
        'foreground-muted': 'hsl(0 3% 32%)',
        'foreground-subtle': 'hsl(0 3% 45%)',
      },
      dark: {
        background: 'hsl(0 0% 7%)',
        'background-subtle': 'hsl(0 0% 10%)',
        'background-muted': 'hsl(0 0% 14%)',
        card: 'hsl(0 0% 11%)',
        popover: 'hsl(0 0% 11%)',
        border: 'hsl(0 0% 18%)',
        'border-strong': 'hsl(0 0% 27%)',
        'border-input': 'hsl(0 2% 45%)',
        'surface-hover': 'hsl(0 0% 18%)',
        'surface-active': 'hsl(0 0% 27%)',
      },
    },
  },
  {
    name: 'stone',
    label: 'Stone',
    hint: 'Warm grey',
    swatch: 'hsl(30 8% 88%)',
    tokens: {
      light: {
        'background-subtle': 'hsl(30 8% 98%)',
        'background-muted': 'hsl(30 8% 96%)',
        border: 'hsl(30 8% 90%)',
        'border-strong': 'hsl(30 8% 84%)',
        'border-input': 'hsl(30 7% 55%)',
        'surface-hover': 'hsl(30 8% 90%)',
        'surface-active': 'hsl(30 8% 84%)',
        'foreground-muted': 'hsl(30 7% 32%)',
        'foreground-subtle': 'hsl(30 7% 45%)',
      },
      dark: {
        background: 'hsl(30 8% 7%)',
        'background-subtle': 'hsl(30 8% 10%)',
        'background-muted': 'hsl(30 8% 14%)',
        card: 'hsl(30 8% 11%)',
        popover: 'hsl(30 8% 11%)',
        border: 'hsl(30 8% 18%)',
        'border-strong': 'hsl(30 8% 27%)',
        'border-input': 'hsl(30 7% 45%)',
        'surface-hover': 'hsl(30 8% 18%)',
        'surface-active': 'hsl(30 8% 27%)',
      },
    },
  },
];

/* ------------------------------------------------------------ chart colour -- */

/**
 * The categorical series palette. Kept independent of the accent on purpose
 * (design-research 12-data-viz): a series that renders in the accent reads as
 * interactive. Every palette here keeps that separation.
 */
export const CHART_PALETTES: NamedPreset[] = [
  {
    name: 'default',
    label: 'Default',
    hint: 'The library’s six categorical colours',
    swatch: 'hsl(217 70% 50%)',
    tokens: { light: {} },
  },
  {
    name: 'blue',
    label: 'Blue',
    hint: 'One hue family, cool',
    swatch: 'hsl(220 70% 45%)',
    tokens: {
      light: {
        'chart-1': 'oklch(0.55 0.150 250)',
        'chart-2': 'oklch(0.53 0.138 235)',
        'chart-3': 'oklch(0.51 0.126 220)',
        'chart-4': 'oklch(0.49 0.114 205)',
        'chart-5': 'oklch(0.47 0.102 265)',
        'chart-6': 'oklch(0.45 0.090 195)',
      },
      dark: {
        'chart-1': 'oklch(0.72 0.140 250)',
        'chart-2': 'oklch(0.69 0.130 235)',
        'chart-3': 'oklch(0.66 0.120 220)',
        'chart-4': 'oklch(0.63 0.110 205)',
        'chart-5': 'oklch(0.60 0.100 265)',
        'chart-6': 'oklch(0.57 0.090 195)',
      },
    },
  },
  {
    name: 'green',
    label: 'Green',
    hint: 'One hue family, natural',
    swatch: 'hsl(150 55% 32%)',
    tokens: {
      light: {
        'chart-1': 'oklch(0.55 0.150 148)',
        'chart-2': 'oklch(0.53 0.138 160)',
        'chart-3': 'oklch(0.51 0.126 130)',
        'chart-4': 'oklch(0.49 0.114 175)',
        'chart-5': 'oklch(0.47 0.102 110)',
        'chart-6': 'oklch(0.45 0.090 190)',
      },
      dark: {
        'chart-1': 'oklch(0.72 0.140 148)',
        'chart-2': 'oklch(0.69 0.130 160)',
        'chart-3': 'oklch(0.66 0.120 130)',
        'chart-4': 'oklch(0.63 0.110 175)',
        'chart-5': 'oklch(0.60 0.100 110)',
        'chart-6': 'oklch(0.57 0.090 190)',
      },
    },
  },
  {
    name: 'amber',
    label: 'Amber',
    hint: 'Warm, yellow through orange',
    swatch: 'hsl(40 80% 45%)',
    tokens: {
      light: {
        'chart-1': 'oklch(0.55 0.150 70)',
        'chart-2': 'oklch(0.53 0.138 55)',
        'chart-3': 'oklch(0.51 0.126 85)',
        'chart-4': 'oklch(0.49 0.114 40)',
        'chart-5': 'oklch(0.47 0.102 100)',
        'chart-6': 'oklch(0.45 0.090 30)',
      },
      dark: {
        'chart-1': 'oklch(0.72 0.140 70)',
        'chart-2': 'oklch(0.69 0.130 55)',
        'chart-3': 'oklch(0.66 0.120 85)',
        'chart-4': 'oklch(0.63 0.110 40)',
        'chart-5': 'oklch(0.60 0.100 100)',
        'chart-6': 'oklch(0.57 0.090 30)',
      },
    },
  },
  {
    name: 'rose',
    label: 'Rose',
    hint: 'Warm, red through pink',
    swatch: 'hsl(350 65% 48%)',
    tokens: {
      light: {
        'chart-1': 'oklch(0.55 0.150 12)',
        'chart-2': 'oklch(0.53 0.138 350)',
        'chart-3': 'oklch(0.51 0.126 30)',
        'chart-4': 'oklch(0.49 0.114 330)',
        'chart-5': 'oklch(0.47 0.102 45)',
        'chart-6': 'oklch(0.45 0.090 310)',
      },
      dark: {
        'chart-1': 'oklch(0.72 0.140 12)',
        'chart-2': 'oklch(0.69 0.130 350)',
        'chart-3': 'oklch(0.66 0.120 30)',
        'chart-4': 'oklch(0.63 0.110 330)',
        'chart-5': 'oklch(0.60 0.100 45)',
        'chart-6': 'oklch(0.57 0.090 310)',
      },
    },
  },
  {
    name: 'violet',
    label: 'Violet',
    hint: 'Cool, blue through magenta',
    swatch: 'hsl(285 55% 50%)',
    tokens: {
      light: {
        'chart-1': 'oklch(0.55 0.150 295)',
        'chart-2': 'oklch(0.53 0.138 275)',
        'chart-3': 'oklch(0.51 0.126 315)',
        'chart-4': 'oklch(0.49 0.114 255)',
        'chart-5': 'oklch(0.47 0.102 330)',
        'chart-6': 'oklch(0.45 0.090 235)',
      },
      dark: {
        'chart-1': 'oklch(0.72 0.140 295)',
        'chart-2': 'oklch(0.69 0.130 275)',
        'chart-3': 'oklch(0.66 0.120 315)',
        'chart-4': 'oklch(0.63 0.110 255)',
        'chart-5': 'oklch(0.60 0.100 330)',
        'chart-6': 'oklch(0.57 0.090 235)',
      },
    },
  },
  {
    name: 'teal',
    label: 'Teal',
    hint: 'Cool green through blue',
    swatch: 'hsl(190 60% 38%)',
    tokens: {
      light: {
        'chart-1': 'oklch(0.55 0.150 190)',
        'chart-2': 'oklch(0.53 0.138 175)',
        'chart-3': 'oklch(0.51 0.126 205)',
        'chart-4': 'oklch(0.49 0.114 160)',
        'chart-5': 'oklch(0.47 0.102 220)',
        'chart-6': 'oklch(0.45 0.090 145)',
      },
      dark: {
        'chart-1': 'oklch(0.72 0.140 190)',
        'chart-2': 'oklch(0.69 0.130 175)',
        'chart-3': 'oklch(0.66 0.120 205)',
        'chart-4': 'oklch(0.63 0.110 160)',
        'chart-5': 'oklch(0.60 0.100 220)',
        'chart-6': 'oklch(0.57 0.090 145)',
      },
    },
  },
  {
    name: 'mono',
    label: 'Mono',
    hint: 'Single hue — safe in print and greyscale',
    swatch: 'hsl(215 16% 47%)',
    tokens: {
      light: {
        'chart-1': 'hsl(215 25% 22%)',
        'chart-2': 'hsl(215 20% 36%)',
        'chart-3': 'hsl(215 16% 50%)',
        'chart-4': 'hsl(215 14% 62%)',
        'chart-5': 'hsl(215 14% 72%)',
        'chart-6': 'hsl(215 14% 82%)',
      },
      dark: {
        'chart-1': 'hsl(210 30% 92%)',
        'chart-2': 'hsl(213 22% 78%)',
        'chart-3': 'hsl(215 18% 64%)',
        'chart-4': 'hsl(215 16% 52%)',
        'chart-5': 'hsl(215 16% 42%)',
        'chart-6': 'hsl(215 16% 32%)',
      },
    },
  },
];

export function findPreset(list: NamedPreset[], name: string): NamedPreset {
  return list.find((p) => p.name === name) ?? list[0];
}
