'use client';

import { forwardRef, type HTMLAttributes, type KeyboardEvent } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from '@/lib/cva';

const card = cva(
  [
    'rounded-lg border bg-card text-card-foreground',
    'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
  ],
  {
    variants: {
      variant: {
        default: 'border-border',
        interactive: [
          'border-border hover:border-border-strong hover:bg-background-subtle cursor-pointer',
          'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'focus-visible:ring-offset-background',
        ],
      },
      padding: {
        none: '',
        sm: 'p-4',
        /* CANON: 16 compact/mobile, 24 desktop — never 20. */
        md: 'p-4 md:p-6',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  },
);

export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof card> {
  /** Render the child element (e.g. a router `<Link>`) with Card styles. */
  asChild?: boolean;
}

/**
 * Bounded surface used to group related content. Per the refined-minimal
 * rules, cards on the page have a hairline border and no shadow.
 *
 * @example Header + content + footer
 *   <Card>
 *     <CardHeader>
 *       <CardTitle>Storage</CardTitle>
 *       <CardDescription>Usage across all projects.</CardDescription>
 *     </CardHeader>
 *     <CardContent>…</CardContent>
 *     <CardFooter><Button>Upgrade</Button></CardFooter>
 *   </Card>
 *
 * @example Clickable list row
 *   <Card variant="interactive" onClick={open}>…</Card>
 *
 * @do Use the `border` style. If a card needs to "float" (modal, dropdown),
 *      it isn't a Card — it's a Popover/Dialog.
 * @dont Add `shadow-lg` to Cards. Shadows on inline surfaces violate the
 *       refined-minimal direction.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant, padding, onClick, onKeyDown, role, tabIndex, asChild, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'div';
  // An interactive card with a click handler must be reachable and operable
  // from the keyboard: expose it as a button and map Enter/Space to click.
  const isButtonLike = variant === 'interactive' && typeof onClick === 'function';
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !isButtonLike) return;
    // Only when the card itself is focused — nested controls handle their own keys.
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };
  return (
    <Comp
      data-slot="card"
      ref={ref}
      role={role ?? (isButtonLike ? 'button' : undefined)}
      tabIndex={tabIndex ?? (isButtonLike ? 0 : undefined)}
      onClick={onClick}
      onKeyDown={isButtonLike || onKeyDown ? handleKeyDown : undefined}
      className={cn(card({ variant, padding }), className)}
      {...props}
    />
  );
});
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn('flex flex-col gap-1 pb-4', className)} {...props} />;
  },
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, children, ...props }, ref) {
    return (
      <h3
        ref={ref}
        className={cn('text-foreground text-base leading-tight font-semibold', className)}
        {...props}
      >
        {children}
      </h3>
    );
  },
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return <p ref={ref} className={cn('text-foreground-muted text-sm', className)} {...props} />;
});
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn('text-foreground text-sm', className)} {...props} />;
  },
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cn('flex items-center gap-2 pt-4', className)} {...props} />;
  },
);
CardFooter.displayName = 'CardFooter';
