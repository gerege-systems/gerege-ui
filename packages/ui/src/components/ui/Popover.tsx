'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(function PopoverContent({ className, align = 'center', sideOffset = 4, ...props }, ref) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'border-border bg-popover text-popover-foreground z-[var(--z-popover)] max-w-sm min-w-72 rounded-lg border p-4 shadow-md',
          'focus-visible:ring-ring focus-visible:ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1',
          'data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = 'PopoverContent';

/**
 * @example
 *   <Popover>
 *     <PopoverTrigger asChild><Button variant="outline">Options</Button></PopoverTrigger>
 *     <PopoverContent>…</PopoverContent>
 *   </Popover>
 *
 * @do Reserve Popover for low-stakes, transient UI — pickers, mini-forms.
 * @dont Use Popover for navigation menus — that's DropdownMenu.
 */
