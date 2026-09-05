import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Tree } from './Tree';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

const data = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'index.ts', label: 'index.ts' },
      { id: 'app.tsx', label: 'app.tsx' },
    ],
  },
  { id: 'readme', label: 'README.md' },
];

describe('Tree', () => {
  it('exposes APG tree semantics with a single tab stop', () => {
    render(<Tree aria-label="Files" data={data} defaultExpanded={['src']} />);
    const items = screen.getAllByRole('treeitem');
    expect(items).toHaveLength(4);
    expect(items.filter((i) => i.tabIndex === 0)).toHaveLength(1);
    expect(items[0]).toHaveAttribute('aria-expanded', 'true');
    expect(items[0]).toHaveAttribute('aria-level', '1');
    expect(items[0]).toHaveAttribute('aria-setsize', '2');
    expect(items[0]).toHaveAttribute('aria-posinset', '1');
    expect(items[1]).toHaveAttribute('aria-level', '2');
    expect(items[1]).toHaveAttribute('aria-posinset', '1');
    expect(items[1]).toHaveAttribute('aria-setsize', '2');
    expect(screen.getByRole('group')).toBeInTheDocument();
    // Leaves have no aria-expanded.
    expect(screen.getByRole('treeitem', { name: 'README.md' })).not.toHaveAttribute(
      'aria-expanded',
    );
  });

  it('navigates with arrows, Home/End, and selects with Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Tree aria-label="Files" data={data} onSelect={onSelect} />);
    const [src, readme] = screen.getAllByRole('treeitem');
    await user.tab();
    expect(src).toHaveFocus();
    expect(src).toHaveAttribute('aria-expanded', 'false');

    await user.keyboard('{ArrowRight}');
    expect(src).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('treeitem')).toHaveLength(4);

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('treeitem', { name: 'index.ts' })).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(src).toHaveFocus();

    await user.keyboard('{End}');
    expect(readme).toHaveFocus();
    await user.keyboard('{Home}');
    expect(src).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(src).toHaveAttribute('aria-expanded', 'false');

    await user.keyboard('{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledWith('readme');
    expect(readme).toHaveAttribute('aria-selected', 'true');
  });

  it('ArrowRight on an open folder moves into the first child; Space selects + toggles a folder', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(<Tree aria-label="Files" data={data} onSelectedChange={onSelectedChange} />);
    await user.tab();
    const src = screen.getByRole('treeitem', { name: /src/ });
    await user.keyboard(' ');
    expect(onSelectedChange).toHaveBeenCalledWith('src');
    expect(src).toHaveAttribute('aria-selected', 'true');
    expect(src).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('treeitem', { name: 'index.ts' })).toHaveFocus();
    // Tab leaves the tree — only one tab stop.
    await user.tab();
    expect(screen.queryAllByRole('treeitem').some((i) => i === document.activeElement)).toBe(false);
  });

  it('uncontrolled selection: defaultSelected becomes the tab stop and click moves it', async () => {
    const user = userEvent.setup();
    render(<Tree aria-label="Files" data={data} defaultSelected="readme" />);
    const readme = screen.getByRole('treeitem', { name: 'README.md' });
    expect(readme).toHaveAttribute('aria-selected', 'true');
    expect(readme.tabIndex).toBe(0);
    await user.click(screen.getByText('src'));
    expect(screen.getByRole('treeitem', { name: /src/ })).toHaveAttribute('aria-selected', 'true');
    expect(readme).toHaveAttribute('aria-selected', 'false');
  });

  it('supports controlled expanded + selected', async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    function Demo() {
      const [expanded, setExpanded] = useState<string[]>([]);
      const [selected, setSelected] = useState<string>();
      return (
        <Tree
          aria-label="Files"
          data={data}
          expanded={expanded}
          onExpandedChange={(next) => {
            onExpandedChange(next);
            setExpanded(next);
          }}
          selected={selected}
          onSelectedChange={setSelected}
        />
      );
    }
    render(<Demo />);
    await user.click(screen.getByText('src'));
    expect(onExpandedChange).toHaveBeenCalledWith(['src']);
    expect(screen.getByRole('treeitem', { name: /src/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('treeitem', { name: /src/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('controlled selected without a state update does not change; expanded prop is authoritative', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <Tree
        aria-label="Files"
        data={data}
        expanded={[]}
        selected="readme"
        onSelectedChange={onSelectedChange}
      />,
    );
    await user.click(screen.getByText('src'));
    expect(onSelectedChange).toHaveBeenCalledWith('src');
    expect(screen.getByRole('treeitem', { name: /src/ })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('treeitem', { name: /src/ })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('treeitem', { name: 'README.md' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('legacy selectedId + onSelect API still works and is controlled', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Tree aria-label="Files" data={data} selectedId="readme" onSelect={onSelect} />);
    expect(screen.getByRole('treeitem', { name: 'README.md' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await user.click(screen.getByText('src'));
    expect(onSelect).toHaveBeenCalledWith('src');
    expect(screen.getByRole('treeitem', { name: 'README.md' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('labels: default "Tree", aria-labelledby suppresses the default, provider gives Mongolian', () => {
    const { unmount } = render(<Tree data={data} />);
    expect(screen.getByRole('tree', { name: 'Tree' })).toBeInTheDocument();
    unmount();
    render(
      <>
        <h2 id="h">Project</h2>
        <Tree data={data} aria-labelledby="h" />
      </>,
    );
    const tree = screen.getByRole('tree', { name: 'Project' });
    expect(tree).not.toHaveAttribute('aria-label');
    unmount();
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Tree data={data} />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('tree', { name: 'Мод' })).toBeInTheDocument();
  });

  it('renders custom icons and empty folders', () => {
    render(
      <Tree
        aria-label="F"
        data={[
          { id: 'a', label: 'A', icon: <svg data-testid="icon" /> },
          { id: 'b', label: 'B', children: [] },
        ]}
      />,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    // Custom icon sits in the same 16px box as the default file/folder icons.
    expect(screen.getByTestId('icon').parentElement?.className).toContain('[&_svg]:size-4');
    expect(screen.getByRole('treeitem', { name: 'B' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('forwards ref, merges className, spreads props', () => {
    const ref = createRef<HTMLUListElement>();
    render(<Tree ref={ref} aria-label="F" data={data} className="w-64" data-testid="tree" />);
    expect(ref.current).toBe(screen.getByRole('tree'));
    expect(ref.current).toHaveClass('w-64', 'flex-col');
    expect(ref.current).toHaveAttribute('data-testid', 'tree');
  });

  it('is axe-clean', async () => {
    const { container } = render(<Tree aria-label="Files" data={data} defaultExpanded={['src']} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
