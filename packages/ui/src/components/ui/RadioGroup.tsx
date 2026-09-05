'use client';

import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@/lib/utils';

export interface RadioGroupProps extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  /** Lay out the radios vertically (default) or horizontally. Also drives arrow-key navigation. */
  orientation?: 'horizontal' | 'vertical';
}

export const RadioGroup = forwardRef<
  ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(function RadioGroup({ className, orientation = 'vertical', ...props }, ref) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      ref={ref}
      orientation={orientation}
      className={cn(
        'flex gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className,
      )}
      {...props}
    />
  );
});
RadioGroup.displayName = 'RadioGroup';

export interface RadioItemProps extends Omit<
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  'asChild'
> {
  label?: ReactNode;
  description?: ReactNode;
  hideLabel?: boolean;
}

/**
 * One radio option with inline label + description.
 *
 * @example
 *   <RadioGroup defaultValue="weekly">
 *     <RadioItem value="daily" label="Daily" description="Every morning at 9am" />
 *     <RadioItem value="weekly" label="Weekly" description="Monday mornings" />
 *     <RadioItem value="never" label="Never" />
 *   </RadioGroup>
 *
 * @do Pair every RadioItem with a label — naked radios are unreachable for
 *      screen reader users.
 * @dont Use RadioGroup for binary choices — use Switch.
 */
export const RadioItem = forwardRef<ComponentRef<typeof RadioGroupPrimitive.Item>, RadioItemProps>(
  function RadioItem(
    {
      className,
      label,
      description,
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

    return (
      <div className={cn('flex items-start gap-2.5', className)}>
        <RadioGroupPrimitive.Item
          ref={ref}
          id={fieldId}
          disabled={disabled}
          aria-describedby={describedBy}
          className={cn(
            'bg-card relative mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
            // WCAG 2.5.8: 16px visual box, ≥24px hit area via an invisible inset halo.
            'before:absolute before:-inset-1.5 before:rounded-full before:content-[""]',
            'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
            'focus-visible:ring-ring focus-visible:ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'data-[state=checked]:border-accent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'border-border-input aria-invalid:border-danger',
          )}
          {...props}
        >
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            <span className="bg-accent size-2 rounded-full" aria-hidden />
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>

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
    );
  },
);
RadioItem.displayName = 'RadioItem';
