'use client';

import { forwardRef, type SVGProps } from 'react';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';

export interface SpinnerProps extends SVGProps<SVGSVGElement> {
  /** Visual weight. */
  tone?: 'accent' | 'neutral' | 'on-accent';
  /** Pixel size. */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label. Required unless `decorative` is true. */
  label?: string;
  /** Hide from assistive tech (set when a parent already announces busy state). */
  decorative?: boolean;
}

const sizeMap = { sm: 'size-3.5', md: 'size-4', lg: 'size-6' };
const toneMap = {
  accent: 'text-accent',
  neutral: 'text-foreground-subtle',
  'on-accent': 'text-on-accent',
};

/**
 * Small indeterminate progress indicator. Use when the operation duration is
 * unknown and Progress isn't appropriate.
 *
 * @example
 *   <Spinner label="Loading users" />
 *   <Button loading>Saving…</Button>  // uses Spinner internally
 *
 * @do Provide a `label` so the busy state is announced.
 * @dont Use a Spinner for tasks that take 300ms+; use Skeleton instead.
 */
export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(function Spinner(
  { className, tone = 'accent', size = 'md', label, decorative, ...props },
  ref,
) {
  const strings = useStrings();
  return (
    <svg
      data-slot="spinner"
      ref={ref}
      viewBox="0 0 24 24"
      role={decorative ? undefined : 'status'}
      aria-label={decorative ? undefined : (label ?? strings.spinner.loading)}
      aria-hidden={decorative || undefined}
      // Under prefers-reduced-motion theme.css swaps the spin for a slow
      // (1.6s) opacity pulse via this attribute — busy state stays perceivable.
      data-motion-keep=""
      className={cn('animate-spin', sizeMap[size], toneMap[tone], className)}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity={0.2}
        fill="none"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
});
Spinner.displayName = 'Spinner';
