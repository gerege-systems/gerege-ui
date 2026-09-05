import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { DataGrid, type DataGridColumn } from './DataGrid';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

type Row = { id: number; name: string; amount: number | null; updatedAt?: Date; note?: string };

const rows: Row[] = [
  { id: 1, name: 'Alpha', amount: 10, updatedAt: new Date(Date.UTC(2024, 0, 15, 10, 30)) },
  { id: 2, name: 'Beta', amount: null, note: '' },
];

const columns: DataGridColumn<Row>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'amount', header: 'Amount', align: 'right', width: '8rem' },
  { key: 'updatedAt', header: 'Updated' },
  { key: 'note', header: 'Note' },
  { key: 'computed', header: 'Computed', cell: (r) => <b>{r.name.toUpperCase()}</b> },
];

describe('DataGrid', () => {
  it('renders headers, rows, custom cells and column widths', () => {
    const { container } = render(<DataGrid columns={columns} rows={rows} />);
    expect(screen.getAllByRole('columnheader')).toHaveLength(5);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('ALPHA').tagName).toBe('B');
    expect(container.querySelectorAll('colgroup col')).toHaveLength(5);
    // Inline style, not computed: jsdom 30 resolves rem to px in getComputedStyle.
    expect((container.querySelectorAll('colgroup col')[1] as HTMLElement).style.width).toBe('8rem');
  });

  it('default cell rendering: Date formatted, null / undefined / "" as a labelled em dash', () => {
    render(<DataGrid columns={columns} rows={rows} />);
    // Asia/Ulaanbaatar is UTC+8
    expect(screen.getByText('2024-01-15 18:30')).toBeInTheDocument();
    const dashes = screen.getAllByLabelText('Empty');
    // Alpha: note undefined; Beta: amount null, updatedAt undefined, note '' → 4 dashes
    expect(dashes).toHaveLength(4);
    dashes.forEach((d) => expect(d).toHaveTextContent('—'));
  });

  it('right-aligned column applies to header and cells', () => {
    render(<DataGrid columns={columns} rows={rows} />);
    const header = screen.getByRole('columnheader', { name: 'Amount' });
    expect(header).toHaveClass('text-right');
    const cell = screen.getByText('10').closest('td')!;
    expect(cell).toHaveClass('text-right');
  });

  it('sortable header calls onSortChange and reflects aria-sort from `sort`', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    const { rerender } = render(
      <DataGrid columns={columns} rows={rows} sort={null} onSortChange={onSortChange} />,
    );
    const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
    expect(nameHeader).not.toHaveAttribute('aria-sort');
    await user.click(within(nameHeader).getByRole('button'));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
    rerender(
      <DataGrid
        columns={columns}
        rows={rows}
        sort={{ key: 'name', direction: 'asc' }}
        onSortChange={onSortChange}
      />,
    );
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await user.click(
      within(screen.getByRole('columnheader', { name: /Name/ })).getByRole('button'),
    );
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'desc' });
    // non-sortable column has no button
    expect(
      within(screen.getByRole('columnheader', { name: 'Amount' })).queryByRole('button'),
    ).toBeNull();
  });

  it('sortable columns are plain headers without onSortChange', () => {
    render(<DataGrid columns={columns} rows={rows} />);
    expect(
      within(screen.getByRole('columnheader', { name: 'Name' })).queryByRole('button'),
    ).toBeNull();
  });

  it('filter input is labelled, controlled, and clearable', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <DataGrid columns={columns} rows={rows} filter={{ value: '', onChange }} />,
    );
    const input = screen.getByRole('searchbox', { name: 'Filter rows' });
    expect(input).toHaveAttribute('placeholder', 'Filter…');
    await user.type(input, 'a');
    expect(onChange).toHaveBeenCalledWith('a');
    rerender(
      <DataGrid
        columns={columns}
        rows={rows}
        filter={{ value: 'abc', onChange, placeholder: 'Find' }}
      />,
    );
    expect(screen.getByRole('searchbox')).toHaveValue('abc');
    expect(screen.getByRole('searchbox')).toHaveAttribute('placeholder', 'Find');
    await user.click(screen.getByRole('button', { name: 'Clear input' }));
    expect(onChange).toHaveBeenLastCalledWith('');
  });

  it('loading renders skeleton rows sized to the visible columns', () => {
    const { container } = render(<DataGrid columns={columns} rows={rows} loading />);
    const bodyRows = container.querySelectorAll('tbody tr');
    expect(bodyRows).toHaveLength(5);
    expect(bodyRows[0].querySelectorAll('td')).toHaveLength(5);
    expect(screen.queryByText('Alpha')).toBeNull();
  });

  it('empty rows show the default empty state spanning all columns, or a custom node', () => {
    const { container, rerender } = render(<DataGrid columns={columns} rows={[]} />);
    const cell = container.querySelector('tbody td')!;
    expect(cell).toHaveAttribute('colspan', '5');
    expect(cell).toHaveTextContent('No results.');
    rerender(<DataGrid columns={columns} rows={[]} emptyState={<em>Nothing here</em>} />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('empty state colSpan is at least 1 even when all columns are hidden via props', () => {
    const { container } = render(
      <DataGrid
        columns={columns}
        rows={[]}
        columnVisibility={Object.fromEntries(columns.map((c) => [c.key, false]))}
      />,
    );
    expect(container.querySelector('tbody td')).toHaveAttribute('colspan', '1');
  });

  describe('column visibility', () => {
    it('uncontrolled: toggling hides the column; the last visible column cannot be hidden', async () => {
      const user = userEvent.setup();
      const two: DataGridColumn<Row>[] = columns.slice(0, 2);
      render(<DataGrid columns={two} rows={rows} />);
      const trigger = screen.getByRole('button', { name: 'Column visibility' });
      await user.click(trigger);
      expect(await screen.findByText('Columns')).toBeInTheDocument();
      const nameItem = screen.getByRole('menuitemcheckbox', { name: 'Name' });
      expect(nameItem).toHaveAttribute('aria-checked', 'true');
      await user.click(nameItem);
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
      expect(screen.queryByRole('columnheader', { name: 'Name' })).toBeNull();
      expect(screen.getAllByRole('columnheader')).toHaveLength(1);

      await user.click(trigger);
      const amountItem = await screen.findByRole('menuitemcheckbox', { name: 'Amount' });
      expect(amountItem).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByRole('menuitemcheckbox', { name: 'Name' })).toHaveAttribute(
        'aria-checked',
        'false',
      );
      await user.click(screen.getByRole('menuitemcheckbox', { name: 'Name' }));
      await waitFor(() => expect(screen.getAllByRole('columnheader')).toHaveLength(2));
    });

    it('controlled: columnVisibility drives rendering and onColumnVisibilityChange reports the next map', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <DataGrid
          columns={columns}
          rows={rows}
          columnVisibility={{ note: false }}
          onColumnVisibilityChange={onChange}
        />,
      );
      expect(screen.queryByRole('columnheader', { name: 'Note' })).toBeNull();
      expect(screen.getAllByRole('columnheader')).toHaveLength(4);
      await user.click(screen.getByRole('button', { name: 'Column visibility' }));
      await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Name' }));
      expect(onChange).toHaveBeenCalledWith({ note: false, name: false });
      // parent did not update → still 4 columns
      expect(screen.getAllByRole('columnheader')).toHaveLength(4);
    });

    it('controlled round-trip', async () => {
      const user = userEvent.setup();
      function Demo() {
        const [v, setV] = useState<Record<string, boolean>>({});
        return (
          <DataGrid
            columns={columns}
            rows={rows}
            columnVisibility={v}
            onColumnVisibilityChange={setV}
          />
        );
      }
      render(<Demo />);
      await user.click(screen.getByRole('button', { name: 'Column visibility' }));
      await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Updated' }));
      await waitFor(() => expect(screen.getAllByRole('columnheader')).toHaveLength(4));
      expect(screen.queryByText('2024-01-15 18:30')).toBeNull();
    });
  });

  it('applies className to the root', () => {
    const { container } = render(<DataGrid columns={columns} rows={rows} className="extra" />);
    expect(container.firstElementChild).toHaveClass('extra', 'flex-col');
  });

  it('localises filter, empty state, empty cell and menu labels', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <DesignSystemProvider strings={mnStrings}>
        <DataGrid columns={columns} rows={rows} filter={{ value: '', onChange: () => {} }} />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('searchbox', { name: mnStrings.dataGrid.filterRows })).toHaveAttribute(
      'placeholder',
      mnStrings.dataGrid.filterPlaceholder,
    );
    expect(screen.getAllByLabelText(mnStrings.dataGrid.emptyCell).length).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: mnStrings.dataGrid.columnVisibility }));
    expect(await screen.findByText(mnStrings.dataGrid.columns)).toBeInTheDocument();
    await user.keyboard('{Escape}');
    rerender(
      <DesignSystemProvider strings={mnStrings}>
        <DataGrid columns={columns} rows={[]} />
      </DesignSystemProvider>,
    );
    expect(screen.getByText(mnStrings.dataGrid.empty)).toBeInTheDocument();
  });

  it('table scroll wrapper is focusable and named', () => {
    render(<DataGrid columns={columns} rows={rows} />);
    const wrapper = screen.getByRole('table').parentElement as HTMLElement;
    expect(wrapper).toHaveAttribute('tabindex', '0');
    expect(wrapper).toHaveAccessibleName('Scrollable table');
    expect(wrapper).toHaveClass('overflow-auto', 'rounded-lg');
  });

  it('is axe-clean with data, loading and empty', async () => {
    const onSortChange = vi.fn();
    const { container } = render(
      <div>
        <DataGrid
          columns={columns}
          rows={rows}
          filter={{ value: '', onChange: () => {} }}
          sort={{ key: 'name', direction: 'asc' }}
          onSortChange={onSortChange}
        />
        <DataGrid columns={columns} rows={rows} loading />
        <DataGrid columns={columns} rows={[]} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
