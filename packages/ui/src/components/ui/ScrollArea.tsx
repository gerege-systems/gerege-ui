'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';

/**
 * Custom scroll container with consistent styled scrollbars across OS / browsers.
 * Use when the default OS scrollbar would visually clash (sidebars, command
 * palettes, code panes). Falls back to native scroll inside the viewport.
 *
 * @example
 *   <ScrollArea className="h-64 rounded-md border border-border">
 *     <div className="p-3">…long content…</div>
 *   </ScrollArea>
 */
export interface ScrollAreaProps extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  /**
   * Accessible name of the viewport (a focusable `group` so keyboard users
   * can scroll it). Defaults to `strings.scrollArea.region`.
   */
  viewportLabel?: string;
}

export const ScrollArea = forwardRef<ElementRef<typeof ScrollAreaPrimitive.Root>, ScrollAreaProps>(
  function ScrollArea({ className, children, viewportLabel, ...props }, ref) {
    const strings = useStrings();
    return (
      <ScrollAreaPrimitive.Root
        data-slot="scroll-area"
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          role="group"
          aria-label={viewportLabel ?? strings.scrollArea.region}
          tabIndex={0}
          className={cn(
            'h-full w-full rounded-[inherit]',
            'focus-visible:ring-ring focus-visible:ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          )}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  },
);
ScrollArea.displayName = 'ScrollArea';

export const ScrollBar = forwardRef<
  ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(function ScrollBar({ className, orientation = 'vertical', ...props }, ref) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        'flex touch-none transition-colors duration-[var(--duration-fast)] select-none',
        orientation === 'vertical' && 'h-full w-2 border-l border-l-transparent p-px',
        orientation === 'horizontal' && 'h-2 flex-col border-t border-t-transparent p-px',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="bg-border-strong relative flex-1 rounded-full" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
ScrollBar.displayName = 'ScrollBar';
