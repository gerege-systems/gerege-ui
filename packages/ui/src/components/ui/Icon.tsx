'use client';

import { lazy, Suspense, useMemo, type LazyExoticComponent, type ReactNode } from 'react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import type { LucideIcon, LucideProps } from 'lucide-react';

/** Every lucide icon name, kebab-case — e.g. `calendar`, `chevrons-up-down`. */
export type IconName = keyof typeof dynamicIconImports;

/** All available icon names (useful for pickers and docs). */
export const iconNames = Object.keys(dynamicIconImports) as IconName[];

// lazy() must return a stable component per name or React remounts (and
// re-suspends) on every render.
const cache = new Map<IconName, LazyExoticComponent<LucideIcon>>();
const warned = new Set<string>();

function getIcon(name: IconName): LazyExoticComponent<LucideIcon> | null {
  const cached = cache.get(name);
  if (cached) return cached;
  const loader = dynamicIconImports[name];
  if (typeof loader !== 'function') {
    // Unknown name (data-driven input) → render nothing, warn once in dev.
    if (process.env.NODE_ENV !== 'production' && !warned.has(name)) {
      warned.add(name);
      console.warn(
        `[@gerege-systems/ui] <Icon name="${name}"> is not a lucide icon; rendering nothing.`,
      );
    }
    return null;
  }
  const created = lazy(loader);
  cache.set(name, created);
  return created;
}

export interface IconProps extends Omit<LucideProps, 'ref'> {
  /** Lucide icon name in kebab-case, e.g. `name="calendar"`. Autocompletes. */
  name: IconName;
  /**
   * Shown while the icon chunk loads (first use only — icons are cached).
   * Defaults to an invisible square so layout doesn't shift.
   */
  fallback?: ReactNode;
}

/**
 * Name-addressed lucide icon. Use when the icon is dynamic (data-driven
 * nav items, user-configurable dashboards) or when importing components for
 * every icon is friction.
 *
 * Each icon is code-split and loaded on first use, so referencing the full
 * lucide set costs nothing up front — `<Icon name="rocket" />` ships only
 * the rocket.
 *
 * @example
 *   <Icon name="calendar" className="size-4" />
 *   <Icon name="chevrons-up-down" size={16} strokeWidth={1.5} />
 *
 * @do Use `size-4` (16px) inline with text, `size-5` (20px) inside buttons.
 * @dont Reach for this in hot lists with hundreds of distinct icons on first
 *       paint — statically imported icons from `Icons` skip the lazy hop.
 */
export function Icon({ name, fallback, ...props }: IconProps) {
  const LucideIcon = useMemo(() => getIcon(name), [name]);

  const placeholder = fallback ?? (
    <span
      aria-hidden
      className={props.className}
      style={{ display: 'inline-block', width: props.size ?? '1em', height: props.size ?? '1em' }}
    />
  );

  if (!LucideIcon) return null;

  return (
    <Suspense fallback={placeholder}>
      <LucideIcon {...props} />
    </Suspense>
  );
}
