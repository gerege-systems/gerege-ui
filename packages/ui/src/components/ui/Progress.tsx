'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type SVGProps } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

/* -----------------------------------------------------------------------------
 *  Linear — bar that fills left-to-right.
 *  Circular — SVG ring. Both support determinate (value 0..100) and
 *  indeterminate (`value` omitted) states.
 * --------------------------------------------------------------------------- */

export interface ProgressProps extends Omit<
  ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
  'value'
> {
  /** 0–`max` (default 100). Clamped. Omit for indeterminate. */
  value?: number | null;
  /** Bar height. */
  size?: 'sm' | 'md' | 'lg';
  /** Visual tone. Use `success`/`danger` to colour-code completion state. */
  tone?: 'accent' | 'success' | 'warning' | 'danger';
}

const heightMap = { sm: 'h-1', md: 'h-1.5', lg: 'h-2' } as const;
const fillTone = {
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
} as const;

/**
 * Linear progress bar.
 *
 * @example
 *   <Progress value={uploadPct} aria-label="Upload progress" />
 *   <Progress aria-label="Loading" /> // indeterminate
 *
 * @do Always pair Progress with an `aria-label` describing what is progressing.
 * @dont Use a Progress for an unknown-completion task — use a Spinner.
 */
export const Progress = forwardRef<ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  function Progress({ className, value, max = 100, size = 'md', tone = 'accent', ...props }, ref) {
    const indeterminate = value === undefined || value === null || Number.isNaN(value);
    const safeMax = max > 0 ? max : 100;
    const clamped = indeterminate ? 0 : Math.min(safeMax, Math.max(0, value as number));
    const pct = (clamped / safeMax) * 100;
    return (
      <ProgressPrimitive.Root
        data-slot="progress"
        ref={ref}
        value={indeterminate ? undefined : clamped}
        max={safeMax}
        className={cn(
          'bg-background-muted relative w-full overflow-hidden rounded-full',
          heightMap[size],
          className,
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'h-full w-full flex-1 transition-transform',
            fillTone[tone],
            indeterminate && 'animate-progress-indeterminate origin-left',
          )}
          data-motion-keep={indeterminate ? '' : undefined}
          style={indeterminate ? undefined : { transform: `translateX(-${100 - pct}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = 'Progress';

export interface ProgressCircleProps extends SVGProps<SVGSVGElement> {
  /** 0–100. Omit for indeterminate. */
  value?: number;
  /** `sm` 24 / `md` 36 / `lg` 48, or an explicit pixel size. */
  size?: 'sm' | 'md' | 'lg' | number;
  /** Stroke thickness. */
  thickness?: number;
  /** Visible label for screen readers. */
  'aria-label': string;
  tone?: 'accent' | 'success' | 'warning' | 'danger';
}

const circleSize = { sm: 24, md: 36, lg: 48 } as const;

const circleTone = {
  accent: 'stroke-accent',
  success: 'stroke-success',
  warning: 'stroke-warning',
  danger: 'stroke-danger',
} as const;

/**
 * Circular progress ring. Pairs with a numeric label for percentage-style
 * indicators.
 *
 * @example
 *   <ProgressCircle value={72} aria-label="Storage used" />
 */
export const ProgressCircle = forwardRef<SVGSVGElement, ProgressCircleProps>(
  function ProgressCircle(
    { value, size: sizeProp = 'md', thickness = 3, className, tone = 'accent', ...props },
    ref,
  ) {
    const size = typeof sizeProp === 'number' ? sizeProp : circleSize[sizeProp];
    const isIndeterminate = value === undefined || Number.isNaN(value);
    const clamped = isIndeterminate ? 0 : Math.min(100, Math.max(0, value as number));
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = isIndeterminate ? 0 : circumference - (clamped / 100) * circumference;

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={isIndeterminate ? undefined : clamped}
        data-motion-keep={isIndeterminate ? '' : undefined}
        className={cn('shrink-0', isIndeterminate && 'animate-spin', className)}
        {...props}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={thickness}
          className="stroke-background-muted fill-none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={isIndeterminate ? circumference * 0.7 : offset}
          className={cn(circleTone[tone], 'fill-none transition-[stroke-dashoffset]')}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
    );
  },
);
ProgressCircle.displayName = 'ProgressCircle';
