'use client';

import { forwardRef, useSyncExternalStore, type TimeHTMLAttributes } from 'react';
import { formatDate, type FormatDateOptions } from '@/lib/format';
import { formatString } from '@/lib/strings';
import { useStrings } from '@/hooks/use-strings';
import { cn } from '@/lib/utils';

export interface RelativeTimeProps extends Omit<TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'> {
  /** The instant to describe. */
  date: Date | number | string;
  /**
   * Reference "now". Omitted: the current minute, re-read every minute so the
   * label does not go stale ("1 min ago" stays true). Pass a fixed value for
   * deterministic SSR and tests.
   */
  now?: Date | number;
  /** Options for the absolute `title` (tooltip). */
  absolute?: FormatDateOptions;
}

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/**
 * One shared minute ticker for every mounted RelativeTime. The snapshot is the
 * current minute (not the millisecond) so it is referentially stable between
 * renders, and so server and client agree unless a minute boundary falls
 * between the two — the same granularity the label itself has.
 */
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  timer ??= setInterval(() => listeners.forEach((l) => l()), 30_000);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  };
};
const currentMinute = () => Math.floor(Date.now() / MIN) * MIN;

/**
 * `<time>` showing "5 min ago" with the absolute timestamp as `title` and a
 * machine-readable `dateTime`. Strings come from `UiStrings.relativeTime`.
 * Beyond 30 days it falls back to the absolute date so text never goes stale.
 *
 * @example
 *   <RelativeTime date={post.createdAt} />
 */
export const RelativeTime = forwardRef<HTMLTimeElement, RelativeTimeProps>(function RelativeTime(
  { date, now, absolute, className, ...props },
  ref,
) {
  const strings = useStrings().relativeTime;
  const d = date instanceof Date ? date : new Date(date);
  const tick = useSyncExternalStore(subscribe, currentMinute, currentMinute);
  const ref_ = now === undefined ? tick : now instanceof Date ? now.getTime() : now;
  const diff = d.getTime() - ref_;
  const abs = Math.abs(diff);
  const future = diff > 0;
  const title = formatDate(d, absolute);

  let label: string;
  if (abs < MIN) label = strings.justNow;
  else if (abs < HOUR)
    label = formatString(future ? strings.inMinutes : strings.minutesAgo, {
      n: Math.round(abs / MIN),
    });
  else if (abs < DAY)
    label = formatString(future ? strings.inHours : strings.hoursAgo, {
      n: Math.round(abs / HOUR),
    });
  else if (abs < 30 * DAY)
    label = formatString(future ? strings.inDays : strings.daysAgo, { n: Math.round(abs / DAY) });
  else label = title;

  return (
    <time
      data-slot="relative-time"
      ref={ref}
      dateTime={Number.isNaN(d.getTime()) ? undefined : d.toISOString()}
      title={title}
      className={cn('tabular', className)}
      {...props}
    >
      {label}
    </time>
  );
});
RelativeTime.displayName = 'RelativeTime';
