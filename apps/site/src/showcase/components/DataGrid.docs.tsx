import { useMemo, useState } from 'react';
import { DataGrid, type DataGridColumn } from '@/components/ui/DataGrid';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ComponentDoc } from '../registry/types';
import { Search } from '@/icons';
import { Checkbox } from '@/components/ui/Checkbox';

interface Row {
  id: string;
  name: string;
  owner: string;
  initials: string;
  status: 'Active' | 'Paused' | 'Archived';
  spend: number;
  updated: string;
}

const ROWS: Row[] = [
  {
    id: '1',
    name: 'Atlas',
    owner: 'Avery',
    initials: 'AV',
    status: 'Active',
    spend: 1240,
    updated: 'Today',
  },
  {
    id: '2',
    name: 'Beacon',
    owner: 'Jordan',
    initials: 'JO',
    status: 'Paused',
    spend: 380,
    updated: 'Yesterday',
  },
  {
    id: '3',
    name: 'Cosmo',
    owner: 'Sam',
    initials: 'SA',
    status: 'Archived',
    spend: 0,
    updated: 'Apr 28',
  },
  {
    id: '4',
    name: 'Drift',
    owner: 'Robin',
    initials: 'RO',
    status: 'Active',
    spend: 2210,
    updated: 'Today',
  },
  {
    id: '5',
    name: 'Ember',
    owner: 'Avery',
    initials: 'AV',
    status: 'Active',
    spend: 960,
    updated: 'May 30',
  },
  {
    id: '6',
    name: 'Flux',
    owner: 'Kai',
    initials: 'KA',
    status: 'Paused',
    spend: 145,
    updated: 'May 12',
  },
];

const tone = (s: Row['status']) =>
  s === 'Active'
    ? ('success' as const)
    : s === 'Paused'
      ? ('warning' as const)
      : ('neutral' as const);

const COLUMNS: DataGridColumn<Row>[] = [
  {
    key: 'name',
    header: 'Project',
    sortable: true,
    cell: (r) => <span className="font-medium">{r.name}</span>,
  },
  {
    key: 'owner',
    header: 'Owner',
    sortable: true,
    cell: (r) => (
      <span className="flex items-center gap-2">
        <Avatar size="xs" fallback={r.initials} />
        {r.owner}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (r) => (
      <Badge tone={tone(r.status)} dot>
        {r.status}
      </Badge>
    ),
  },
  {
    key: 'spend',
    header: 'Spend / mo',
    sortable: true,
    align: 'right',
    cell: (r) => <span className="tabular">${r.spend.toLocaleString()}</span>,
  },
  { key: 'updated', header: 'Updated', align: 'right', width: '110px' },
];

function FullDemo() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({
    key: 'spend',
    direction: 'desc',
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = ROWS.filter(
      (r) => !q || r.name.toLowerCase().includes(q) || r.owner.toLowerCase().includes(q),
    );
    if (sort) {
      const dir = sort.direction === 'asc' ? 1 : -1;
      out = [...out].sort((a, b) => {
        const av = a[sort.key as keyof Row];
        const bv = b[sort.key as keyof Row];
        return (
          (typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv))) *
          dir
        );
      });
    }
    return out;
  }, [query, sort]);

  return (
    <DataGrid
      className="w-full"
      columns={COLUMNS}
      rows={rows}
      sort={sort}
      onSortChange={setSort}
      filter={{ value: query, onChange: setQuery, placeholder: 'Filter projects…' }}
      emptyState={
        <EmptyState
          title="No projects match"
          description={`Nothing matches “${query}”. Try a different name or owner.`}
          action={
            <Button variant="outline" size="sm" onClick={() => setQuery('')}>
              Clear filter
            </Button>
          }
        />
      }
    />
  );
}

function LoadingDemo() {
  return <DataGrid className="w-full" columns={COLUMNS} rows={[]} loading />;
}

