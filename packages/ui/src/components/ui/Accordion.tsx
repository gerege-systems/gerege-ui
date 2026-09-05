'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from '@/icons';
import { cn } from '@/lib/utils';

/**
 * Accessible disclosure list. Supports single (`type="single"`) and multiple
 * (`type="multiple"`) open behaviour — both come from Radix.
 *
 * @example FAQ
 *   <Accordion type="single" collapsible>
 *     <AccordionItem value="q1">
 *       <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
 *       <AccordionContent>Yes — usage stops at the end of the billing period.</AccordionContent>
 *     </AccordionItem>
 *     …
 *   </Accordion>
 *
 * @do Use for FAQs, settings groups, and progressive-disclosure forms.
 * @dont Nest accordions inside accordions — the focus order becomes opaque.
 */
export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      ref={ref}
      className={cn('border-border border-b', className)}
      {...props}
    />
  );
});
AccordionItem.displayName = 'AccordionItem';

export const AccordionTrigger = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'text-foreground flex flex-1 items-center justify-between gap-2 py-4 text-left text-sm font-medium',
          'transition-colors duration-[var(--duration-fast)] outline-none',
          'hover:text-accent',
          'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
          '[&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className="text-foreground-subtle size-4 shrink-0 transition-transform duration-[var(--duration-base)]"
          aria-hidden
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = forwardRef<
  ComponentRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        'text-foreground-muted overflow-hidden text-sm',
        // Deliberate motion exception: height animates (layout property). Radix only
        // keeps Content mounted through CSS *animations*, so a grid-rows transition
        // would cut the close. The panel is short and nothing below it reflows
        // except by design; `prefers-reduced-motion` disables it globally.
        'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      )}
      {...props}
    >
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = 'AccordionContent';
