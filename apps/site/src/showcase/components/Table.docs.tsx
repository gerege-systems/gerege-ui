import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSortHeader,
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { MoreHorizontal } from '@/icons';
import type { ComponentDoc } from '../registry/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Inbox } from '@/icons';

const INVOICES = [
  {
    id: 'INV-0042',
    customer: 'Northwind',
    status: 'Paid',
    tone: 'success' as const,
    amount: 1250.0,
  },
  {
    id: 'INV-0041',
    customer: 'Acme Corp',
    status: 'Pending',
    tone: 'warning' as const,
    amount: 860.5,
  },
  { id: 'INV-0040', customer: 'Globex', status: 'Paid', tone: 'success' as const, amount: 3120.0 },
  {
    id: 'INV-0039',
    customer: 'Initech',
    status: 'Overdue',
    tone: 'danger' as const,
    amount: 440.0,
  },
  {
    id: 'INV-0038',
    customer: 'Umbrella',
    status: 'Refunded',
    tone: 'neutral' as const,
    amount: 199.99,
  },
];

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function InvoicesDemo() {
  const total = INVOICES.reduce((sum, i) => sum + i.amount, 0);
  return (
    <Table className="w-full max-w-2xl">
      <TableCaption>Latest invoices, updated hourly.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-10" aria-label="Actions" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVOICES.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell className="font-medium">{inv.id}</TableCell>
            <TableCell>{inv.customer}</TableCell>
            <TableCell>
              <Badge tone={inv.tone} dot>
                {inv.status}
              </Badge>
            </TableCell>
            <TableCell className="tabular text-right">{fmt(inv.amount)}</TableCell>
            <TableCell>
              <IconButton
                aria-label={`Actions for ${inv.id}`}
                icon={<MoreHorizontal />}
                variant="ghost"
                size="sm"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="tabular text-right">{fmt(total)}</TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );
}

function TableStatesDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-6">
      <Table>
        <TableCaption>Loading</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton variant="text" className="w-20" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" className="w-32" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton variant="text" className="ml-auto w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table>
        <TableCaption>Empty (filtered)</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} className="p-0">
              <EmptyState
                icon={<Inbox className="size-6" />}
                title="No invoices match"
                description="Try another customer or clear the filters."
                action={
                  <Button variant="outline" size="sm">
                    Clear filters
                  </Button>
                }
                className="rounded-none border-0"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

type Sort = { key: string; direction: 'asc' | 'desc' } | null;

