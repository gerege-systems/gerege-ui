'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from '@/lib/cva';

const badge = cva(
  [
    'inline-flex items-center gap-1 rounded-full px-2 py-0.5',
    'text-xs font-medium whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        subtle: '',
        outline: 'border bg-transparent',
      },
      tone: {
        neutral: '',
        accent: '',
        success: '',
        warning: '',
        danger: '',
        info: '',
      },
    },
    compoundVariants: [
      // Subtle — coloured fill + matching text.
      { variant: 'subtle', tone: 'neutral', class: 'bg-background-muted text-foreground-muted' },
      { variant: 'subtle', tone: 'accent', class: 'bg-accent-soft text-on-accent-soft' },
      { variant: 'subtle', tone: 'success', class: 'bg-success-soft text-success-text' },
      { variant: 'subtle', tone: 'warning', class: 'bg-warning-soft text-warning-text' },
      { variant: 'subtle', tone: 'danger', class: 'bg-danger-soft text-danger-text' },
      { variant: 'subtle', tone: 'info', class: 'bg-info-soft text-info-text' },
      // Outline — coloured border + text, transparent fill.
      { variant: 'outline', tone: 'neutral', class: 'border-border text-foreground-muted' },
      { variant: 'outline', tone: 'accent', class: 'border-accent text-accent' },
      {
        variant: 'outline',
        tone: 'success',
        class: 'border-success-border-soft text-success-text',
      },
      {
        variant: 'outline',
        tone: 'warning',
        class: 'border-warning-border-soft text-warning-text',
      },
      { variant: 'outline', tone: 'danger', class: 'border-danger-border-soft text-danger-text' },
      { variant: 'outline', tone: 'info', class: 'border-info-border-soft text-info-text' },
    ],
    defaultVariants: { variant: 'subtle', tone: 'neutral' },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badge> {
  /** Show a leading status dot in the same tone. */
  dot?: boolean;
  /** Leading icon (decorative — sized 12px, `aria-hidden`). Overrides `dot`. */
  icon?: ReactNode;
}

const dotColour = {
  neutral: 'bg-foreground-subtle',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
} as const;

/**
 * Status pill. Use `subtle` for high-volume contexts (table cells, lists);
 * `outline` when the badge sits on a busy or coloured background.
 *
 * @example
 *   <Badge tone="success" dot>Active</Badge>
 *   <Badge tone="danger" variant="outline">Failed</Badge>
 *
 * @do Use badges to summarise state, not to label categories — for taxonomies
 *      pick a tone palette and stick with it.
 * @dont Use a badge as a button. Wrap it in a Button or use a Toggle.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, tone = 'neutral', dot, icon, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      data-slot="badge"
      className={cn(badge({ variant, tone }), className)}
      {...props}
    >
      {icon && (
        <span aria-hidden className="inline-flex shrink-0 [&_svg]:size-3">
          {icon}
        </span>
      )}
      {dot && !icon && (
        <span
          aria-hidden
          className={cn('inline-block size-1.5 rounded-full', dotColour[tone ?? 'neutral'])}
        />
      )}
      {children}
    </span>
  );
});
Badge.displayName = 'Badge';
