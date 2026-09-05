import { describe, expect, it } from 'vitest';
import { brandPresets } from '@/components/ui/DesignSystemProvider';
import { ACCENT_PAIRS } from '@/lib/accent-pairs';
import {
  ACCENT_PRESETS,
  DEFAULT_STATE,
  PILL,
  accentContrast,
  decodeState,
  deriveTokens,
  encodeState,
  fullRadius,
  generateCss,
  hexToOklch,
  libraryAccent,
  oklchToHex,
  previewTokens,
  radiusScale,
  type ThemeState,
} from '../editor-model';
import { BASE_COLORS, STYLES } from '../presets';

const withAccent = (p: { l: number; c: number; h: number }): ThemeState => ({
  ...DEFAULT_STATE,
  lightness: p.l,
  chroma: p.c,
  hue: p.h,
});

describe('accent maths', () => {
  it('opens on the library accent and round-trips through hex', () => {
    const { lightness: l, chroma: c, hue: h } = DEFAULT_STATE;
    expect(oklchToHex(l, c, h)).toBe('#3e43bb'); // theme.css --accent
    expect(hexToOklch('#3e43bb')).toEqual([l, c, h]);
    expect(hexToOklch('#3e4')).toBeNull();
    expect(deriveTokens(DEFAULT_STATE)).toEqual({ light: {}, dark: {} });
  });

  it('every named accent passes the library accent pairs in both modes', () => {
    expect(accentContrast(DEFAULT_STATE, 'light').checks.map((c) => c.key)).toEqual(
      ACCENT_PAIRS.map((p) => p.key),
    );
    for (const p of ACCENT_PRESETS) {
      for (const mode of ['light', 'dark'] as const) {
        const r = accentContrast(withAccent(p), mode);
        expect(r.passes, `${p.name} ${mode}: ${JSON.stringify(r)}`).toBe(true);
      }
    }
  });

  it('the library presets carry the library numbers', () => {
    for (const p of ACCENT_PRESETS) {
      if (!p.library || p.library === 'default') continue;
      const s = withAccent(p);
      expect(libraryAccent(s)).toBe(p.library);
      const { light, dark } = deriveTokens(s);
      expect(light.accent).toBe(brandPresets[p.library].light.accent);
      expect(dark.accent).toBe(brandPresets[p.library].dark?.accent);
    }
  });

  it('no derived token is the dead accent-700/800 step', () => {
    const s = withAccent({ l: 0.5, c: 0.15, h: 200 });
    const keys = [...Object.keys(deriveTokens(s).light), ...Object.keys(deriveTokens(s).dark)];
    expect(keys.filter((k) => /accent-[78]00/.test(k))).toEqual([]);
  });
});

describe('radius and styles', () => {
  it('Full survives a shared link; the pill is an attribute, the tokens stay lengths', () => {
    const s = { ...DEFAULT_STATE, radius: PILL };
    expect(decodeState(`#theme${encodeState(s)}`)).toEqual(s);
    // 9999px in a token would round every rounded-md box and every card into
    // a stadium — the pill reaches the controls through data-radius instead.
    const light = deriveTokens(s).light;
    expect(light['radius-md']).toBe('12px');
    expect(light['radius-lg']).toBe('16px');
    expect(Object.values(light).some((v) => v.includes('9999'))).toBe(false);
    expect(fullRadius(s)).toBe(true);
    expect(generateCss(s, null)).toContain('data-radius="full"');
    // Under a shape-owning style the attribute is dropped with the radius.
    expect(fullRadius({ ...s, style: 'lyra' })).toBe(false);
    expect(generateCss({ ...s, style: 'lyra' }, null)).not.toContain('data-radius');
  });

  it('the checkbox radius never reaches a circle', () => {
    // 16px box, 8px corner = a radio. Large used to hand it exactly that.
    for (const base of [4, 6, 10, 24]) expect(radiusScale(base).sm).toBeLessThanOrEqual(4);
    expect(radiusScale(0).sm).toBe(0);
  });

  it('a style that owns its shape drops the radius', () => {
    for (const style of STYLES.filter((x) => x.absoluteRadius).map((x) => x.name)) {
      const s = { ...DEFAULT_STATE, style, radius: 10 };
      expect(deriveTokens(s).light['radius-md']).toBeUndefined();
      expect(decodeState(`#theme?st=${style}&r=10`).radius).toBeNull();
    }
  });

  it('encode/decode is an identity for every field', () => {
    const s: ThemeState = {
      lightness: 0.6,
      chroma: 0.1,
      hue: 200,
      style: 'maia',
      depth: 'deep',
      base: 'stone',
      chart: 'teal',
      radius: 10,
      fontSans: 'inter',
      fontHeading: 'lora',
      fontMono: 'jetbrains-mono',
    };
    expect(decodeState(`#theme${encodeState(s)}`)).toEqual(s);
    expect(decodeState('#theme?h=360').hue).toBe(0);
    expect(decodeState('#theme?r=abc&st=nope').radius).toBe(6);
  });

  it('base colours move the dark ring offset and the tooltip with the family', () => {
    for (const b of BASE_COLORS) {
      if (b.name === 'slate') continue;
      expect(b.tokens.dark?.['ring-offset']).toBe(b.tokens.dark?.background);
      expect(b.tokens.light.tooltip).toBeDefined();
    }
  });
});

describe('generated css', () => {
  it('says nothing changed on the defaults, for both setups', () => {
    expect(generateCss(DEFAULT_STATE, 'tailwind')).toContain('Nothing changed');
    expect(generateCss(DEFAULT_STATE, 'tailwind')).toContain("@import 'tailwindcss'");
    expect(generateCss(DEFAULT_STATE, 'plain')).toContain(
      "@import '@gerege-systems/ui/styles.css'",
    );
    expect(generateCss(DEFAULT_STATE, 'plain')).not.toContain('tailwindcss');
  });

  it('a library accent becomes data-accent, not a token block', () => {
    const violet = ACCENT_PRESETS.find((p) => p.library === 'violet')!;
    const css = generateCss(withAccent(violet), null);
    expect(css).toContain('data-accent="violet"');
    expect(css).not.toContain('--accent');
  });

  it('a custom accent is emitted as tokens in both modes, without dead steps', () => {
    const css = generateCss(withAccent({ l: 0.5, c: 0.15, h: 200 }), null);
    expect(css).toMatch(/:root \{[\s\S]*--accent: oklch/);
    expect(css).toMatch(/\.dark \{[\s\S]*--accent: oklch/);
    expect(css).not.toContain('accent-700');
  });

  it('fonts import first, and the preview re-aliases the heading face', () => {
    const s = { ...DEFAULT_STATE, fontSans: 'inter' };
    const css = generateCss(s, 'tailwind');
    expect(css.startsWith("@import url('https://fonts.googleapis.com/css2?family=Inter")).toBe(
      true,
    );
    expect(deriveTokens(s).light['font-heading']).toBeUndefined();
    expect(previewTokens(s).light['font-heading']).toBe('var(--font-sans)');
    // An explicit heading face wins over the alias.
    expect(previewTokens({ ...s, fontHeading: 'lora' }).light['font-heading']).toContain('Lora');
  });
});
