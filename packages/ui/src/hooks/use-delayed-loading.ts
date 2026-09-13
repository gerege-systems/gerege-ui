'use client';

import { useEffect, useRef, useState } from 'react';

export interface DelayedLoadingOptions {
  /**
   * Once `true`, the value holds for at least this many ms even if `ms`
   * changes, so a placeholder that did appear never flickers away. Default 500.
   */
  minVisible?: number;
}

/**
 * Returns `false` until `ms` has elapsed, then `true`. Gate skeletons and
 * spinners behind it so sub-300ms loads never flash a placeholder.
 * `ms <= 0` returns `true` immediately (and synchronously on first render).
 *
 * Once shown, the value stays `true` for `minVisible` ms (default 500). Keep
 * the gated component mounted for that window on the consumer side too —
 * unmounting it early defeats the hold.
 *
 * @example
 *   const showSkeleton = useDelayedLoading(300);
 *   if (isLoading) return showSkeleton ? <Skeleton /> : null;
 */
export function useDelayedLoading(
  ms: number,
  { minVisible = 500 }: DelayedLoadingOptions = {},
): boolean {
  const [ready, setReady] = useState(ms <= 0);
  // Set in the effect, never during render (a render must stay pure).
  const shownAt = useRef<number | null>(null);

  useEffect(() => {
    const show = () => {
      shownAt.current = Date.now();
      setReady(true);
    };
    if (ms <= 0) {
      shownAt.current ??= Date.now();
      // `ms` dropped to 0 after mount: show now. The initial value is already
      // derived in useState, so this only runs on a change.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- timer-driven state, no render-time equivalent
      setReady(true);
      return;
    }
    // Respect the minimum-visible window before hiding again.
    const hold =
      shownAt.current === null ? 0 : Math.max(0, minVisible - (Date.now() - shownAt.current));
    const timers: number[] = [];
    if (hold > 0) {
      timers.push(window.setTimeout(() => setReady(false), hold));
    } else {
      // `ms` changed while already shown and the hold has elapsed: hide now.
      setReady(false);
    }
    timers.push(window.setTimeout(show, hold + ms));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [ms, minVisible]);

  return ready;
}