function ColumnVisibilityDemo() {
  const [visibility, setVisibility] = useState<Record<string, boolean>>({
    owner: true,
    updated: false,
  });
  const toggle = (key: string) => (v: boolean | 'indeterminate') =>
    setVisibility((s) => ({ ...s, [key]: v === true }));
  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap gap-4">
        <Checkbox
          checked={visibility.owner ?? true}
          onCheckedChange={toggle('owner')}
          label="Owner"
        />
        <Checkbox
          checked={visibility.status ?? true}
          onCheckedChange={toggle('status')}
          label="Status"
        />
        <Checkbox
          checked={visibility.updated ?? true}
          onCheckedChange={toggle('updated')}
          label="Updated"
        />
      </div>
      <DataGrid
        className="w-full"
        columns={COLUMNS}
        rows={ROWS.slice(0, 4)}
        columnVisibility={visibility}
        onColumnVisibilityChange={setVisibility}
      />
    </div>
  );
}

const doc: ComponentDoc = {
  slug: 'data-grid',
  name: 'DataGrid',
  group: 'Data Display',
  description:
    'Sortable, filterable, column-visibility table. Stateless — pass in rows + columns and handle interactions in your own state. Pair with Pagination for large lists.',
  exports: ['DataGrid', 'DataGridColumn'],
  i18n: 'Reads `dataGrid.filterPlaceholder`, `dataGrid.empty`, `dataGrid.columns`, `dataGrid.columnVisibility`, `dataGrid.filterRows`.',
  sourceFile: 'DataGrid.tsx',
  examples: [
    {
      title: 'Full grid',
      description:
        'Filter input, sortable headers, custom cells (avatars, badges, tabular money), right-aligned numerics, column visibility via the ⋯ menu, and a real empty state — type something that matches nothing.',
      preview: <FullDemo />,
      code: `const [query, setQuery] = useState('');
const [sort, setSort] = useState({ key: 'spend', direction: 'desc' });
const rows = useMemo(() => sortAndFilter(ROWS, query, sort), [query, sort]);

<DataGrid
  columns={[
    { key: 'name',   header: 'Project',   sortable: true },
    { key: 'owner',  header: 'Owner',     sortable: true, cell: (r) => <OwnerCell {...r} /> },
    { key: 'status', header: 'Status',    cell: (r) => <Badge tone={tone(r.status)} dot>{r.status}</Badge> },
    { key: 'spend',  header: 'Spend / mo', sortable: true, align: 'right' },
    { key: 'updated', header: 'Updated',  align: 'right', width: '110px' },
  ]}
  rows={rows}
  sort={sort}
  onSortChange={setSort}
  filter={{ value: query, onChange: setQuery, placeholder: 'Filter projects…' }}
  emptyState={<EmptyState title="No projects match" action={<Button onClick={clear}>Clear filter</Button>} />}
/>`,
    },
    {
      title: 'Loading',
      description: 'Pass loading to render skeleton rows — column widths hold the grid shape.',
      preview: <LoadingDemo />,
      code: `<DataGrid columns={columns} rows={[]} loading />`,
    },
    {
      title: 'States',
      description:
        '`loading` swaps rows for Skeletons while keeping column widths; `emptyState` renders inside the body when `rows` is empty — use different copy for first-run vs. filtered.',
      preview: (
        <div className="grid w-full gap-6">
          <DataGrid className="w-full" columns={COLUMNS} rows={[]} loading />
          <DataGrid
            className="w-full"
            columns={COLUMNS}
            rows={[]}
            emptyState={
              <EmptyState
                icon={<Search className="size-6" />}
                title="No members match"
                description="Adjust the search or clear the filter."
                action={
                  <Button variant="outline" size="sm">
                    Clear filters
                  </Button>
                }
                className="border-0 bg-transparent"
              />
            }
          />
        </div>
      ),
      code: `{/* Loading */}
<DataGrid columns={columns} rows={[]} loading />

{/* Filtered empty — keep the header so the user can clear filters */}
<DataGrid
  columns={columns}
  rows={[]}
  emptyState={
    <EmptyState
      icon={<Search className="size-6" />}
      title="No members match"
      description="Adjust the search or clear the filter."
      action={<Button variant="outline" size="sm">Clear filters</Button>}
    />
  }
/>`,
    },
    {
      title: 'Controlled column visibility',
      description:
        'Own the visibility map with `columnVisibility` / `onColumnVisibilityChange` to persist it (URL, localStorage, user prefs) or to drive it from UI outside the grid. The built-in ⋯ menu keeps working and calls the same handler.',
      preview: <ColumnVisibilityDemo />,
      code: `const [visibility, setVisibility] = useState({ owner: true, updated: false });

<Checkbox
  checked={visibility.owner}
  onCheckedChange={(v) => setVisibility((s) => ({ ...s, owner: v === true }))}
  label="Owner"
/>
<DataGrid
  columns={columns}
  rows={rows}
  columnVisibility={visibility}
  onColumnVisibilityChange={setVisibility}
/>`,
    },
  ],
  api: [
    {
      title: 'DataGrid props',
      rows: [
        {
          name: 'rows',
          type: 'T[]',
          required: true,
          description: 'Row data. Each row must have a stable id.',
        },
        {
          name: 'columns',
          type: 'DataGridColumn<T>[]',
          required: true,
          description: 'Column descriptors.',
        },
        {
          name: 'sort',
          type: `{ key: string; direction: 'asc' | 'desc' } | null`,
          description: 'Controlled sort state.',
        },
        {
          name: 'onSortChange',
          type: '(sort) => void',
          description: 'Fires when a sortable header is clicked.',
        },
        {
          name: 'filter',
          type: '{ value, onChange, placeholder? }',
          description: 'Renders the filter input row above the grid.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: 'Skeleton rows while data loads.',
        },
        {
          name: 'emptyState',
          type: 'ReactNode',
          description: 'Shown when rows is empty (and not loading).',
        },
      ],
    },
    {
      title: 'DataGridColumn<T>',
      rows: [
        {
          name: 'key',
          type: 'string',
          required: true,
          description: 'Stable key for visibility, sort, and React lists.',
        },
        { name: 'header', type: 'ReactNode', required: true, description: 'Header label.' },
        {
          name: 'sortable',
          type: 'boolean',
          default: 'false',
          description: 'Render as a TableSortHeader.',
        },
        {
          name: 'cell',
          type: '(row: T) => ReactNode',
          description: 'Custom cell renderer; defaults to row[key].',
        },
        {
          name: 'align',
          type: `'left' | 'right'`,
          default: `'left'`,
          description: 'Right-align numeric / monetary columns.',
        },
        {
          name: 'width',
          type: 'string',
          description: 'CSS width (e.g. "120px", "20%") — keeps shape while loading.',
        },
      ],
    },
  ],
  accessibility: [
    'Renders a native <table> with <thead>/<tbody>, so screen readers announce row/column context.',
    'Sortable headers expose aria-sort; the filter input has an accessible label.',
    'Loading rows are aria-hidden Skeletons — the grid keeps its column layout so focus does not jump.',
  ],
  keyboard: [
    {
      key: 'Tab / Shift+Tab',
      action:
        'Move through the filter input, the column-visibility button and each sortable header.',
    },
    {
      key: 'Enter / Space',
      action: 'On a sortable header: sort by that column; press again to flip asc ↔ desc.',
    },
    {
      key: 'Enter / Space / ArrowDown',
      action: 'On the column-visibility button: open the columns menu.',
    },
    { key: 'ArrowDown / ArrowUp', action: 'Move between columns in the menu.' },
    {
      key: 'Enter / Space',
      action:
        'Toggle the highlighted column and close the menu (the last visible column cannot be hidden).',
    },
    { key: 'Esc', action: 'Close the menu without changes.' },
  ],
  states: [
    {
      name: 'Loading',
      how: '`loading` renders five skeleton rows; column widths are kept so nothing jumps.',
    },
    {
      name: 'Error',
      how: '`error` node replaces the rows in a role="alert" cell (use ErrorState with `onRetry`). Wins over `emptyState`; `loading` wins over both.',
    },
    {
      name: 'Empty',
      how: '`emptyState` node when `rows` is empty; defaults to the "No results" string.',
    },
    { name: 'Permission denied', how: 'Pass `<ErrorState variant="403" />` as `error`.' },
  ],
  related: [
    { slug: 'pagination', reason: 'For paginated tables.' },
    { slug: 'table', reason: 'For simple static tables.' },
  ],
};

export default doc;
