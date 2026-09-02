'use client';

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Loader2 } from '@/icons';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from '@/lib/cva';

/* -----------------------------------------------------------------------------
 *  Variants — the entire visual surface of the Button.
 *
 *  All sizes share the same border radius (md = 6px) per the refined-minimal
 *  rules. Focus state is the standardised 2px-ring + 2px-offset on every
 *  variant, including `link`.
 * --------------------------------------------------------------------------- */
const button = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-md text-sm font-medium',
    'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
    'outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
    // Loading keeps focus (no `disabled`) but blocks interaction.
    'aria-busy:pointer-events-none',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: ['bg-accent text-on-accent', 'hover:bg-accent-hover', 'active:bg-accent-active'],
        secondary: [
          'bg-background-muted text-foreground border border-border-input',
          'hover:bg-surface-hover',
          'active:bg-surface-active',
        ],
        outline: [
          'border border-border-input bg-transparent text-foreground',
          'hover:bg-background-muted',
          'active:bg-background-subtle',
        ],
        ghost: [
          'bg-transparent text-foreground',
          'hover:bg-background-muted',
          'active:bg-background-subtle',
        ],
        destructive: [
          'bg-danger text-on-danger',
          'hover:bg-danger-hover',
          'active:bg-danger-active',
        ],
        link: [
          'bg-transparent text-accent underline-offset-4 px-0',
          'hover:underline',
          'active:text-accent-hover',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-xs [&_svg]:size-4',
        md: 'h-9 px-3.5 text-sm [&_svg]:size-4',
        lg: 'h-10 px-4 text-sm [&_svg]:size-5',
        // 44px — touch-first screens and marketing CTAs.
        xl: 'h-11 px-5 text-base [&_svg]:size-5',
        icon: 'h-9 w-9 [&_svg]:size-4',
      },
    },
    compoundVariants: [
      // The `link` variant ignores horizontal padding from the size variant.
      { variant: 'link', size: 'sm', class: 'h-auto px-0' },
      { variant: 'link', size: 'md', class: 'h-auto px-0' },
      { variant: 'link', size: 'lg', class: 'h-auto px-0' },
      { variant: 'link', size: 'xl', class: 'h-auto px-0' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {
  /**
   * Render as a different element via Radix Slot. Useful when wrapping a
   * link: `<Button asChild><a href="…">…</a></Button>`.
   * @default false
   */
  asChild?: boolean;
  /**
   * Show a spinner in place of the leading icon and block interaction while
   * keeping keyboard focus (`aria-disabled` + `aria-busy`, not `disabled`, so
   * focus is not lost mid-submit). With `asChild` no spinner is rendered —
   * the child is only marked busy and made inert.
   * @default false
   */
  loading?: boolean;
  /** Icon rendered before the label. Replaced by a spinner when loading. */
  leadingIcon?: ReactNode;
  /** Icon rendered after the label. Hidden while loading. */
  trailingIcon?: ReactNode;
}

/**
 * Primary interactive element. Variants:
 *
 * - `primary` — accent fill, the single most prominent action on a screen.
 * - `secondary` — neutral fill, sits next to a primary or stands alone for
 *   secondary actions.
 * - `outline` — border only, transparent fill. Use when next to a primary.
 * - `ghost` — no border, hover background. Use in dense toolbars and tables.
 * - `destructive` — danger fill, reserved for irreversible actions.
 * - `link` — text styled as a link.
 *
 * @example Two-button row
 *   <div className="flex gap-2 justify-end">
 *     <Button variant="outline">Cancel</Button>
 *     <Button>Save changes</Button>
 *   </div>
 *
 * @example Loading state
 *   <Button loading leadingIcon={<Mail />}>Sending…</Button>
 *
 * @do Use one primary button per major surface. Verb-first labels.
 * @dont Stack three primary buttons in a row — only the most important
 *       action gets the primary variant.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    leadingIcon,
    trailingIcon,
    disabled,
    children,
    type = 'button',
    onClick,
    ...props
  },
  ref,
) {
  const classes = cn(button({ variant, size }), className);

  if (asChild) {
    // Slot requires exactly one element child — pass the consumer's element
    // through untouched. The consumer is responsible for any leading/trailing
    // icons inside that element. While loading, a capture-phase guard stops
    // the child's own handlers (and link navigation) before they run.
    return (
      <Slot
        ref={ref}
        aria-busy={loading || undefined}
        aria-disabled={loading || undefined}
        data-loading={loading || undefined}
        className={classes}
        onClick={onClick}
        onClickCapture={loading ? blockEvent : undefined}
        onKeyDownCapture={loading ? blockActivationKey : undefined}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      data-slot="button"
      ref={ref}
      type={type}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      disabled={disabled}
      data-loading={loading || undefined}
      className={classes}
      onClick={loading ? blockEvent : onClick}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </button>
  );
});

Button.displayName = 'Button';

function blockEvent(e: SyntheticEvent | MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
}

function blockActivationKey(e: React.KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') blockEvent(e);
}
