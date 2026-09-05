'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';

/**
 * Hairline divider. Decorative by default (no role announced). Pass
 * `decorative={false}` when the separator carries semantic meaning, e.g.
 * splitting two regions in a landmark.
 *
 * @example Section divider
 *   <Separator className="my-6" />
 *
 * @example Vertical inside a toolbar
 *   <Separator orientation="vertical" className="h-5 mx-2" />
 */
export const Separator = forwardRef<
  ComponentRef<typeof SeparatorPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(function Separator({ className, orientation = 'horizontal', decorative = true, ...props }, ref) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      ref={ref}
      orientation={orientation}
      decorative={decorative}
      className={cn(
        'bg-border shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  );
});
Separator.displayName = 'Separator';
