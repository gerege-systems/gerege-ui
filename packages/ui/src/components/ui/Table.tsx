'use client';

import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
} from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';

/* -----------------------------------------------------------------------------
 *  Table primitives — minimal sugar over <table>. Pair with a sortable
 *  header helper (`TableSortHeader`) when you need built-in sort visuals.
 *  Empty + loading states are pure composition with the rest of the system.
 * --------------------------------------------------------------------------- */

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Class for the scroll wrapper (border, radius, height). */
  containerClassName?: string;
  /**
   * Max height of the scroll wrapper. Required for the sticky header to
   * work — `<thead>` sticks to the nearest scroll container, so a wrapper
   * with no height cap never scrolls. e.g. `maxHeight="24rem"`.
   */
  maxHeight?: CSSProperties['maxHeight'];
  /**
   * Accessible name of the scroll wrapper (it is a focusable `group` so
   * keyboard users can scroll wide / capped tables). Defaults to
   * `strings.table.scrollRegion`; pass the table's own title when you have one.
   */
  scrollLabel?: string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, containerClassName, maxHeight, scrollLabel, ...props },
  ref,
) {
  const strings = useStrings();
  return (
    // Whether the wrapper actually overflows is not knowable statically, so it
    // is always a tab stop (WCAG 2.1.1 / axe scrollable-region-focusable).
    <div
      data-slot="table-container"
      role="group"
      aria-label={scrollLabel ?? strings.table.scrollRegion}
      tabIndex={0}
      className={cn(
        'relative isolate w-full overflow-auto',
        'focus-visible:ring-ring focus-visible:ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        containerClassName,
      )}
      style={maxHeight !== undefined ? { maxHeight } : undefined}
    >
      <table
        data-slot="table"
        ref={ref}
        className={cn('w-full caption-bottom border-collapse text-sm', className)}
        {...props}
      />
    </div>
  );
});
Table.displayName = 'Table';

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableHeader({ className, ...props }, ref) {
  return (
    <thead
      ref={ref}
      className={cn(
        'bg-background-subtle text-foreground-muted sticky top-0 z-10',
        '[&_tr]:border-border [&_tr]:border-b',
        className,
      )}
      {...props}
    />
  );
});
TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableBody({ className, ...props }, ref) {
  return <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
});
TableBody.displayName = 'TableBody';

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableFooter({ className, ...props }, ref) {
  return (
    <tfoot
      ref={ref}
      className={cn('border-border bg-background-subtle border-t font-medium', className)}
      {...props}
    />
  );
});
TableFooter.displayName = 'TableFooter';

export const TableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement> & {
    /**
     * Visual selected state (`data-state="selected"`). `aria-selected` is only
     * valid on rows of an ARIA grid, so it is emitted only when the row
     * carries `role="row"` (i.e. you opted into `role="grid"` on the table).
     */
    selected?: boolean;
  }
>(function TableRow({ className, selected, role, ...props }, ref) {
  return (
    <tr
      ref={ref}
      role={role}
      data-state={selected ? 'selected' : undefined}
      aria-selected={selected && role === 'row' ? true : undefined}
      className={cn(
        'border-border border-b transition-colors duration-[var(--duration-fast)]',
        'hover:bg-background-subtle',
        'data-[state=selected]:bg-accent-soft data-[state=selected]:hover:bg-accent-soft',
        className,
      )}
      {...props}
    />
  );
});
TableRow.displayName = 'TableRow';

export type TableCellAlign = 'left' | 'center' | 'right';

const alignClass: Record<TableCellAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  /* Numeric columns: right-aligned + tabular figures so digits line up. */
  right: 'text-right tabular',
};

export interface TableHeadProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Horizontal alignment; `right` also applies tabular figures. */
  align?: TableCellAlign;
  /**
   * Render the header label in small caps (`uppercase tracking-wide`).
   * Off by default — mixed case reads better for long / Cyrillic labels.
   * @default false
   */
  uppercase?: boolean;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { className, uppercase = false, align = 'left', ...props },
  ref,
) {
  return (
    <th
      ref={ref}
      className={cn(
        'text-foreground-subtle h-10 px-3 align-middle text-xs font-medium',
        alignClass[align],
        uppercase && 'tracking-wide uppercase',
        '[&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  );
});
TableHead.displayName = 'TableHead';

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Horizontal alignment; `right` also applies tabular figures for numbers. */
  align?: TableCellAlign;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, align = 'left', ...props },
  ref,
) {
  return (
    <td
      ref={ref}
      className={cn('text-foreground px-3 py-3 align-middle', alignClass[align], className)}
      {...props}
    />
  );
});
TableCell.displayName = 'TableCell';

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(function TableCaption({ className, ...props }, ref) {
  return (
    <caption
      ref={ref}
      className={cn('text-foreground-subtle mt-4 text-sm', className)}
      {...props}
    />
  );
});
TableCaption.displayName = 'TableCaption';

export interface TableSortHeaderProps extends TableHeadProps {
  /** Stable column key used in `currentSort.key`. */
  sortKey: string;
  /** Currently sorted column + direction (or null). */
  currentSort: { key: string; direction: 'asc' | 'desc' } | null;
  /** Called when the user clicks the header. */
  onSortChange: (key: string, direction: 'asc' | 'desc') => void;
}

/**
 * Sortable column header. Click toggles asc → desc → asc; the icon reflects
 * the current state.
 *
 * @example
 *   <TableSortHeader sortKey="name" currentSort={sort} onSortChange={onSort}>
 *     Name
 *   </TableSortHeader>
 *
 * @do Sort by one column at a time. Multi-sort hides state from users.
 * @dont Sort silently — the icon must change so users see what changed.
 */
export const TableSortHeader = forwardRef<HTMLTableCellElement, TableSortHeaderProps>(
  function TableSortHeader(
    { sortKey, currentSort, onSortChange, children, className, align = 'left', ...props },
    ref,
  ) {
    const active = currentSort?.key === sortKey;
    const direction = active ? currentSort?.direction : undefined;
    const handle = () => {
      onSortChange(sortKey, active && direction === 'asc' ? 'desc' : 'asc');
    };
    return (
      <TableHead
        ref={ref}
        align={align}
        className={cn('p-0', className)}
        // aria-sort only on the sorted column — 'none' everywhere else is noise.
        aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : undefined}
        {...props}
      >
        <button
          type="button"
          onClick={handle}
          className={cn(
            'inline-flex h-10 w-full items-center gap-1.5 px-3 outline-none',
            align === 'right' && 'flex-row-reverse',
            align === 'center' && 'justify-center',
            'transition-colors duration-[var(--duration-fast)]',
            'hover:text-foreground focus-visible:text-foreground',
            'focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2',
            active && 'text-foreground',
          )}
        >
          {children}
          {direction === 'asc' ? (
            <ArrowUp className="size-3.5" aria-hidden />
          ) : direction === 'desc' ? (
            <ArrowDown className="size-3.5" aria-hidden />
          ) : (
            <ArrowUpDown className="size-3.5 opacity-40" aria-hidden />
          )}
        </button>
      </TableHead>
    );
  },
);
TableSortHeader.displayName = 'TableSortHeader';
