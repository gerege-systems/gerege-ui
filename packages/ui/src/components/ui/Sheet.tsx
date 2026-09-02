'use client';

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { cva, type VariantProps } from '@/lib/cva';
import { withReturnFocus, type ReturnFocusRef } from '@/lib/return-focus';

/* -----------------------------------------------------------------------------
 *  Sheet — drawer-style overlay. Built on Radix Dialog (focus trap, escape,
 *  click-outside come from there). Slides in from one of four sides.
 * --------------------------------------------------------------------------- */

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function SheetOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'bg-overlay fixed inset-0 z-[var(--z-overlay)]',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
        className,
      )}
      {...props}
    />
  );
});
SheetOverlay.displayName = 'SheetOverlay';

const sheet = cva(
  [
    'fixed z-[var(--z-modal)] bg-card text-card-foreground shadow-lg',
    'flex flex-col gap-4 p-6',
    // Safe-area insets for notched devices (consumers set viewport-fit=cover).
    'pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))]',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:duration-[var(--duration-base)] data-[state=open]:duration-[var(--duration-slow)]',
  ],
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b border-border data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top',
        bottom:
          'inset-x-0 bottom-0 border-t border-border data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 max-w-md border-r border-border data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left',
        right:
          'inset-y-0 right-0 h-full w-3/4 max-w-md border-l border-border data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
      },
    },
    defaultVariants: { side: 'right' },
  },
);

export interface SheetContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, VariantProps<typeof sheet> {
  showClose?: boolean;
  /**
   * Element to focus when the overlay closes. Overrides Radix's default
   * (the element focused when the content mounted), which is `<body>` for
   * controlled overlays opened from a pointer click on a non-focusable /
   * tooltip-wrapped trigger. A consumer `onCloseAutoFocus` runs first and
   * wins if it calls `preventDefault()`.
   */
  returnFocusTo?: ReturnFocusRef;
}

export const SheetContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(function SheetContent(
  {
    className,
    children,
    side = 'right',
    showClose = true,
    returnFocusTo,
    onCloseAutoFocus,
    ...props
  },
  ref,
) {
  const strings = useStrings();
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        ref={ref}
        className={cn(sheet({ side }), className)}
        onCloseAutoFocus={withReturnFocus(returnFocusTo, onCloseAutoFocus)}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            aria-label={strings.sheet.close}
            className={cn(
              'text-foreground-subtle absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-md',
              'hover:bg-background-muted hover:text-foreground',
              'focus-visible:ring-ring focus-visible:ring-offset-card outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'transition-colors duration-[var(--duration-fast)]',
            )}
          >
            <X className="size-4" aria-hidden />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = 'SheetContent';

export function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1', className)} {...props} />;
}
SheetHeader.displayName = 'SheetHeader';

export function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mt-auto flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}
SheetFooter.displayName = 'SheetFooter';

export const SheetTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-foreground text-lg leading-tight font-semibold', className)}
      {...props}
    />
  );
});
SheetTitle.displayName = 'SheetTitle';

export const SheetDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-foreground-muted text-sm', className)}
      {...props}
    />
  );
});
SheetDescription.displayName = 'SheetDescription';

/**
 * @example Right-side filter drawer
 *   <Sheet>
 *     <SheetTrigger asChild><Button variant="outline">Filters</Button></SheetTrigger>
 *     <SheetContent side="right">
 *       <SheetHeader>
 *         <SheetTitle>Filters</SheetTitle>
 *         <SheetDescription>Refine the result set.</SheetDescription>
 *       </SheetHeader>
 *       …
 *       <SheetFooter>
 *         <SheetClose asChild><Button variant="outline">Cancel</Button></SheetClose>
 *         <Button>Apply</Button>
 *       </SheetFooter>
 *     </SheetContent>
 *   </Sheet>
 *
 * @do Use right side for filters/inspectors, left for navigation, bottom for
 *      mobile sheets.
 * @dont Use a full-screen sheet on desktop — prefer Dialog or a dedicated page.
 */
