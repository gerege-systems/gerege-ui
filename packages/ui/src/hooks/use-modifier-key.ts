'use client';

import { useSyncExternalStore } from 'react';

/** True on macOS / iOS / iPadOS, where the command modifier is ⌘. */
export function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? '';
  return /mac|iphone|ipad|ipod/i.test(platform) || /Mac OS X/i.test(nav.userAgent ?? '');
}

export interface ModifierKey {
  /** Glyph for `<Kbd>`: `⌘` on Apple platforms, `Ctrl` elsewhere. */
  symbol: '⌘' | 'Ctrl';
  /** Spoken/long form for aria-labels and tooltips: `Cmd` / `Ctrl`. */
  label: 'Cmd' | 'Ctrl';
}

/**
 * Platform-correct command modifier for shortcut hints (⌘K vs Ctrl K).
 * Defaults to Ctrl until mounted so server output is deterministic.
 */
const noop = () => () => {};
const APPLE: ModifierKey = { symbol: '⌘', label: 'Cmd' };
const OTHER: ModifierKey = { symbol: 'Ctrl', label: 'Ctrl' };

export function useModifierKey(): ModifierKey {
  // The platform never changes; useSyncExternalStore gives the server snapshot
  // (Ctrl) on the server and during hydration, then the real one — without an
  // effect that sets state.
  const apple = useSyncExternalStore(noop, isApplePlatform, () => false);
  return apple ? APPLE : OTHER;
}
