'use client';

import { forwardRef, useId, useMemo, type HTMLAttributes } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { defaultStrings, formatString, type UiStrings } from '@/lib/strings';
import { Select, SelectContent, SelectItem, SelectTrigger } from './Select';

export interface PaginationLabels {
  /** Summary line. Receives the computed range. */
  showing: (from: number, to: number, total: number) => string;
  /** sr-only label for the page-size select. */
  rowsPerPage: string;
  first: string;
  last: string;
  prev: string;
  next: string;
  /** aria-label for a numbered page button. */
  page: (n: number) => string;
  /** Suffix in the page-size options, e.g. "20 / page". */
  perPage: (n: number) => string;
  /** aria-label of the nav landmark. */
  nav: string;
}

/** Build the label set from a strings object (context → functions). */
export function paginationLabelsFromStrings(s: UiStrings['pagination']): PaginationLabels {
  return {
    showing: (from, to, total) => formatString(s.showing, { from, to, total }),
    rowsPerPage: s.rowsPerPage,
    first: s.first,
    last: s.last,
    prev: s.prev,
    next: s.next,
    page: (n) => formatString(s.page, { n }),
    perPage: (n) => formatString(s.perPage, { n }),
    nav: s.nav,
  };
}

/** English defaults — derived from `defaultStrings.pagination`. */
export const defaultPaginationLabels: PaginationLabels = paginationLabelsFromStrings(
  defaultStrings.pagination,
);

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  /** 1-indexed current page. */
  page: number;
  /** Total number of pages. Set to 0 to hide page numbers. */
  pageCount: number;
  /** Called with the new page when navigating. */
  onPageChange: (page: number) => void;
  /** Total item count, for the "Showing 1-20 of 200" hint. Omit to hide. */
  totalItems?: number;
  /** Items shown per page (controlled if `onPageSizeChange` is provided). */
  pageSize?: number;
  /** Options for the page-size select. */
  pageSizeOptions?: number[];
  /** Called when the user picks a new page size. */
  onPageSizeChange?: (size: number) => void;
  /** Show first/last (« ») jump buttons. Default true. */
  showJump?: boolean;
  /** Override any of the visible / accessible strings (i18n). */
  labels?: Partial<PaginationLabels>;
}

function pageRange(current: number, total: number, max = 7): (number | 'gap')[] {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
  const window = 1;
  const result: (number | 'gap')[] = [];
  const start = Math.max(2, current - window);
  const end = Math.min(total - 1, current + window);

  result.push(1);
  if (start > 2) result.push('gap');
  for (let i = start; i <= end; i++) result.push(i);
  if (end < total - 1) result.push('gap');
  result.push(total);
  return result;
}

/**
 * Numbered pagination with prev/next, first/last jumps, page-size selector,
 * and item-count summary.
 *
 * @example
 *   <Pagination page={page} pageCount={20} onPageChange={setPage}
 *               totalItems={400} pageSize={20}
 *               pageSizeOptions={[10, 20, 50]} onPageSizeChange={setSize} />
 *
 * @do Place the count summary on the left and controls on the right.
 * @dont Show numbers when there are >100 pages — use a "jump to" input instead.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page,
    pageCount,
    onPageChange,
    totalItems,
    pageSize,
    pageSizeOptions,
    onPageSizeChange,
    showJump = true,
    labels: labelsProp,
    className,
    'aria-label': ariaLabel,
    ...props
  },
  ref,
) {
  const strings = useStrings();
  const labels = { ...paginationLabelsFromStrings(strings.pagination), ...labelsProp };
  const pageSizeId = useId();
  const pages = useMemo(() => pageRange(page, pageCount), [page, pageCount]);

  const empty = !totalItems || pageCount <= 0;
  const from = pageSize === undefined ? undefined : empty ? 0 : (page - 1) * pageSize + 1;
  const to =
    pageSize === undefined || totalItems === undefined
      ? undefined
      : empty
        ? 0
        : Math.min(page * pageSize, totalItems);
  const atStart = page <= 1 || pageCount <= 0;
  const atEnd = page >= pageCount;

  const goto = (p: number) => {
    if (p < 1 || p > pageCount || p === page) return;
    onPageChange(p);
  };

  return (
    <nav
      data-slot="pagination"
      ref={ref}
      aria-label={ariaLabel ?? labels.nav}
      className={cn('flex flex-wrap items-center justify-between gap-3', className)}
      {...props}
    >
      <div className="text-foreground-muted flex items-center gap-3 text-sm">
        {totalItems !== undefined &&
          pageSize !== undefined &&
          from !== undefined &&
          to !== undefined && (
            <span className="tabular">{labels.showing(from, to, totalItems)}</span>
          )}
        {pageSizeOptions && onPageSizeChange && pageSize !== undefined && (
          <div className="flex items-center gap-2">
            <label htmlFor={pageSizeId} className="sr-only">
              {labels.rowsPerPage}
            </label>
            <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
              <SelectTrigger id={pageSizeId} size="sm" className="w-[7.5rem] whitespace-nowrap" />
              <SelectContent>
                {pageSizeOptions.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {labels.perPage(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <ul className="flex items-center gap-1">
        {showJump && (
          <li className="hidden sm:block">
            <button
              type="button"
              aria-label={labels.first}
              disabled={atStart}
              onClick={() => goto(1)}
              className={navButtonClass}
            >
              <ChevronsLeft className="size-4" aria-hidden />
            </button>
          </li>
        )}
        <li>
          <button
            type="button"
            aria-label={labels.prev}
            disabled={atStart}
            onClick={() => goto(page - 1)}
            className={navButtonClass}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
        </li>
        {/* Below sm the page list collapses to "current / total". */}
        <li className="tabular text-foreground-muted px-2 text-sm sm:hidden" aria-current="page">
          {page} / {pageCount}
        </li>
        {pages.map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} className="text-foreground-subtle hidden px-2 sm:block">
              …
            </li>
          ) : (
            <li key={p} className="hidden sm:block">
              <button
                type="button"
                aria-label={labels.page(p)}
                aria-current={p === page ? 'page' : undefined}
                onClick={() => goto(p)}
                className={cn(
                  'tabular inline-flex size-8 items-center justify-center rounded-md text-sm outline-none',
                  'transition-colors duration-[var(--duration-fast)]',
                  'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
                  p === page
                    ? 'bg-accent text-on-accent font-medium'
                    : 'text-foreground-muted hover:bg-background-muted hover:text-foreground',
                )}
              >
                {p}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            aria-label={labels.next}
            disabled={atEnd}
            onClick={() => goto(page + 1)}
            className={navButtonClass}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </li>
        {showJump && (
          <li className="hidden sm:block">
            <button
              type="button"
              aria-label={labels.last}
              disabled={atEnd}
              onClick={() => goto(pageCount)}
              className={navButtonClass}
            >
              <ChevronsRight className="size-4" aria-hidden />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
});
Pagination.displayName = 'Pagination';

const navButtonClass = cn(
  'inline-flex size-8 items-center justify-center rounded-md text-foreground-muted',
  'transition-colors duration-[var(--duration-fast)]',
  'hover:bg-background-muted hover:text-foreground',
  'disabled:opacity-50 disabled:pointer-events-none',
  'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
);
