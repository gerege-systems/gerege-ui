'use client';

import { isValidElement, useMemo, useState, type ReactNode } from 'react';
import { Settings } from '@/icons';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format';
import { useStrings } from '@/hooks/use-strings';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';
import { IconButton } from './IconButton';
import { Input } from './Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSortHeader,
} from './Table';
import { Skeleton } from './Skeleton';

export interface DataGridColumn<TRow> {
  /**
   * Stable key used for visibility, sort, and React lists. Autocompletes
   * row fields; any string is allowed for computed columns (with `cell`).
   */
  key: (keyof TRow & string) | (string & {});
  /** Header label. */
  header: ReactNode;
  /**
   * Render the cell. Defaults to the value at `row[key]`: `Date` →
   * `formatDate` (yyyy-MM-dd HH:mm), primitives as-is, other objects via
   * `String()`.
   */
  cell?: (row: TRow) => ReactNode;
  /** Cell width — passed to `<col>` so the grid keeps shape during loading. */
  width?: string;
  /** Allow sorting on this column. */
  sortable?: boolean;
  /** Right-align numeric / monetary columns. */
  align?: 'left' | 'right';
}

export interface DataGridProps<TRow extends { id: string | number }> {
  columns: DataGridColumn<TRow>[];
  rows: TRow[];
  loading?: boolean;
  /** Initial sort state. */
  sort?: { key: string; direction: 'asc' | 'desc' } | null;
  onSortChange?: (sort: { key: string; direction: 'asc' | 'desc' }) => void;
  /** Show a filter input row above the grid. */
  filter?: { value: string; onChange: (q: string) => void; placeholder?: string };
  /** Empty-state node when no rows are visible. */
  emptyState?: ReactNode;
  /**
   * Controlled column visibility: `{ [key]: boolean }` (missing = visible).
   * Omit for internal state. At least one column always stays visible.
   */
  columnVisibility?: Record<string, boolean>;
  onColumnVisibilityChange?: (next: Record<string, boolean>) => void;
  className?: string;
}

/** Default cell renderer for `row[key]` when no `cell` is given. */
function renderValue(v: unknown, emptyLabel: string): ReactNode {
  if (v === null || v === undefined || v === '') {
    return (
      <span aria-label={emptyLabel} className="text-foreground-subtle">
        —
      </span>
    );
  }
  if (v instanceof Date) return formatDate(v);
  if (typeof v === 'object') return isValidElement(v) ? v : String(v);
  return v as ReactNode;
}

/**
 * Composite grid built from `Table` + DropdownMenu + Input. Provides
 * column visibility toggle, an inline filter, sortable headers, and
 * loading / empty states.
 *
 * @example
 *   <DataGrid
 *     columns={[
 *       { key: 'name', header: 'Name', sortable: true },
 *       { key: 'status', header: 'Status', cell: r => <Badge tone={...}>{r.status}</Badge> },
 *       { key: 'updatedAt', header: 'Updated', align: 'right' },
 *     ]}
 *     rows={rows}
 *     filter={{ value: q, onChange: setQ }}
 *     sort={sort}
 *     onSortChange={setSort}
 *   />
 *
 * @do Provide a meaningful empty state with a primary action when the grid
 *      starts empty (no items at all, not just filtered out).
 * @dont Render thousands of rows synchronously — virtualise with `@tanstack/react-virtual`
 *       and wrap with this component's headers as a shell.
 */
export function DataGrid<TRow extends { id: string | number }>({
  columns,
  rows,
  loading,
  sort,
  onSortChange,
  filter,
  emptyState,
  columnVisibility,
  onColumnVisibilityChange,
  className,
}: DataGridProps<TRow>) {
  const strings = useStrings();
  const [internalVisibility, setInternalVisibility] = useState<Record<string, boolean>>({});
  const visibility = columnVisibility ?? internalVisibility;
  const isVisible = (key: string) => visibility[key] !== false;
  const visibleColumns = useMemo(
    () => columns.filter((c) => visibility[c.key] !== false),
    [columns, visibility],
  );
  const setColumnVisible = (key: string, visible: boolean) => {
    // Never let the user hide the last visible column — an empty grid has no
    // affordance to bring columns back.
    if (!visible && visibleColumns.length <= 1) return;
    const next = { ...visibility, [key]: visible };
    if (columnVisibility === undefined) setInternalVisibility(next);
    onColumnVisibilityChange?.(next);
  };

  const renderRows = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={`skel-${i}`}>
          {visibleColumns.map((c) => (
            <TableCell key={c.key}>
              <Skeleton variant="text" className="w-3/4" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }
    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={Math.max(1, visibleColumns.length)} className="h-32 text-center">
            {emptyState ?? <span className="text-foreground-subtle">{strings.dataGrid.empty}</span>}
          </TableCell>
        </TableRow>
      );
    }
    return rows.map((row) => (
      <TableRow key={row.id}>
        {visibleColumns.map((c) => (
          <TableCell key={c.key} align={c.align ?? 'left'}>
            {c.cell
              ? c.cell(row)
              : renderValue((row as Record<string, unknown>)[c.key], strings.dataGrid.emptyCell)}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* wrap + min-w-0: search and the column toggle do not fit side by side
          on a phone, and without min-w-0 the row widens its grid column. */}
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        {filter ? (
          <Input
            type="search"
            placeholder={filter.placeholder ?? strings.dataGrid.filterPlaceholder}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            clearable
            onClear={() => filter.onChange('')}
            className="w-full max-w-sm"
            hideLabel
            label={strings.dataGrid.filterRows}
          />
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                aria-label={strings.dataGrid.columnVisibility}
                icon={<Settings />}
                variant="outline"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{strings.dataGrid.columns}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.key}
                  checked={isVisible(c.key)}
                  disabled={isVisible(c.key) && visibleColumns.length <= 1}
                  onCheckedChange={(v) => setColumnVisible(c.key, v === true)}
                >
                  {c.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Table containerClassName="rounded-lg border border-border">
        <colgroup>
          {visibleColumns.map((c) => (
            <col key={c.key} style={c.width ? { width: c.width } : undefined} />
          ))}
        </colgroup>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((c) =>
              c.sortable && onSortChange ? (
                <TableSortHeader
                  key={c.key}
                  align={c.align ?? 'left'}
                  sortKey={c.key}
                  currentSort={sort ?? null}
                  onSortChange={(k, d) => onSortChange({ key: k, direction: d })}
                >
                  {c.header}
                </TableSortHeader>
              ) : (
                <TableHead key={c.key} align={c.align ?? 'left'}>
                  {c.header}
                </TableHead>
              ),
            )}
          </TableRow>
        </TableHeader>
        <TableBody>{renderRows()}</TableBody>
      </Table>
    </div>
  );
}
