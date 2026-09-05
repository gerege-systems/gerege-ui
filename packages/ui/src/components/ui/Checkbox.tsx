'use client';

import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from '@/icons';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  'asChild'
> {
  /** Visible label rendered to the right of the box. */
  label?: ReactNode;
  /** Secondary description rendered below the label. */
  description?: ReactNode;
  /** Validation error message. */
  error?: ReactNode;
  /** Hide the label visually while keeping it in the a11y tree. */
  hideLabel?: boolean;
}

/**
 * Checkbox with optional inline label + description. Pass `checked="indeterminate"`
 * for the indeterminate state — Radix renders a `Minus` icon automatically.
 *
 * @example Single
 *   <Checkbox label="I agree to the terms" checked={ok} onCheckedChange={setOk} />
 *
 * @example Tri-state header
 *   <Checkbox aria-label="Select all"
 *             checked={allSelected ? true : someSelected ? 'indeterminate' : false}
 *             onCheckedChange={toggleAll} />
 *
 * @do Use indeterminate to summarise child rows in a table header.
 * @dont Use a Checkbox for mutually exclusive choices — use RadioGroup.
 */
export const Checkbox = forwardRef<ComponentRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  function Checkbox(
    {
      className,
      label,
      description,
      error,
      hideLabel,
      id,
      disabled,
      'aria-describedby': ariaDescribedby,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const descId = description ? `${fieldId}-desc` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;
    const describedBy = [errorId, descId, ariaDescribedby].filter(Boolean).join(' ') || undefined;
    const isError = Boolean(error) || ariaInvalid === true || ariaInvalid === 'true';

    return (
      <div data-slot="checkbox-field" className={cn('flex flex-col gap-1', className)}>
        <div className="flex items-start gap-2.5">
          <CheckboxPrimitive.Root
            ref={ref}
            id={fieldId}
            disabled={disabled}
            aria-describedby={describedBy}
            aria-invalid={isError ? true : ariaInvalid}
            className={cn(
              'peer relative mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border',
              // WCAG 2.5.8: 16px visual box, ≥24px hit area via an invisible inset halo.
              'before:absolute before:-inset-1.5 before:content-[""]',
              'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
              'focus-visible:ring-ring focus-visible:ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-on-accent',
              'data-[state=indeterminate]:bg-accent data-[state=indeterminate]:border-accent data-[state=indeterminate]:text-on-accent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'border-border-input aria-invalid:border-danger',
            )}
            {...props}
          >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center">
              {props.checked === 'indeterminate' ? (
                <Minus className="size-3" aria-hidden strokeWidth={3} />
              ) : (
                <Check className="size-3" aria-hidden strokeWidth={3} />
              )}
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>

          {label && (
            <div className="flex flex-col gap-0.5">
              <label
                htmlFor={fieldId}
                className={cn(
                  'text-foreground text-sm select-none',
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
          )}
        </div>
        {error && (
          <p id={errorId} className="text-danger-text text-xs">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
