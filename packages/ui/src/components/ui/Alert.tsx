'use client';

import { createElement, forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { cva, type VariantProps } from '@/lib/cva';

const alert = cva(['relative flex w-full gap-3 rounded-lg border p-4', 'text-sm'], {
  variants: {
    variant: {
      default: 'border-border bg-background-subtle text-foreground',
      info: 'border-info-border-soft bg-info-soft text-info-text',
      success: 'border-success-border-soft bg-success-soft text-success-text',
      warning: 'border-warning-border-soft bg-warning-soft text-warning-text',
      danger: 'border-danger-border-soft bg-danger-soft text-danger-text',
    },
  },
  defaultVariants: { variant: 'default' },
});

const iconForVariant = {
  default: null,
  info: <Info className="mt-0.5 size-4 shrink-0" aria-hidden />,
  success: <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />,
  warning: <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />,
  danger: <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden />,
};

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof alert> {
  /** Heading. Renders bold above the description. */
  title?: ReactNode;
  /** Show a dismiss (×) button. */
  dismissible?: boolean;
  /** Called when the user dismisses. */
  onDismiss?: () => void;
  /**
   * Controlled visibility. Omit for the default uncontrolled behaviour
   * (visible until dismissed).
   */
  open?: boolean;
  /** Called with the next visibility when the user dismisses. */
  onOpenChange?: (open: boolean) => void;
  /** Override the variant's default icon. Pass `false` to suppress the icon. */
  icon?: ReactNode | false;
  /**
   * Announce the alert to screen readers when it appears: `role="alert"` for
   * `danger`, `role="status"` otherwise. Off by default — content that is on
   * the page at load should not be announced as a live update.
   * @default false
   */
  live?: boolean;
  /** Heading level of `title`. Default 3 — fits under a page h1 / section h2. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/**
 * Inline banner for static page-level or section-level state. For transient
 * notifications use `Toast` instead.
 *
 * @example Inline error
 *   <Alert variant="danger" title="Payment failed">
 *     Your card was declined. Update your billing info to retry.
 *   </Alert>
 *
 * @example Dismissible info
 *   <Alert variant="info" dismissible onDismiss={dismiss}>
 *     We're improving search — give us feedback at #search-feedback.
 *   </Alert>
 *
 * @do Use the closest semantic variant — `info` for neutral facts,
 *      `warning` for "watch out", `danger` for "this is broken".
 * @dont Use Alert for one-time confirmations — that's Toast.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    className,
    variant = 'default',
    title,
    dismissible,
    onDismiss,
    open: openProp,
    onOpenChange,
    icon,
    live = false,
    headingLevel = 3,
    children,
    ...props
  },
  ref,
) {
  const strings = useStrings();
  const [internalOpen, setInternalOpen] = useState(true);
  const open = openProp ?? internalOpen;
  if (!open) return null;

  const handleDismiss = () => {
    if (openProp === undefined) setInternalOpen(false);
    onOpenChange?.(false);
    onDismiss?.();
  };

  const renderedIcon = icon === false ? null : (icon ?? iconForVariant[variant ?? 'default']);

  return (
    <div
      data-slot="alert"
      ref={ref}
      // Only errors interrupt the screen reader; everything else is polite.
      role={live ? (variant === 'danger' ? 'alert' : 'status') : undefined}
      className={cn(alert({ variant }), className)}
      {...props}
    >
      {renderedIcon}
      <div className="min-w-0 flex-1">
        {title &&
          createElement(`h${headingLevel}`, { className: 'mb-1 leading-tight font-medium' }, title)}
        <div className="text-sm leading-relaxed [&_p]:leading-relaxed">{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          aria-label={strings.alert.dismiss}
          onClick={handleDismiss}
          className={cn(
            'inline-flex size-6 shrink-0 items-center justify-center rounded-md',
            'outline-none hover:bg-current/10',
            'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
          )}
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}
    </div>
  );
});
Alert.displayName = 'Alert';