function SortableDemo() {
  const [sort, setSort] = useState<Sort>({ key: 'amount', direction: 'desc' });

  const rows = useMemo(() => {
    if (!sort) return INVOICES;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...INVOICES].sort((a, b) => {
      const av = a[sort.key as 'customer' | 'amount'];
      const bv = b[sort.key as 'customer' | 'amount'];
      return (
        (typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv))) * dir
      );
    });
  }, [sort]);

  const onSort = (key: string, direction: 'asc' | 'desc') => setSort({ key, direction });

  return (
    <Table className="w-full max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableSortHeader sortKey="customer" currentSort={sort} onSortChange={onSort}>
            Customer
          </TableSortHeader>
          <TableSortHeader
            sortKey="amount"
            currentSort={sort}
            onSortChange={onSort}
            className="text-right"
          >
            Amount
          </TableSortHeader>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell className="font-medium">{inv.id}</TableCell>
            <TableCell>{inv.customer}</TableCell>
            <TableCell className="tabular text-right">{fmt(inv.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const doc: ComponentDoc = {
  slug: 'table',
  name: 'Table',
  group: 'Data Display',
  description:
    'Semantic HTML table with refined-minimal styling. Use for simple data; for sorting, filtering, and column visibility, reach for DataGrid.',
  exports: [
    'Table',
    'TableHeader',
    'TableBody',
    'TableFooter',
    'TableRow',
    'TableHead',
    'TableCell',
    'TableCaption',
    'TableSortHeader',
  ],
  sourceFile: 'Table.tsx',
  examples: [
    {
      title: 'Invoices',
      description:
        'The full anatomy: caption, header, status badges, right-aligned tabular numbers, a row-actions column, and a footer with the total.',
      preview: <InvoicesDemo />,
      code: `<Table>
  <TableCaption>Latest invoices, updated hourly.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
      <TableHead className="w-10" aria-label="Actions" />
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((inv) => (
      <TableRow key={inv.id}>
        <TableCell className="font-medium">{inv.id}</TableCell>
        <TableCell>{inv.customer}</TableCell>
        <TableCell><Badge tone={inv.tone} dot>{inv.status}</Badge></TableCell>
        <TableCell className="text-right tabular">{fmt(inv.amount)}</TableCell>
        <TableCell>
          <IconButton aria-label="Actions" icon={<MoreHorizontal />} variant="ghost" size="sm" />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={3}>Total</TableCell>
      <TableCell className="text-right tabular">{fmt(total)}</TableCell>
      <TableCell />
    </TableRow>
  </TableFooter>
</Table>`,
    },
    {
      title: 'Sortable columns',
      description:
        'TableSortHeader owns the asc/desc visuals; you own the state and the actual sort. Click Customer or Amount.',
      preview: <SortableDemo />,
      code: `const [sort, setSort] = useState({ key: 'amount', direction: 'desc' });
const rows = useMemo(() => sortRows(invoices, sort), [sort]);

<TableHeader>
  <TableRow>
    <TableHead>Invoice</TableHead>
    <TableSortHeader sortKey="customer" currentSort={sort}
                     onSortChange={(key, direction) => setSort({ key, direction })}>
      Customer
    </TableSortHeader>
    <TableSortHeader sortKey="amount" currentSort={sort}
                     onSortChange={(key, direction) => setSort({ key, direction })}>
      Amount
    </TableSortHeader>
  </TableRow>
</TableHeader>`,
    },
    {
      title: 'States',
      description:
        'Loading = Skeleton rows with the final column shape; empty = a single row hosting a compact EmptyState so the header and filters stay in place.',
      preview: <TableStatesDemo />,
      code: `{/* Loading */}
<TableBody>
  {Array.from({ length: 3 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton variant="text" className="w-20" /></TableCell>
      <TableCell><Skeleton variant="text" className="w-32" /></TableCell>
      <TableCell className="text-right"><Skeleton variant="text" className="ml-auto w-16" /></TableCell>
    </TableRow>
  ))}
</TableBody>

{/* Empty (filtered) */}
<TableBody>
  <TableRow>
    <TableCell colSpan={3} className="p-0">
      <EmptyState
        icon={<Inbox className="size-6" />}
        title="No invoices match"
        description="Try another customer or clear the filters."
        action={<Button variant="outline" size="sm">Clear filters</Button>}
        className="rounded-none border-0"
      />
    </TableCell>
  </TableRow>
</TableBody>`,
    },
    {
      title: 'Numeric alignment',
      description:
        '`align="right"` on TableHead + TableCell right-aligns the column and applies tabular figures so digits line up — use it for every numeric column instead of `className="text-right"`.',
      preview: (
        <Table className="w-full max-w-md">
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead align="right">Seats</TableHead>
              <TableHead align="right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ['Starter', 3, 2900],
              ['Team', 25, 49000],
              ['Enterprise', 1200, 1250000],
            ].map(([plan, seats, amount]) => (
              <TableRow key={plan}>
                <TableCell>{plan}</TableCell>
                <TableCell align="right">{seats}</TableCell>
                <TableCell align="right">{fmt(amount as number)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ),
      code: `<TableHead align="right">Amount</TableHead>
…
<TableCell align="right">{fmt(row.amount)}</TableCell>`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'Table / TableHeader / TableBody / …',
          type: 'component',
          description: 'Thin styled wrappers around the corresponding HTML elements.',
        },
        {
          name: 'TableSortHeader',
          type: 'component',
          description: 'Header cell with built-in asc/desc/none cycle button.',
        },
        {
          name: 'sortKey',
          type: 'string',
          description: 'TableSortHeader: stable column key reported to onSortChange.',
        },
        {
          name: 'currentSort',
          type: `{ key: string; direction: 'asc' | 'desc' } | null`,
          description: 'TableSortHeader: controlled sort state.',
        },
        {
          name: 'onSortChange',
          type: `(key, direction) => void`,
          description: 'TableSortHeader: fires on header click.',
        },
      ],
    },
  ],
  keyboard: [
    { key: 'Tab / Shift+Tab', action: 'Move to each TableSortHeader button and any row actions.' },
    {
      key: 'Enter / Space',
      action: 'On a sort header: sort by that column; press again to flip asc ↔ desc.',
    },
  ],
  guidelines: {
    do: [
      'Right-align numbers, dates and money with the `tabular` class; left-align text.',
      'Use `TableSortHeader` so the sorted column and direction are visible.',
      'Keep row actions to ≤ 2 inline icons; move the rest into an overflow menu with Delete last.',
      'Render an explicit empty row (EmptyState) and a Skeleton row set while loading.',
    ],
    dont: [
      'Leave empty cells blank — show "—" so a missing value reads as intentional.',
      'Zebra-stripe and border every cell; hairline row dividers are enough.',
      'Truncate text without a `title` or tooltip revealing the full value.',
      'Make a whole row clickable without `stopPropagation` on the row actions.',
    ],
  },
  accessibility: [
    'Native <table> semantics — screen readers get row/column navigation for free; use <TableCaption> to name the table.',
    'TableSortHeader renders a real <button> with aria-sort on the <th>, so sort state is announced.',
    'Icon-only row actions need an `aria-label`; the action column header should be labelled even if visually empty.',
  ],
  related: [{ slug: 'data-grid', reason: 'For sortable, filterable tables.' }],
};

export default doc;
