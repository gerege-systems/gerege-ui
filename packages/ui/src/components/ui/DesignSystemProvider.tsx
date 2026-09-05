'use client';

import { useId, useMemo, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { StringsContext, useStrings } from '@/hooks/use-strings';
import { mergeStrings, type DeepPartial, type UiStrings } from '@/lib/strings';

/**
 * Per-brand token overrides. Keys are CSS variable names (without the `--`
 * prefix); values are CSS values. Any unspecified token falls back to the
 * design system default.
 *
 * @example
 *   <DesignSystemProvider tokens={{ accent: '#ff5555', 'radius-md': '10px' }}>
 *     <App />
 *   </DesignSystemProvider>
 *
 * @example Swap in one of the built-in accent presets
 *   <DesignSystemProvider tokens={brandPresets.violet}>
 *     <Card>...</Card>
 *   </DesignSystemProvider>
 */
export type BrandTokens = Record<string, string>;

/**
 * Mode-aware token overrides: `light` applies always, `dark` wins under the
 * `.dark` class (on `<html>` or any ancestor). Use this for anything with a
 * different value per mode — accent, subtle surfaces, ring.
 */
export interface BrandTokenPair {
  light: BrandTokens;
  dark?: BrandTokens;
}

function isPair(t: BrandTokens | BrandTokenPair): t is BrandTokenPair {
  return 'light' in t && typeof t.light === 'object';
}

function toDeclarations(tokens: BrandTokens): string {
  return Object.entries(tokens)
    .map(([k, v]) => `${k.startsWith('--') ? k : `--${k}`}:${v}`)
    .join(';');
}

export interface DesignSystemProviderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Token overrides (CSS variable name → value). A flat record applies in both
   * modes; a `{ light, dark }` pair applies `dark` under `.dark`.
   */
  tokens?: BrandTokens | BrandTokenPair;
  /**
   * Override any of the library's built-in UI strings (aria-labels,
   * placeholders, empty states). Partial — merged over the parent provider /
   * English defaults. Pass `mnStrings` for Mongolian.
   */
  strings?: DeepPartial<UiStrings>;
  /** Children to scope this brand to. */
  children: ReactNode;
}

export function DesignSystemProvider({
  tokens,
  strings,
  className,
  children,
  style,
  ...props
}: DesignSystemProviderProps) {
  // Build the inline style from tokens — wrapping every key with `--` so
  // consumers can pass either `accent` or `color-accent` without remembering
  // the prefix dance.
  const parentStrings = useStrings();
  const resolvedStrings = useMemo(
    () => mergeStrings(parentStrings, strings),
    [parentStrings, strings],
  );
  const scopeId = useId();
  const css: CSSProperties = { ...style };
  let sheet: string | null = null;
  if (tokens) {
    if (isPair(tokens)) {
      // Mode-aware tokens cannot be inline (inline beats `.dark` rules), so
      // they go through a scoped <style>: light on the scope, dark under .dark.
      const scope = `[data-brand-scope="${scopeId}"]`;
      sheet = `${scope}{${toDeclarations(tokens.light)}}`;
      if (tokens.dark) {
        sheet += `.dark ${scope},.dark${scope}{${toDeclarations(tokens.dark)}}`;
      }
    } else {
      for (const [k, v] of Object.entries(tokens)) {
        const key = k.startsWith('--') ? k : `--${k}`;
        (css as Record<string, string>)[key] = v;
      }
    }
  }

  return (
    <StringsContext.Provider value={resolvedStrings}>
      {sheet && <style data-brand-scope-style={scopeId}>{sheet}</style>}
      <div data-brand-scope={scopeId} className={cn('contents', className)} style={css} {...props}>
        {children}
      </div>
    </StringsContext.Provider>
  );
}

