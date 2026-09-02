'use client';

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from '@/icons';
import { cn } from '@/lib/utils';

/* -----------------------------------------------------------------------------
 *  Full dropdown menu surface with submenu support, separators, checkbox /
 *  radio items, and keyboard shortcut labels (Kbd).
 * --------------------------------------------------------------------------- */

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const itemClasses = cn(
  'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground outline-none',
  'data-[highlighted]:bg-background-muted data-[highlighted]:text-foreground',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  'transition-colors duration-[var(--duration-fast)]',
);

export const DropdownMenuSubTrigger = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(function DropdownMenuSubTrigger({ className, inset, children, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      ref={ref}
      className={cn(
        itemClasses,
        'data-[state=open]:bg-background-muted',
        inset && 'pl-8',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight className="text-foreground-subtle ml-auto size-4" aria-hidden />
    </DropdownMenuPrimitive.SubTrigger>
  );
});
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

export const DropdownMenuSubContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(function DropdownMenuSubContent({ className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        'border-border bg-popover text-popover-foreground z-[var(--z-popover)] min-w-[8rem] overflow-hidden rounded-lg border p-1 shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        className,
      )}
      {...props}
    />
  );
});
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
  // `align` defaults to 'end' (Radix default is 'center'): triggers are
  // usually right-aligned icon buttons in toolbars/table rows. Pass
  // `align="start"` for left-anchored triggers.
>(function DropdownMenuContent({ className, sideOffset = 4, align = 'end', ...props }, ref) {
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        ref={ref}
        sideOffset={sideOffset}
        align={align}
        className={cn(
          'border-border bg-popover text-popover-foreground z-[var(--z-popover)] min-w-[12rem] overflow-hidden rounded-lg border p-1 shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1',
          className,
        )}
        {...props}
      />
    </DropdownMenuPortal>
  );
});
DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    destructive?: boolean;
  }
>(function DropdownMenuItem({ className, inset, destructive, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        itemClasses,
        inset && 'pl-8',
        destructive &&
          'text-danger-text data-[highlighted]:bg-danger-soft data-[highlighted]:text-danger-text',
        className,
      )}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(function DropdownMenuCheckboxItem({ className, children, checked, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(itemClasses, 'pl-8', className)}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="text-accent size-4" aria-hidden />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
});
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

export const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(function DropdownMenuRadioItem({ className, children, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(itemClasses, 'pl-8', className)}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="fill-accent text-accent size-2" aria-hidden />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
});
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

export const DropdownMenuLabel = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(function DropdownMenuLabel({ className, inset, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        'text-foreground-subtle px-2 py-1.5 text-xs font-medium',
        inset && 'pl-8',
        className,
      )}
      {...props}
    />
  );
});
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
});
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

/**
 * Trailing right-aligned shortcut label inside a menu item. Pair with `<Kbd>`
 * inside the Kbd component file if you want stylised keys.
 */
export function DropdownMenuShortcut({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('text-foreground-subtle ml-auto font-mono text-xs tracking-widest', className)}
      {...props}
    />
  );
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

/**
 * @example
 *   <DropdownMenu>
 *     <DropdownMenuTrigger asChild><IconButton aria-label="More" icon={<MoreHorizontal />} /></DropdownMenuTrigger>
 *     <DropdownMenuContent>
 *       <DropdownMenuItem>Open<DropdownMenuShortcut>⌘O</DropdownMenuShortcut></DropdownMenuItem>
 *       <DropdownMenuItem>Rename</DropdownMenuItem>
 *       <DropdownMenuSeparator />
 *       <DropdownMenuItem destructive>Delete</DropdownMenuItem>
 *     </DropdownMenuContent>
 *   </DropdownMenu>
 *
 * @do Group destructive items at the bottom with a separator.
 * @dont Mix link navigation and action items in the same menu — split into
 *       two menus or two groups with labels.
 */
