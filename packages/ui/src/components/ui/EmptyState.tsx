'use client';

import { createElement, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { InboxEmpty } from '@/illustrations';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Small Lucide-sized icon rendered inside a 48px circular container.
   * Use for compact empty states (table cells, sidebar panes, cards).
   */
  icon?: ReactNode;
  /**
   * Full-size illustration rendered without the icon container. Takes
   * precedence over `icon`. If neither is set, the default `InboxEmpty`
   * line illustration is used.
   */
  illustration?: ReactNode;
  /** Heading. One short sentence. */
  title: ReactNode;
  /** Description. One or two sentences max. */
  description?: ReactNode;
  /** Primary action — usually a `<Button>` that creates the missing item. */
  action?: ReactNode;
  /** Secondary helper link — "Learn more", "Import existing", etc. */
  secondaryAction?: ReactNode;
  /** Heading level of the title. Default 3 — match the surrounding outline. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Shown when a list / dataset / surface has no content yet. Tone is helpful,
 * never apologetic.
 *
 * @example Default — uses the built-in InboxEmpty illustration
 *   <EmptyState
 *     title="No projects yet"
 *     description="Create a project to start tracking work."
 *     action={<Button>New project</Button>}
 *   />
 *
 * @example Compact — small Lucide icon for dense layouts
 *   <EmptyState
 *     icon={<Folder className="size-6" />}
 *     title="No items"
 *   />
 *
 * @example Custom illustration
 *   <EmptyState
 *     illustration={<Illustrations.NoSearchResults className="size-32" />}
 *     title="No results"
 *   />
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  {
    icon,
    illustration,
    title,
    description,
    action,
    secondaryAction,
    headingLevel = 3,
    className,
    ...props
  },
  ref,
) {
  return (
    <div
      data-slot="empty-state"
      ref={ref}
      className={cn(
        'border-border bg-background-subtle flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center',
        className,
      )}
      {...props}
    >
      {/* Visual: illustration > icon > default illustration */}
      {illustration ? (
        illustration
      ) : icon ? (
        <div className="bg-background-muted text-foreground-muted inline-flex size-12 items-center justify-center rounded-full [&_svg]:size-6">
          {icon}
        </div>
      ) : (
        <InboxEmpty className="size-24" />
      )}
      {createElement(
        `h${headingLevel}`,
        { className: 'text-base font-semibold text-foreground leading-tight' },
        title,
      )}
      {description && (
        <p className="text-foreground-muted max-w-md text-sm leading-relaxed">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-2 flex items-center gap-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
});
EmptyState.displayName = 'EmptyState';