/**
 * Built-in accent presets — swap the system's single accent colour without
 * touching anything else.
 *
 * These override the *semantic* tokens the utilities resolve to. theme.css
 * maps the accent utilities with `@theme inline` (e.g. `bg-accent` →
 * `var(--accent)`, `bg-accent-soft` → `var(--accent-subtle)`), so the override
 * must target `--accent` / `--accent-subtle` / `--accent-subtle-foreground` /
 * `--ring` — NOT `--color-accent` (which `inline` never emits). Hover and
 * active derive from `--accent` in theme.css, so a preset never sets them.
 * Values mirror the `[data-accent]` presets in theme.css: the
 * dark half lifts the accent to the 400 step (readable as text on neutral-950)
 * and darkens the subtle surface. `default` is the built-in graphite-indigo.
 */
export const brandPresets = {
  /** The library default — graphite indigo. */
  default: { light: {} } as BrandTokenPair,
  /** Blue. */
  blue: {
    light: {
      accent: 'oklch(0.55 0.16 250)',
      'accent-subtle': 'oklch(0.96 0.03 250)',
      'accent-subtle-foreground': 'oklch(0.45 0.15 250)',
      ring: 'oklch(0.62 0.16 250)',
    },
    dark: {
      accent: 'oklch(0.64 0.15 250)',
      'accent-subtle': 'oklch(0.24 0.06 250)',
      'accent-subtle-foreground': 'oklch(0.82 0.1 250)',
      ring: 'oklch(0.68 0.15 250)',
    },
  },
  /** Violet. */
  violet: {
    light: {
      accent: 'oklch(0.53 0.20 295)',
      'accent-subtle': 'oklch(0.96 0.03 295)',
      'accent-subtle-foreground': 'oklch(0.46 0.18 295)',
      ring: 'oklch(0.60 0.20 295)',
    },
    dark: {
      accent: 'oklch(0.64 0.18 295)',
      'accent-subtle': 'oklch(0.25 0.07 295)',
      'accent-subtle-foreground': 'oklch(0.83 0.12 295)',
      ring: 'oklch(0.68 0.18 295)',
    },
  },
  /** Emerald. */
  emerald: {
    light: {
      accent: 'oklch(0.55 0.13 160)',
      'accent-subtle': 'oklch(0.96 0.03 160)',
      'accent-subtle-foreground': 'oklch(0.42 0.12 160)',
      ring: 'oklch(0.60 0.13 160)',
    },
    dark: {
      accent: 'oklch(0.64 0.14 160)',
      'accent-subtle': 'oklch(0.23 0.05 160)',
      'accent-subtle-foreground': 'oklch(0.8 0.12 160)',
      ring: 'oklch(0.68 0.14 160)',
    },
  },
  /** Rose. */
  rose: {
    light: {
      accent: 'oklch(0.57 0.19 12)',
      'accent-subtle': 'oklch(0.96 0.03 12)',
      'accent-subtle-foreground': 'oklch(0.48 0.18 12)',
      ring: 'oklch(0.62 0.19 12)',
    },
    dark: {
      accent: 'oklch(0.65 0.18 12)',
      'accent-subtle': 'oklch(0.25 0.07 12)',
      'accent-subtle-foreground': 'oklch(0.83 0.12 12)',
      ring: 'oklch(0.7 0.18 12)',
    },
  },
  /** Amber. */
  amber: {
    light: {
      // 0.56 keeps white text at 4.8:1 (0.62 was 3.8:1).
      accent: 'oklch(0.56 0.14 65)',
      'accent-subtle': 'oklch(0.96 0.04 75)',
      'accent-subtle-foreground': 'oklch(0.48 0.12 65)',
      ring: 'oklch(0.64 0.14 65)', // 3.17:1 on background-muted (0.66 was 2.93)
    },
    dark: {
      accent: 'oklch(0.66 0.14 65)',
      'accent-subtle': 'oklch(0.26 0.05 70)',
      'accent-subtle-foreground': 'oklch(0.85 0.12 80)',
      ring: 'oklch(0.72 0.14 65)',
    },
  },
} satisfies Record<string, BrandTokenPair>;

export type BrandName = keyof typeof brandPresets;
