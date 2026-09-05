'use client';

import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  'asChild'
> {
  /** Inline label rendered to the right. */
  label?: ReactNode;
  /** Secondary description rendered below the label. */
  description?: ReactNode;
  /** Position the label before the switch instead of after. */
  labelPosition?: 'before' | 'after';
  /** Visual size. */
  size?: 'sm' | 'md';
  /** Hide the label visually while keeping it accessible. */
  hideLabel?: boolean;
}

// Tracks are 28×16 (`sm`) / 36×20 (`md`) visually; the `before:` halo lifts
// the hit area to ≥24px tall without changing the drawing (WCAG 2.5.8).
const trackSize = {
  sm: 'h-4 w-7 before:absolute before:-inset-x-1 before:-inset-y-1.5 before:content-[""]',
  md: 'h-5 w-9 before:absolute before:-inset-x-1 before:-inset-y-1 before:content-[""]',
} as const;
const thumbSize = {
  sm: 'size-3 data-[state=checked]:translate-x-3',
  md: 'size-4 data-[state=checked]:translate-x-4',
} as const;

/**
 * Binary on/off toggle for instant-apply settings. Use Checkbox when the
 * choice is part of a form that needs explicit submission.
 *
 * @example Instant toggle
 *   <Switch label="Email digest" checked={on} onCheckedChange={setOn} />
 *
 * @example With description
 *   <Switch label="Two-factor authentication"
 *           description="Required for admins on production accounts."
 *           checked={tfa}
 *           onCheckedChange={setTfa} />
 *
 * @do Use Switch when the change takes effect immediately. Pair with
 *      a toast confirming the new state.
 * @dont Use Switch inside a form that requires submission — Checkbox
 *       better matches that mental model.
 */
export const Switch = forwardRef<ComponentRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  function Switch(
    {
      className,
      label,
      description,
      labelPosition = 'after',
      size = 'md',
      hideLabel,
      id,
      disabled,
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref,
  ) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const descId = description ? `${fieldId}-desc` : undefined;
    const describedBy = [descId, ariaDescribedby].filter(Boolean).join(' ') || undefined;

    const control = (
      <SwitchPrimitive.Root
        data-slot="switch"
        ref={ref}
        id={fieldId}
        disabled={disabled}
        aria-describedby={describedBy}
        className={cn(
          'peer relative inline-flex shrink-0 items-center rounded-full border-2 border-transparent',
          'transition-colors duration-[var(--duration-base)] ease-[var(--ease-out)]',
          'focus-visible:ring-ring focus-visible:ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-accent data-[state=unchecked]:bg-switch-track-off',
          'aria-invalid:ring-danger aria-invalid:ring-2',
          trackSize[size],
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'bg-switch-thumb pointer-events-none block rounded-full shadow-sm',
            'transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)]',
            'translate-x-0',
            thumbSize[size],
          )}
        />
      </SwitchPrimitive.Root>
    );

    const labelBlock = label && (
      <div className="flex flex-col gap-0.5 select-none">
        <label
          htmlFor={fieldId}
          className={cn(
            'text-foreground text-sm',
            disabled && 'cursor-not-allowed opacity-50',
            hideLabel && 'sr-only',
          )}
        >
          {label}
        </label>
        {description && (
          <p id={descId} className="text-foreground-subtle text-xs">
            {description}
          </p>
        )}
      </div>
    );

    return (
      <div className={cn('inline-flex items-center gap-2.5', className)}>
        {labelPosition === 'before' && labelBlock}
        {control}
        {labelPosition === 'after' && labelBlock}
      </div>
    );
  },
);

Switch.displayName = 'Switch';
