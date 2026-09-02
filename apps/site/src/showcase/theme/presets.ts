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
  /** Small swatch shown in the trigger and the menu. */
  swatch: string;
  tokens: Bundle;
}

/* ------------------------------------------------------------------ style -- */

/** Radius + type + spacing. The lever that changes the look the most. */
export const STYLES: NamedPreset[] = [
  {
    name: 'nova',
    label: 'Nova',
    hint: 'Library default — 6px radius, 14px base',
    swatch: 'hsl(238 50% 49%)',
    tokens: { light: {} },
  },
  {
    name: 'vega',
    label: 'Vega',
    hint: 'Square and structural — 0px radius, hard borders',
    swatch: 'hsl(215 20% 45%)',
    tokens: {
      light: {
        'radius-sm': '0px',
        'radius-md': '0px',
        'radius-lg': '0px',
        'radius-xl': '0px',
        border: 'hsl(215 20% 80%)',
        'border-strong': 'hsl(215 18% 62%)',
      },
      dark: {
        'radius-sm': '0px',
        'radius-md': '0px',
        'radius-lg': '0px',
        'radius-xl': '0px',
        border: 'hsl(215 20% 28%)',
        'border-strong': 'hsl(215 18% 40%)',
      },
    },
  },
  {
    name: 'maia',
    label: 'Maia',
    hint: 'Soft — 12px radius, light borders',
    swatch: 'hsl(200 45% 55%)',
    tokens: {
      light: {
        'radius-sm': '8px',
        'radius-md': '12px',
        'radius-lg': '16px',
        'radius-xl': '24px',
        border: 'hsl(214 32% 94%)',
        'border-strong': 'hsl(214 30% 88%)',
      },
      dark: {
        'radius-sm': '8px',
        'radius-md': '12px',
        'radius-lg': '16px',
        'radius-xl': '24px',
        border: 'hsl(217 33% 15%)',
        'border-strong': 'hsl(215 25% 24%)',
      },
    },
  },
  {
    name: 'lyra',
    label: 'Lyra',
    hint: 'Pill — controls fully rounded',
    swatch: 'hsl(330 45% 55%)',
    tokens: {
      light: {
        'radius-sm': '9999px',
        'radius-md': '9999px',
        'radius-lg': '20px',
        'radius-xl': '28px',
      },
    },
  },
  {
    name: 'mira',
    label: 'Mira',
    hint: 'Dense — 13px base, tight spacing (ERP)',
    swatch: 'hsl(160 40% 40%)',
    tokens: {
      light: {
        'radius-sm': '3px',
        'radius-md': '4px',
        'radius-lg': '6px',
        'radius-xl': '8px',
        'text-xs': '0.6875rem',
        'text-sm': '0.75rem',
        'text-base': '0.8125rem',
        'text-lg': '0.9375rem',
        'spacing-3': '0.5rem',
        'spacing-4': '0.75rem',
        'spacing-6': '1rem',
      },
    },
  },
  {
    name: 'luma',
    label: 'Luma',
    hint: 'Airy — 15px base, wide spacing',
    swatch: 'hsl(45 70% 50%)',
    tokens: {
      light: {
        'radius-sm': '8px',
        'radius-md': '10px',
        'radius-lg': '14px',
        'radius-xl': '20px',
        'text-sm': '0.875rem',
        'text-base': '0.9375rem',
        'text-lg': '1.0625rem',
        'spacing-3': '1rem',
        'spacing-4': '1.25rem',
        'spacing-6': '2rem',
      },
    },
  },
  {
    name: 'sera',
    label: 'Sera',
    hint: 'High contrast — for hard viewing conditions',
    swatch: 'hsl(222 47% 11%)',
    tokens: {
      light: {
        'radius-sm': '3px',
        'radius-md': '4px',
        'radius-lg': '6px',
        'radius-xl': '10px',
        foreground: 'hsl(222 60% 6%)',
        'foreground-muted': 'hsl(215 30% 22%)',
        'foreground-subtle': 'hsl(215 25% 32%)',
        border: 'hsl(215 25% 68%)',
        'border-strong': 'hsl(215 25% 45%)',
        'border-input': 'hsl(215 25% 40%)',
      },
      dark: {
        foreground: 'hsl(0 0% 100%)',
        'foreground-muted': 'hsl(210 30% 92%)',
        'foreground-subtle': 'hsl(210 25% 80%)',
        border: 'hsl(215 20% 35%)',
        'border-strong': 'hsl(215 20% 52%)',
        'border-input': 'hsl(215 20% 58%)',
      },
    },
  },
  {
    name: 'rhea',
    label: 'Rhea',
    hint: 'Quiet — light borders, softer text',
    swatch: 'hsl(215 16% 70%)',
    tokens: {
      light: {
        'radius-sm': '6px',
        'radius-md': '8px',
        'radius-lg': '10px',
        'radius-xl': '14px',
        foreground: 'hsl(222 22% 20%)',
        'foreground-muted': 'hsl(215 14% 42%)',
        'foreground-subtle': 'hsl(215 12% 52%)',
        border: 'hsl(214 25% 93%)',
        'border-strong': 'hsl(214 22% 87%)',
      },
      dark: {
        foreground: 'hsl(210 25% 92%)',
        'foreground-muted': 'hsl(213 18% 76%)',
        'foreground-subtle': 'hsl(215 14% 60%)',
        border: 'hsl(217 25% 15%)',
        'border-strong': 'hsl(215 20% 23%)',
      },
    },
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
    name: 'zinc',
    label: 'Zinc',
    hint: 'Neutral, almost hueless',
    swatch: 'hsl(240 5% 88%)',
    tokens: {
      light: {
        'background-subtle': 'hsl(240 5% 98%)',
        'background-muted': 'hsl(240 5% 96%)',
        border: 'hsl(240 6% 90%)',
        'border-strong': 'hsl(240 5% 84%)',
        'border-input': 'hsl(240 4% 55%)',
        'surface-hover': 'hsl(240 6% 90%)',
        'surface-active': 'hsl(240 5% 84%)',
        'foreground-muted': 'hsl(240 4% 34%)',
        'foreground-subtle': 'hsl(240 4% 46%)',
      },
      dark: {
        background: 'hsl(240 6% 7%)',
        'background-subtle': 'hsl(240 6% 10%)',
        'background-muted': 'hsl(240 5% 14%)',
        card: 'hsl(240 6% 11%)',
        popover: 'hsl(240 6% 11%)',
        border: 'hsl(240 5% 18%)',
        'border-strong': 'hsl(240 5% 27%)',
        'border-input': 'hsl(240 4% 45%)',
        'surface-hover': 'hsl(240 5% 18%)',
        'surface-active': 'hsl(240 5% 27%)',
      },
    },
  },
  {
    name: 'stone',
    label: 'Stone',
    hint: 'Warm grey',
    swatch: 'hsl(30 18% 88%)',
    tokens: {
      light: {
        'background-subtle': 'hsl(30 20% 98%)',
        'background-muted': 'hsl(30 18% 96%)',
        border: 'hsl(30 14% 90%)',
        'border-strong': 'hsl(30 12% 84%)',
        'border-input': 'hsl(30 8% 55%)',
        'surface-hover': 'hsl(30 14% 90%)',
        'surface-active': 'hsl(30 12% 84%)',
        'foreground-muted': 'hsl(28 10% 32%)',
        'foreground-subtle': 'hsl(28 8% 45%)',
      },
      dark: {
        background: 'hsl(24 10% 7%)',
        'background-subtle': 'hsl(24 9% 10%)',
        'background-muted': 'hsl(24 8% 14%)',
        card: 'hsl(24 9% 11%)',
        popover: 'hsl(24 9% 11%)',
        border: 'hsl(24 8% 18%)',
        'border-strong': 'hsl(24 7% 27%)',
        'border-input': 'hsl(24 6% 45%)',
        'surface-hover': 'hsl(24 8% 18%)',
        'surface-active': 'hsl(24 7% 27%)',
      },
    },
  },
  {
    name: 'sage',
    label: 'Sage',
    hint: 'Grey with a green cast',
    swatch: 'hsl(150 12% 88%)',
    tokens: {
      light: {
        'background-subtle': 'hsl(150 20% 98%)',
        'background-muted': 'hsl(150 16% 95%)',
        border: 'hsl(150 14% 89%)',
        'border-strong': 'hsl(150 12% 82%)',
        'border-input': 'hsl(150 8% 52%)',
        'surface-hover': 'hsl(150 14% 89%)',
        'surface-active': 'hsl(150 12% 82%)',
        'foreground-muted': 'hsl(155 12% 30%)',
        'foreground-subtle': 'hsl(155 10% 42%)',
      },
      dark: {
        background: 'hsl(155 14% 6%)',
        'background-subtle': 'hsl(155 12% 9%)',
        'background-muted': 'hsl(155 10% 13%)',
        card: 'hsl(155 12% 10%)',
        popover: 'hsl(155 12% 10%)',
        border: 'hsl(155 10% 17%)',
        'border-strong': 'hsl(155 9% 26%)',
        'border-input': 'hsl(155 8% 44%)',
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
    name: 'ocean',
    label: 'Ocean',
    hint: 'Cool — blue through teal',
    swatch: 'hsl(196 70% 42%)',
    tokens: {
      light: {
        'chart-1': 'hsl(196 70% 40%)',
        'chart-2': 'hsl(174 62% 32%)',
        'chart-3': 'hsl(212 68% 48%)',
        'chart-4': 'hsl(160 55% 34%)',
        'chart-5': 'hsl(226 45% 52%)',
        'chart-6': 'hsl(186 60% 30%)',
      },
      dark: {
        'chart-1': 'hsl(196 75% 62%)',
        'chart-2': 'hsl(174 60% 55%)',
        'chart-3': 'hsl(212 78% 68%)',
        'chart-4': 'hsl(160 55% 58%)',
        'chart-5': 'hsl(226 60% 72%)',
        'chart-6': 'hsl(186 60% 52%)',
      },
    },
  },
  {
    name: 'sunset',
    label: 'Sunset',
    hint: 'Warm — amber through red',
    swatch: 'hsl(24 80% 45%)',
    tokens: {
      light: {
        'chart-1': 'hsl(24 80% 42%)',
        'chart-2': 'hsl(0 68% 46%)',
        'chart-3': 'hsl(42 88% 38%)',
        'chart-4': 'hsl(340 60% 46%)',
        'chart-5': 'hsl(12 70% 38%)',
        'chart-6': 'hsl(58 70% 32%)',
      },
      dark: {
        'chart-1': 'hsl(24 88% 64%)',
        'chart-2': 'hsl(0 78% 68%)',
        'chart-3': 'hsl(42 92% 60%)',
        'chart-4': 'hsl(340 72% 68%)',
        'chart-5': 'hsl(12 80% 62%)',
        'chart-6': 'hsl(58 70% 55%)',
      },
    },
  },
  {
    name: 'forest',
    label: 'Forest',
    hint: 'Green — natural tones',
    swatch: 'hsl(150 55% 30%)',
    tokens: {
      light: {
        'chart-1': 'hsl(150 55% 30%)',
        'chart-2': 'hsl(90 45% 32%)',
        'chart-3': 'hsl(174 50% 30%)',
        'chart-4': 'hsl(48 60% 34%)',
        'chart-5': 'hsl(122 35% 36%)',
        'chart-6': 'hsl(200 40% 36%)',
      },
      dark: {
        'chart-1': 'hsl(150 50% 58%)',
        'chart-2': 'hsl(90 45% 58%)',
        'chart-3': 'hsl(174 50% 56%)',
        'chart-4': 'hsl(48 70% 60%)',
        'chart-5': 'hsl(122 35% 62%)',
        'chart-6': 'hsl(200 45% 62%)',
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
