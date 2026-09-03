'use client';

import {
  forwardRef,
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';

export interface SliderProps extends Omit<
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  'value' | 'defaultValue'
> {
  /**
   * Controlled value. Pass `[n]` for a single-thumb slider, `[a, b]` for a range slider.
   */
  value?: number[];
  defaultValue?: number[];
  /** Inline label rendered above the slider. */
  label?: ReactNode;
  /** Show the numeric value next to the label. */
  showValue?: boolean;
  /** Format the displayed value (e.g. `(v) => \`${v}%\``). */
  formatValue?: (value: number) => string;
}

/**
 * Single- or range-thumb slider. Pass one item in `value` for a single
 * thumb, two for a range.
 *
 * @example Single value
 *   <Slider label="Volume" showValue defaultValue={[60]} max={100} step={1} />
 *
 * @example Price range
 *   <Slider label="Price"
 *           defaultValue={[50, 250]}
 *           min={0} max={500} step={10}
 *           formatValue={(v) => \`$\${v}\`}
 *           showValue />
 *
 * @do Use `showValue` when the absolute number matters (price, volume, weight).
 * @dont Hide the value when users will need to reason about exact thresholds.
 */
export const Slider = forwardRef<ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  function Slider(
    {
      className,
      label,
      showValue,
      formatValue = (v) => String(v),
      value,
      defaultValue,
      onValueChange,
      ...props
    },
    ref,
  ) {
    // Uncontrolled sliders track their own value so `showValue` stays live.
    const [internal, setInternal] = useState<number[]>(defaultValue ?? [0]);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internal;
    const isRange = currentValue.length > 1;
    const labelId = useId();
    const strings = useStrings();
    // Only a string label can double as aria-label; ReactNode labels are
    // referenced by id instead.
    const stringLabel = typeof label === 'string' ? label : undefined;
    const thumbLabel = (i: number) =>
      isRange
        ? i === 0
          ? strings.slider.minimum
          : strings.slider.maximum
        : (stringLabel ?? props['aria-label'] ?? strings.slider.value);

    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && (
              <span id={labelId} className="text-foreground text-sm font-medium">
                {label}
              </span>
            )}
            {showValue && (
              <span className="tabular text-foreground-muted font-mono text-xs">
                {isRange
                  ? `${formatValue(currentValue[0])} – ${formatValue(currentValue[1])}`
                  : formatValue(currentValue[0])}
              </span>
            )}
          </div>
        )}

        <SliderPrimitive.Root
          data-slot="slider"
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onValueChange={(v) => {
            if (!isControlled) setInternal(v);
            onValueChange?.(v);
          }}
          className="relative flex w-full touch-none items-center py-3.5 select-none"
          aria-labelledby={label && !stringLabel ? labelId : undefined}
          {...props}
        >
          <SliderPrimitive.Track
            data-slot="slider-track"
            className="bg-background-muted relative h-1 w-full grow overflow-hidden rounded-full"
          >
            <SliderPrimitive.Range className="bg-accent absolute h-full" />
          </SliderPrimitive.Track>
          {currentValue.map((_, i) => (
            <SliderPrimitive.Thumb
              key={i}
              data-slot="slider-thumb"
              className={cn(
                'border-accent bg-card relative block size-4 rounded-full border-2 shadow-sm',
                // 44px touch target without growing the visible thumb.
                'before:absolute before:top-1/2 before:left-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:content-[""]',
                'focus-visible:ring-ring focus-visible:ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)]',
                'hover:scale-110 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
              )}
              aria-label={thumbLabel(i)}
              aria-labelledby={!isRange && label && !stringLabel ? labelId : undefined}
            />
          ))}
        </SliderPrimitive.Root>
      </div>
    );
  },
);

Slider.displayName = 'Slider';
