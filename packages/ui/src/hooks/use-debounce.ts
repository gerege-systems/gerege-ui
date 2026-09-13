'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Returns `value` after it has stopped changing for `delay` ms. Use for
 * search inputs that drive a query (URL or fetch) without firing per keystroke.
 *
 * @example
 *   const [q, setQ] = useState('');
 *   const debouncedQ = useDebounce(q); // 300ms
 *   useEffect(() => { fetchRows(debouncedQ); }, [debouncedQ]);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    if (delay <= 0) return;
    const t = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  // No delay: the value is the answer, no state round-trip needed.
  return delay <= 0 ? value : debounced;
}

/**
 * Stable callback that runs `fn` once `delay` ms have passed since the last
 * call. Always invokes the latest `fn`; pending calls are dropped on unmount.
 *
 * @example
 *   const save = useDebouncedCallback((draft: string) => api.save(draft), 500);
 *   <Textarea onChange={(e) => save(e.target.value)} />
 */
export function useDebouncedCallback<A extends unknown[]>(
  fn: (...args: A) => void,
  delay = 300,
): (...args: A) => void {
  const fnRef = useRef(fn);
  const timer = useRef<number | null>(null);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );
  return useCallback(
    (...args: A) => {
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        timer.current = null;
        fnRef.current(...args);
      }, delay);
    },
    [delay],
  );
}
