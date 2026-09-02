'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Check } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';

export interface Step {
  /** Step heading. */
  title: ReactNode;
  /** Optional secondary description, only shown in vertical orientation. */
  description?: ReactNode;
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  /** Ordered list of steps. */
  steps: Step[];
  /** 0-indexed active step. Steps before it are marked complete. */
  current: number;
  /** Layout direction. */
  orientation?: 'horizontal' | 'vertical';
  /** sr-only state words announced after each title (i18n). */
  stateLabels?: { complete: string; current: string; upcoming: string };
}

/**
 * Multi-step progress indicator. Use the horizontal variant in narrow flows
 * (top of an onboarding modal) and vertical for deeper context.
 *
 * @example Onboarding
 *   <Stepper
 *     current={step}
 *     steps={[
 *       { title: 'Workspace' },
 *       { title: 'Invite team' },
 *       { title: 'Connect data' },
 *       { title: 'Done' },
 *     ]}
 *   />
 *
 * @do Keep titles 1–2 words. Save explanations for the page body.
 * @dont Use Stepper for free-form navigation. It implies a linear flow.
 */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  {
    steps,
    current,
    orientation = 'horizontal',
    stateLabels: stateLabelsProp,
    className,
    'aria-label': ariaLabel,
    ...props
  },
  ref,
) {
  const strings = useStrings();
  const stateLabels = stateLabelsProp ?? {
    complete: strings.stepper.complete,
    current: strings.stepper.current,
    upcoming: strings.stepper.upcoming,
  };
  return (
    <ol
      data-slot="stepper"
      ref={ref}
      aria-label={ariaLabel ?? strings.stepper.label}
      className={cn(
        orientation === 'horizontal' ? 'flex w-full items-center' : 'flex flex-col gap-6',
        className,
      )}
      {...props}
    >
      {steps.map((step, i) => {
        const state = i < current ? 'complete' : i === current ? 'current' : 'upcoming';
        const isLast = i === steps.length - 1;
        return (
          <li
            key={i}
            aria-current={state === 'current' ? 'step' : undefined}
            className={cn(
              orientation === 'horizontal'
                ? // min-w-0: a flex item will not shrink below its content, so
                  // without this the titles push the row past its container and
                  // the last one is clipped on a narrow screen.
                  'flex min-w-0 flex-1 items-center gap-3 last:flex-initial'
                : 'flex items-start gap-3',
            )}
          >
            <div
              className={cn(
                orientation === 'horizontal'
                  ? 'flex items-center gap-3'
                  : 'flex flex-col items-center',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  state === 'complete' && 'bg-accent text-on-accent',
                  state === 'current' && 'bg-card border-accent text-accent border-2',
                  state === 'upcoming' &&
                    'bg-background-muted text-foreground-subtle border-border border',
                )}
              >
                {state === 'complete' ? <Check className="size-4" /> : i + 1}
              </span>
              {orientation === 'vertical' && !isLast && (
                <span
                  className={cn(
                    'mt-1 min-h-6 w-px flex-1',
                    i < current ? 'bg-accent' : 'bg-border',
                  )}
                />
              )}
            </div>
            <div className={cn('flex flex-col', orientation === 'horizontal' && 'min-w-0')}>
              <span
                className={cn(
                  'truncate text-sm font-medium',
                  state === 'upcoming' ? 'text-foreground-subtle' : 'text-foreground',
                )}
                title={typeof step.title === 'string' ? step.title : undefined}
              >
                {step.title}
                <span className="sr-only">, {stateLabels[state]}</span>
              </span>
              {orientation === 'vertical' && step.description && (
                <p className="text-foreground-muted mt-0.5 text-xs">{step.description}</p>
              )}
            </div>
            {orientation === 'horizontal' && !isLast && (
              <span
                aria-hidden
                className={cn('mx-2 h-px flex-1', i < current ? 'bg-accent' : 'bg-border')}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
});
Stepper.displayName = 'Stepper';
