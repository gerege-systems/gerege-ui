'use client';

import { forwardRef, type HTMLAttributes, type ReactNode, type TimeHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type TimelineProps = HTMLAttributes<HTMLOListElement>;

export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { className, children, ...props },
  ref,
) {
  return (
    <ol
      data-slot="timeline"
      ref={ref}
      className={cn('relative flex flex-col gap-6', className)}
      {...props}
    >
      {children}
    </ol>
  );
});
Timeline.displayName = 'Timeline';

export interface TimelineItemProps extends HTMLAttributes<HTMLLIElement> {
  /** Optional bullet override. Default: small accent dot. */
  bullet?: ReactNode;
  /** Hide the connector line below this item — use for the last item. */
  isLast?: boolean;
}

export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(function TimelineItem(
  { bullet, isLast, className, children, ...props },
  ref,
) {
  return (
    <li
      data-slot="timeline-item"
      ref={ref}
      className={cn('relative flex gap-4 pb-1', className)}
      {...props}
    >
      <div className="relative flex shrink-0 flex-col items-center">
        <div
          data-slot="timeline-bullet"
          className="border-border bg-card text-foreground-muted flex size-6 items-center justify-center rounded-full border"
        >
          {bullet ?? <span className="bg-accent size-2 rounded-full" aria-hidden />}
        </div>
        {!isLast && <span className="bg-border mt-1 w-px flex-1" aria-hidden />}
      </div>
      <div className="min-w-0 flex-1 pb-4">{children}</div>
    </li>
  );
});
TimelineItem.displayName = 'TimelineItem';

export interface TimelineTimeProps extends TimeHTMLAttributes<HTMLTimeElement> {
  /** Machine-readable value (ISO 8601). Defaults to `children` when it is a string. */
  dateTime?: string;
  children: ReactNode;
}

/** Accept only values `Date` can parse — an invalid `dateTime` is worse than none. */
function validDateTime(v: string | undefined): string | undefined {
  if (!v || Number.isNaN(Date.parse(v))) return undefined;
  return v;
}

export function TimelineTime({ className, children, dateTime, ...props }: TimelineTimeProps) {
  return (
    <time
      dateTime={validDateTime(dateTime ?? (typeof children === 'string' ? children : undefined))}
      className={cn('text-foreground-subtle block text-xs', className)}
      {...props}
    >
      {children}
    </time>
  );
}
TimelineTime.displayName = 'TimelineTime';

export function TimelineTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <p className={cn('text-sm font-medium', className)}>{children}</p>;
}
TimelineTitle.displayName = 'TimelineTitle';

export function TimelineDescription({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <p className={cn('text-foreground-muted mt-0.5 text-sm', className)}>{children}</p>;
}
TimelineDescription.displayName = 'TimelineDescription';
