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
          // With a DialogBody inside, the panel becomes a column bounded by the
          // viewport: header and footer stay put and only the body scrolls.
          // Without one, layout is unchanged (block, grows with its content).
          'has-[[data-slot=dialog-body]]:flex has-[[data-slot=dialog-body]]:flex-col',
          'has-[[data-slot=dialog-body]]:max-h-[calc(100dvh-2rem)]',
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
              'focus-visible:ring-ring focus-visible:ring-offset-card outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2',
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
  return <div className={cn('flex shrink-0 flex-col gap-1 pb-4', className)} {...props} />;
}
DialogHeader.displayName = 'DialogHeader';

/**
 * Scrollable middle of a dialog. Put it between `DialogHeader` and
 * `DialogFooter`: the panel is then capped at the viewport height, header
 * (with the close button) and footer stay visible, and only this part scrolls.
 *
 * It is a focusable, named `group` (like `ScrollArea` / `Table`) so keyboard
 * users can scroll it; with nothing tabbable before it, it takes the dialog's
 * initial focus — the start of long content stays in view. Wrap a `<form>`
 * around the whole content only if the form itself is `flex min-h-0 flex-col`;
 * simpler to keep the form inside the body and submit from the footer with
 * `form="id"`.
 *
 * @example
 *   <DialogContent size="lg">
 *     <DialogHeader>…</DialogHeader>
 *     <DialogBody>…long content…</DialogBody>
 *     <DialogFooter>…</DialogFooter>
 *   </DialogContent>
 */
export const DialogBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DialogBody({ className, ...props }, ref) {
    const strings = useStrings();
    return (
      <div
        data-slot="dialog-body"
        ref={ref}
        role="group"
        aria-label={strings.scrollArea.region}
        tabIndex={0}
        className={cn(
          // Bleeds to the panel edges (-mx-6 px-6) so the scrollbar sits at the
          // edge and focus rings of fields inside are not clipped; -my-1 py-1
          // does the same vertically. `relative` anchors sr-only descendants.
          'relative -mx-6 -my-1 min-h-0 flex-1 overflow-y-auto px-6 py-1',
          'focus-visible:ring-ring outline-hidden focus-visible:ring-2 focus-visible:ring-inset',
          className,
        )}
        {...props}
      />
    );
  },
);
DialogBody.displayName = 'DialogBody';

export function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex shrink-0 flex-col-reverse gap-2 pt-6 sm:flex-row sm:justify-end',
        className,
      )}
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
  /**
   * Map a rejected `onConfirm` to the message shown. Without it the generic
   * `errorState.genericDescription` string is shown — never `Error.message`,
   * which is usually server or library text not meant for the user.
   */
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
  formatError,
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
      setFailure(formatError ? formatError(err) : strings.errorState.genericDescription);
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

ConfirmationDialog.displayName = 'ConfirmationDialog';
