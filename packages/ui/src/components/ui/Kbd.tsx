'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Visual size — match the surrounding text. */
  size?: 'sm' | 'md';
}

/**
 * Stylised keyboard shortcut indicator. Compose multiple `<Kbd>` for chords.
 *
 * @example
 *   Press <Kbd>⌘</Kbd>+<Kbd>K</Kbd> to open the command palette.
 *
 * @do Use OS-conventional symbols (⌘ ⇧ ⌥ ⌃ ⏎) — keep visuals consistent
 *      across the app.
 * @dont Use Kbd for clickable buttons — it implies a real keyboard input.
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { size = 'sm', className, ...props },
  ref,
) {
  return (
    <kbd
      data-slot="kbd"
      ref={ref}
      className={cn(
        'border-border bg-background-subtle inline-flex items-center justify-center rounded-sm border font-mono',
        'text-foreground-muted shadow-xs',
        size === 'sm' ? 'h-5 min-w-5 px-1 text-xs' : 'h-6 min-w-6 px-1.5 text-xs',
        className,
      )}
      {...props}
    />
  );
});
Kbd.displayName = 'Kbd';
