'use client';

import {
  forwardRef,
  useState,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { Button, type ButtonProps } from './Button';
import { withReturnFocus, type ReturnFocusRef } from '@/lib/return-focus';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = forwardRef<
  ComponentRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      ref={ref}
      className={cn(
        'bg-overlay fixed inset-0 z-[var(--z-overlay)]',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...props}
    />
  );
});
DialogOverlay.displayName = 'DialogOverlay';

export interface DialogContentProps extends ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  /** Show the default close (×) button in the top-right. */
  showClose?: boolean;
  /** Dialog width — `sm` 400 / `md` 520 / `lg` 720. */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Element to focus when the overlay closes. Overrides Radix's default
   * (the element focused when the content mounted), which is `<body>` for
   * controlled overlays opened from a pointer click on a non-focusable /
   * tooltip-wrapped trigger. A consumer `onCloseAutoFocus` runs first and
   * wins if it calls `preventDefault()`.
   */
  returnFocusTo?: ReturnFocusRef;
}

export const DialogContent = forwardRef<
  ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(function DialogContent(
  { className, children, showClose = true, size = 'md', returnFocusTo, onCloseAutoFocus, ...props },
  ref,
) {
  const strings = useStrings();
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        ref={ref}
        onCloseAutoFocus={withReturnFocus(returnFocusTo, onCloseAutoFocus)}
        className={cn(
          'fixed top-1/2 left-1/2 z-[var(--z-modal)] -translate-x-1/2 -translate-y-1/2',
          'border-border bg-card text-card-foreground w-[calc(100%-2rem)] rounded-xl border shadow-lg',
          'p-6',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          size === 'sm' && 'max-w-[400px]',
          size === 'md' && 'max-w-[520px]',
          size === 'lg' && 'max-w-[720px]',
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            aria-label={strings.dialog.close}
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
    </DialogPortal>
  );
});
DialogContent.displayName = 'DialogContent';

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1 pb-4', className)} {...props} />;
}
DialogHeader.displayName = 'DialogHeader';

export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col-reverse gap-2 pt-6 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}
DialogFooter.displayName = 'DialogFooter';

export const DialogTitle = forwardRef<
  ComponentRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-foreground text-lg leading-tight font-semibold', className)}
      {...props}
    />
  );
});
DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = forwardRef<
  ComponentRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-foreground-muted text-sm', className)}
      {...props}
    />
  );
});
DialogDescription.displayName = 'DialogDescription';

/* -----------------------------------------------------------------------------
 *  ConfirmationDialog — pre-composed pattern for destructive/important
 *  confirmations. Use this when the body is a single sentence and the only
 *  controls are Cancel + Confirm.
 * --------------------------------------------------------------------------- */

export interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Label of the confirm button. */
  confirmLabel?: string;
  /** Label of the cancel button. */
  cancelLabel?: string;
  /** Variant of the confirm button — typically `primary` or `destructive`. */
  confirmVariant?: ButtonProps['variant'];
  /**
   * Called when the user confirms. Awaited — the confirm button shows a
   * spinner while pending and a rejection is rendered inline (the dialog stays
   * open so the user can retry or cancel).
   */
  onConfirm: () => void | Promise<void>;
  /** Force the submitting state from outside (in addition to the awaited `onConfirm`). */
  loading?: boolean;
  /** Map a rejected `onConfirm` to the message shown. Defaults to `Error.message`. */
  formatError?: (err: unknown) => ReactNode;
}

/**
 * Confirmation dialog with title, description, cancel + confirm buttons.
 *
 * @example Destructive confirmation
 *   <ConfirmationDialog
 *     open={open} onOpenChange={setOpen}
 *     title="Delete project?"
 *     description="This permanently deletes the project and all its data."
 *     confirmLabel="Delete project"
 *     confirmVariant="destructive"
 *     onConfirm={handleDelete}
 *   />
 *
 * @do Lead the title with the action: "Delete project?" not "Are you sure?".
 *      State consequences in the description.
 * @dont Use for low-risk reversible actions — those don't need a dialog.
 */
export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmVariant = 'primary',
  onConfirm,
  loading,
  formatError = defaultFormatError,
}: ConfirmationDialogProps) {
  const strings = useStrings();
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<ReactNode>(null);
  const busy = Boolean(loading) || pending;

  const handleConfirm = async () => {
    setFailure(null);
    setPending(true);
    try {
      await onConfirm();
    } catch (err) {
      setFailure(formatError(err));
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setFailure(null);
        onOpenChange(next);
      }}
    >
      {/* No description → drop aria-describedby so Radix does not warn and AT is not pointed at nothing. */}
      <DialogContent size="sm" {...(description ? {} : { 'aria-describedby': undefined })}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {failure && (
          <p role="alert" className="text-danger-text text-sm">
            {failure}
          </p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={busy}>
              {cancelLabel ?? strings.confirmationDialog.cancel}
            </Button>
          </DialogClose>
          <Button variant={confirmVariant} loading={busy} onClick={handleConfirm}>
            {confirmLabel ?? strings.confirmationDialog.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function defaultFormatError(err: unknown): ReactNode {
  return err instanceof Error ? err.message : String(err);
}
ConfirmationDialog.displayName = 'ConfirmationDialog';
