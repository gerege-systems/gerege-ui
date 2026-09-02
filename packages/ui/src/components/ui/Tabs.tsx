'use client';

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from '@/lib/cva';

/* -----------------------------------------------------------------------------
 *  Two visual variants — `underline` (refined-minimal default) and `pills`.
 *  Variant is set on `TabsList`; trigger styles auto-derive via data-attr.
 * --------------------------------------------------------------------------- */

export const Tabs = TabsPrimitive.Root;

type TabsVariant = 'underline' | 'pills';
/* Triggers read the list variant from context and stamp their own
   `data-variant`, so no ancestor selector can leak into nested Tabs. */
const TabsVariantContext = createContext<TabsVariant>('underline');

const list = cva('inline-flex items-center', {
  variants: {
    variant: {
      underline: 'gap-4 border-b border-border w-full',
      pills: 'gap-1 rounded-lg bg-background-muted p-1',
    },
    size: {
      sm: 'h-9 text-xs',
      md: 'h-10 text-sm',
      lg: 'h-11 text-sm',
    },
  },
  defaultVariants: { variant: 'underline', size: 'md' },
});

export interface TabsListProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.List>, VariantProps<typeof list> {}

export const TabsList = forwardRef<ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  function TabsList({ className, variant = 'underline', size, ...props }, ref) {
    return (
      <TabsVariantContext.Provider value={variant ?? 'underline'}>
        <TabsPrimitive.List
          data-slot="tabs-list"
          ref={ref}
          data-variant={variant}
          className={cn(list({ variant, size }), className)}
          {...props}
        />
      </TabsVariantContext.Provider>
    );
  },
);
TabsList.displayName = 'TabsList';

export const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className, ...props }, ref) {
  const variant = useContext(TabsVariantContext);
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      data-variant={variant}
      className={cn(
        'inline-flex items-center gap-2 font-medium whitespace-nowrap',
        'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] outline-none',
        'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        // Underline variant
        'data-[variant=underline]:relative data-[variant=underline]:h-full',
        'data-[variant=underline]:text-foreground-muted data-[variant=underline]:px-1',
        'data-[variant=underline]:hover:text-foreground',
        'data-[variant=underline]:data-[state=active]:text-foreground',
        'data-[variant=underline]:data-[state=active]:after:absolute',
        'data-[variant=underline]:data-[state=active]:after:inset-x-0',
        'data-[variant=underline]:data-[state=active]:after:-bottom-px',
        'data-[variant=underline]:data-[state=active]:after:h-0.5',
        'data-[variant=underline]:data-[state=active]:after:bg-accent',
        // Pills variant
        'data-[variant=pills]:h-full data-[variant=pills]:rounded-md data-[variant=pills]:px-3',
        'data-[variant=pills]:text-foreground-muted',
        'data-[variant=pills]:hover:text-foreground',
        'data-[variant=pills]:data-[state=active]:bg-card',
        'data-[variant=pills]:data-[state=active]:text-foreground',
        'data-[variant=pills]:data-[state=active]:shadow-xs',
        className,
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-4 outline-none',
        'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  );
});
TabsContent.displayName = 'TabsContent';

/**
 * @example Underline (default)
 *   <Tabs defaultValue="overview">
 *     <TabsList>
 *       <TabsTrigger value="overview">Overview</TabsTrigger>
 *       <TabsTrigger value="activity">Activity</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="overview">…</TabsContent>
 *     <TabsContent value="activity">…</TabsContent>
 *   </Tabs>
 *
 * @example Pills
 *   <TabsList variant="pills"><TabsTrigger value="all">All</TabsTrigger>…</TabsList>
 *
 * @do Use `underline` at the top of a page or panel. Use `pills` inside a
 *      card or for filter-style switches.
 * @dont Mix variants on the same screen — pick one and commit.
 */
