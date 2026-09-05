'use client';

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
} from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { X } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { withReturnFocus, type ReturnFocusRef } from '@/lib/return-focus';

type Direction = 'top' | 'right' | 'bottom' | 'left';

// vaul needs `direction` on Root for its drag physics; DrawerContent reads it
// back from here so the side only has to be declared once.
const DrawerDirectionContext = createContext<Direction>('bottom');

export const Drawer = ({
  shouldScaleBackground = true,
  direction = 'bottom',
  ...props
}: ComponentPropsWithoutRef<typeof DrawerPrimitive.Root>) => (
  <DrawerDirectionContext.Provider value={direction}>
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      direction={direction}
      {...props}
    />
  </DrawerDirectionContext.Provider>
);
Drawer.displayName = 'Drawer';

export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerPortal = DrawerPrimitive.Portal;
export const DrawerClose = DrawerPrimitive.Close;

export const DrawerOverlay = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(function DrawerOverlay({ className, ...props }, ref) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      ref={ref}
      className={cn('bg-overlay fixed inset-0 z-[var(--z-overlay)]', className)}
      {...props}
    />
  );
});
DrawerOverlay.displayName = 'DrawerOverlay';

// Edge-anchored sides pad by the matching safe-area inset (consumers set viewport-fit=cover).
const directionStyles: Record<Direction, string> = {
  bottom:
    'inset-x-0 bottom-0 mt-24 flex h-auto max-h-[90dvh] flex-col rounded-t-xl border-t border-border pb-[env(safe-area-inset-bottom)]',
  top: 'inset-x-0 top-0 mb-24 flex h-auto max-h-[90dvh] flex-col rounded-b-xl border-b border-border',
  left: 'inset-y-0 left-0 flex h-full w-full max-w-[min(26.25rem,90vw)] flex-col rounded-r-xl border-r border-border pl-[env(safe-area-inset-left)]',
  right:
    'inset-y-0 right-0 flex h-full w-full max-w-[min(26.25rem,90vw)] flex-col rounded-l-xl border-l border-border pr-[env(safe-area-inset-right)]',
};

const handleStyles: Record<Direction, string> = {
  bottom: 'mx-auto mt-3 h-1.5 w-12 rounded-full bg-border',
  top: 'mx-auto mb-3 h-1.5 w-12 rounded-full bg-border order-last',
  left: 'mx-1.5 my-auto h-12 w-1.5 rounded-full bg-border order-last self-stretch shrink-0',
  right: 'mx-1.5 my-auto h-12 w-1.5 rounded-full bg-border shrink-0 self-stretch',
};

export interface DrawerContentProps extends ComponentPropsWithoutRef<
  typeof DrawerPrimitive.Content
> {
  /**
   * Side the drawer slides in from. Prefer setting `direction` on `<Drawer>`
   * (vaul needs it there for drag physics); this prop only overrides the
   * visual placement.
   */
  direction?: Direction;
  /** Hide the drag handle. */
  hideHandle?: boolean;
  /** Show the close (×) button. Default `true`. */
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

export const DrawerContent = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(function DrawerContent(
  {
    className,
    direction: directionProp,
    hideHandle,
    showClose = true,
    returnFocusTo,
    onCloseAutoFocus,
    children,
    ...props
  },
  ref,
) {
  const rootDirection = useContext(DrawerDirectionContext);
  const direction = directionProp ?? rootDirection;
  const strings = useStrings();
  const isHorizontal = direction === 'left' || direction === 'right';
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        ref={ref}
        onCloseAutoFocus={withReturnFocus(returnFocusTo, onCloseAutoFocus)}
        className={cn(
          'bg-card fixed z-[var(--z-modal)]',
          directionStyles[direction],
          isHorizontal && 'flex-row',
          className,
        )}
        {...props}
      >
        {!hideHandle && <div aria-hidden className={handleStyles[direction]} />}
        <div className={cn('min-h-0 min-w-0 flex-1', isHorizontal && 'flex flex-col')}>
          {children}
        </div>
        {showClose && (
          <DrawerPrimitive.Close
            aria-label={strings.drawer.close}
            className={cn(
              'text-foreground-subtle absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-md',
              'hover:bg-background-muted hover:text-foreground',
              'focus-visible:ring-ring focus-visible:ring-offset-card outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'transition-colors duration-[var(--duration-fast)]',
            )}
          >
            <X className="size-4" aria-hidden />
          </DrawerPrimitive.Close>
        )}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
});
DrawerContent.displayName = 'DrawerContent';

export function DrawerHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grid gap-1 p-4 text-center sm:text-left', className)} {...props} />;
}
DrawerHeader.displayName = 'DrawerHeader';

export function DrawerFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />;
}
DrawerFooter.displayName = 'DrawerFooter';

export const DrawerTitle = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(function DrawerTitle({ className, ...props }, ref) {
  return (
    <DrawerPrimitive.Title
      ref={ref}
      className={cn('text-lg font-semibold', className)}
      {...props}
    />
  );
});
DrawerTitle.displayName = 'DrawerTitle';

export const DrawerDescription = forwardRef<
  ComponentRef<typeof DrawerPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(function DrawerDescription({ className, ...props }, ref) {
  return (
    <DrawerPrimitive.Description
      ref={ref}
      className={cn('text-foreground-muted text-sm', className)}
      {...props}
    />
  );
});
DrawerDescription.displayName = 'DrawerDescription';
