'use client';

import {
  forwardRef,
  useEffect,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactElement,
} from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { cva, type VariantProps } from '@/lib/cva';
import { useToast } from '@/hooks/use-toast';

export const ToastProvider = ToastPrimitive.Provider;

export const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(function ToastViewport({ className, label, ...props }, ref) {
  const strings = useStrings();
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      ref={ref}
      // Radix's default is "Notifications ({hotkey})" — route it through the
      // strings so the region landmark is localised like the rest.
      label={label ?? strings.toast.region}
      className={cn(
        'fixed right-0 bottom-0 z-[var(--z-toast)] flex max-h-dvh w-full flex-col-reverse gap-2 p-6',
        // Respect notched/home-indicator insets (consumers set viewport-fit=cover).
        'pr-[max(1.5rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))]',
        'sm:top-4 sm:right-4 sm:bottom-auto sm:max-w-sm sm:flex-col',
        className,
      )}
      {...props}
    />
  );
});
ToastViewport.displayName = 'ToastViewport';

const toast = cva(
  [
    'group pointer-events-auto relative flex w-full items-start gap-3',
    'overflow-hidden rounded-lg border p-4 pr-8 shadow-md',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-right-full',
    'data-[state=closed]:slide-out-to-right-full',
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
    'data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform',
    'data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
  ],
  {
    variants: {
      variant: {
        default: 'border-border bg-card text-card-foreground',
        success: 'border-success-border-soft bg-success-soft text-success-text',
        warning: 'border-warning-border-soft bg-warning-soft text-warning-text',
        danger: 'border-danger-border-soft bg-danger-soft text-danger-text',
        info: 'border-info-border-soft bg-info-soft text-info-text',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

const iconMap = {
  default: null,
  success: <CheckCircle2 className="text-success-text mt-0.5 size-5 shrink-0" aria-hidden />,
  warning: <AlertTriangle className="text-warning-text mt-0.5 size-5 shrink-0" aria-hidden />,
  danger: <XCircle className="text-danger-text mt-0.5 size-5 shrink-0" aria-hidden />,
  info: <Info className="text-info-text mt-0.5 size-5 shrink-0" aria-hidden />,
} satisfies Record<'default' | 'success' | 'warning' | 'danger' | 'info', ReactElement | null>;

export interface ToastProps
  extends ComponentPropsWithoutRef<typeof ToastPrimitive.Root>, VariantProps<typeof toast> {}

export const Toast = forwardRef<ElementRef<typeof ToastPrimitive.Root>, ToastProps>(function Toast(
  { className, variant = 'default', children, ...props },
  ref,
) {
  return (
    <ToastPrimitive.Root
      ref={ref}
      data-slot="toast"
      className={cn(toast({ variant }), className)}
      {...props}
    >
      {iconMap[variant ?? 'default']}
      <div className="flex-1 space-y-1">{children}</div>
    </ToastPrimitive.Root>
  );
});
Toast.displayName = 'Toast';

export const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitive.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(function ToastTitle({ className, ...props }, ref) {
  return (
    <ToastPrimitive.Title ref={ref} className={cn('text-sm font-medium', className)} {...props} />
  );
});
ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitive.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(function ToastDescription({ className, ...props }, ref) {
  return (
    <ToastPrimitive.Description
      ref={ref}
      className={cn('text-sm opacity-90', className)}
      {...props}
    />
  );
});
ToastDescription.displayName = 'ToastDescription';

export const ToastAction = forwardRef<
  ElementRef<typeof ToastPrimitive.Action>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(function ToastAction({ className, ...props }, ref) {
  return (
    <ToastPrimitive.Action
      ref={ref}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-current bg-transparent px-3 text-sm font-medium',
        'transition-colors outline-none hover:bg-current/10',
        'focus-visible:ring-ring focus-visible:ring-offset-card focus-visible:ring-2 focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  );
});
ToastAction.displayName = 'ToastAction';

export const ToastClose = forwardRef<
  ElementRef<typeof ToastPrimitive.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(function ToastClose({ className, ...props }, ref) {
  const strings = useStrings();
  return (
    <ToastPrimitive.Close
      ref={ref}
      aria-label={props['aria-label'] ?? strings.toast.close}
      className={cn(
        'text-foreground-subtle absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-md',
        'hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100',
        'focus-visible:ring-ring focus-visible:ring-offset-card outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2',
        className,
      )}
      toast-close=""
      {...props}
    >
      <X className="size-4" aria-hidden />
    </ToastPrimitive.Close>
  );
});
ToastClose.displayName = 'ToastClose';

/**
 * Drop-in host that connects the `useToast()` queue to the Radix primitives.
 * Mount it once near your app root — then `useToast().push({...})` (or the
 * standalone `toast()`) from anywhere renders here. Self-contained: it brings
 * its own ToastProvider + Viewport, so no other Toast wiring is needed.
 *
 * @example
 *   function App() {
 *     return (
 *       <>
 *         <Routes />
 *         <Toaster />
 *       </>
 *     );
 *   }
 */
export function Toaster() {
  const { toasts, dismiss, remove } = useToast();

  // Closing a toast sets open:false so Radix can play the slide-out; drop it
  // from the queue once that animation has had time to finish.
  useEffect(() => {
    const closing = toasts.filter((t) => !t.open);
    if (closing.length === 0) return;
    const timers = closing.map((t) => window.setTimeout(() => remove(t.id), 200));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [toasts, remove]);

  const strings = useStrings();
  return (
    <ToastProvider label={strings.toast.region}>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          variant={t.variant ?? 'default'}
          open={t.open}
          // Radix treats 0 as "dismiss immediately"; the queue's 0 means "keep open".
          duration={t.duration === 0 ? Infinity : t.duration}
          onOpenChange={(open) => {
            if (!open) dismiss(t.id);
          }}
        >
          {t.title && <ToastTitle>{t.title}</ToastTitle>}
          {t.description && <ToastDescription>{t.description}</ToastDescription>}
          {t.action && (
            <ToastAction altText={t.action.altText} onClick={t.action.onClick} className="mt-1">
              {t.action.label}
            </ToastAction>
          )}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
Toaster.displayName = 'Toaster';

/**
 * @example
 *   <ToastProvider>
 *     …app…
 *     <Toast variant="success">
 *       <ToastTitle>Saved</ToastTitle>
 *       <ToastDescription>Your changes are live.</ToastDescription>
 *       <ToastAction altText="Undo">Undo</ToastAction>
 *       <ToastClose />
 *     </Toast>
 *     <ToastViewport />
 *   </ToastProvider>
 *
 * @do Use the `useToast()` hook (in `src/hooks/use-toast.ts`) in app code —
 *      the components here are the primitives the hook renders.
 * @dont Stack more than two toasts at a time. Newer toasts replace older ones.
 */
