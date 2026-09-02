'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Predefined silhouette presets. */
  variant?: 'text' | 'circle' | 'card' | 'avatar';
  /**
   * Render nothing until this many ms have elapsed, so sub-300ms loads never
   * flash a placeholder. Default 300. Pass 0 to render immediately.
   */
  delay?: number;
  /**
   * Once shown, keep the placeholder mounted for at least this many ms so it
   * never flickers. Default 500.
   */
  minVisible?: number;
}

/**
 * Animated placeholder. Use `variant="text"` / `variant="avatar"` for common
 * shapes; pass `className` directly for one-off sizes.
 *
 * @example List item
 *   <div className="flex items-center gap-3">
 *     <Skeleton variant="avatar" />
 *     <div className="space-y-1.5 flex-1">
 *       <Skeleton variant="text" className="w-1/3" />
 *       <Skeleton variant="text" className="w-1/2" />
 *     </div>
 *   </div>
 *
 * @example Card
 *   <Skeleton variant="card" className="h-32" />
 *
 * @do Match the silhouette of the eventual content so the layout doesn't
 *      shift when data arrives.
 * @dont Pass `delay={0}` for data that usually arrives in under 300ms — the
 *       default delay exists so fast loads never flash a placeholder.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, variant, delay = 300, minVisible = 500, ...props },
  ref,
) {
  const show = useDelayedLoading(delay, { minVisible });
  if (!show) return null;
  return (
    <div
      data-slot="skeleton"
      ref={ref}
      aria-hidden
      className={cn(
        'bg-background-muted animate-pulse',
        variant === 'text' && 'h-3 rounded-sm',
        variant === 'circle' && 'aspect-square rounded-full',
        variant === 'avatar' && 'size-8 rounded-full',
        variant === 'card' && 'rounded-lg',
        !variant && 'rounded-md',
        className,
      )}
      {...props}
    />
  );
});
Skeleton.displayName = 'Skeleton';
