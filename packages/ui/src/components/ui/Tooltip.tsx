'use client';

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

/**
 * Wrap the app in a single `<TooltipProvider>` near the root. All Tooltips
 * share the same `delayDuration` and `skipDelayDuration`.
 */
export const TooltipProvider = ({
  delayDuration = 500,
  skipDelayDuration = 200,
  ...props
}: ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider
    delayDuration={delayDuration}
    skipDelayDuration={skipDelayDuration}
    {...props}
  />
);
TooltipProvider.displayName = 'TooltipProvider';

export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(function TooltipContent({ className, sideOffset = 4, ...props }, ref) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-[var(--z-tooltip)] overflow-hidden rounded-md px-2 py-1 text-xs font-medium',
          'bg-tooltip text-tooltip-foreground',
          'max-w-xs shadow-sm',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = 'TooltipContent';

export interface TooltipProps {
  children: ReactNode;
  label: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  /** Disable showing the tooltip (e.g. when text is not truncated). */
  disabled?: boolean;
  /** Override the global delay. */
  delayDuration?: number;
}

/**
 * Shorthand for the most common Tooltip case.
 *
 * @example
 *   <Tooltip label="Copy link"><IconButton aria-label="Copy" icon={<Copy/>} /></Tooltip>
 *
 * @do Keep tooltip text short — one line, no full sentences. Use a Popover
 *      for any content that needs structure.
 * @dont Wrap disabled buttons in Tooltip without `asChild + tabIndex={0}`.
 *       Disabled elements don't receive focus, so the tooltip never opens.
 */
export function Tooltip({
  children,
  label,
  side = 'top',
  align = 'center',
  disabled,
  delayDuration,
}: TooltipProps) {
  if (disabled) return <>{children}</>;
  return (
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align}>
        {label}
      </TooltipContent>
    </TooltipRoot>
  );
}
Tooltip.displayName = 'Tooltip';
