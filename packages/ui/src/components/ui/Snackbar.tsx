'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { cva, type VariantProps } from '@/lib/cva';

const snackbar = cva(
  [
    'relative pointer-events-auto w-full max-w-md',
    'flex items-start gap-3 rounded-md border bg-card p-3 shadow-md',
    'text-sm text-foreground',
  ],
  {
    variants: {
      variant: {
        default: 'border-border',
        info: 'border-info-border-soft',
        success: 'border-success-border-soft',
        warning: 'border-warning-border-soft',
        danger: 'border-danger-border-soft',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

const iconForVariant: Record<NonNullable<VariantProps<typeof snackbar>['variant']>, ReactNode> = {
  default: null,
  info: <Info className="text-info-text mt-0.5 size-4 shrink-0" aria-hidden />,
  success: <CheckCircle2 className="text-success-text mt-0.5 size-4 shrink-0" aria-hidden />,
  warning: <AlertTriangle className="text-warning-text mt-0.5 size-4 shrink-0" aria-hidden />,
  danger: <XCircle className="text-danger-text mt-0.5 size-4 shrink-0" aria-hidden />,
};

export interface SnackbarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof snackbar> {
  /** Headline. */
  title?: ReactNode;
  /** Action button rendered on the right. */
  action?: ReactNode;
  /** Show a close (×) button on the right. */
  onClose?: () => void;
  /** Override the variant's default icon. Pass `false` to hide. */
  icon?: ReactNode | false;
}

/**
 * Persistent inline notification. Unlike Toast, Snackbar does **not** auto-
 * dismiss. Pair with an `action` button or an `onClose` handler.
 */
export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(function Snackbar(
  { className, variant = 'default', title, action, onClose, icon, children, ...props },
  ref,
) {
  const strings = useStrings();
  const renderedIcon = icon === false ? null : (icon ?? iconForVariant[variant ?? 'default']);

  return (
    <div ref={ref} role="status" className={cn(snackbar({ variant }), className)} {...props}>
      {renderedIcon}
      <div className="min-w-0 flex-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <p className="text-foreground-muted">{children}</p>}
      </div>
      {action}
      {onClose && (
        <button
          data-slot="snackbar"
          type="button"
          onClick={onClose}
          aria-label={strings.snackbar.dismiss}
          className="text-foreground-muted hover:bg-background-muted hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-card rounded p-1 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
});
Snackbar.displayName = 'Snackbar';
