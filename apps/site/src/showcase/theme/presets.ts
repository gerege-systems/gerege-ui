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
    name: 'zinc',
    label: 'Zinc',
    hint: 'Neutral, almost hueless',
    swatch: 'hsl(240 5% 88%)',
    tokens: { light: {} },
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
    tokens: { light: {} },
  },
];

export function findPreset(list: NamedPreset[], name: string): NamedPreset {
  return list.find((p) => p.name === name) ?? list[0];
}
