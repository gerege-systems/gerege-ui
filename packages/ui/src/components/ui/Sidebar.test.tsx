import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Sidebar, SidebarGroup, SidebarItem, SidebarSection, useSidebar } from './Sidebar';
import { TooltipProvider } from './Tooltip';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

function CollapsedProbe() {
  const { collapsed } = useSidebar();
  return <output data-testid="collapsed">{String(collapsed)}</output>;
}

function Demo(props: {
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (c: boolean) => void;
  'aria-label'?: string;
}) {
  return (
    <TooltipProvider>
      <Sidebar {...props} header={<CollapsedProbe />} footer={<span>v1</span>}>
        <SidebarSection label="Workspace">
          <SidebarItem href="/" active trailing={<span>3</span>}>
            Home
          </SidebarItem>
          <SidebarItem onClick={() => {}}>Projects</SidebarItem>
        </SidebarSection>
      </Sidebar>
    </TooltipProvider>
  );
}

describe('Sidebar', () => {
  it('collapsed rail renders without an app-level TooltipProvider', () => {
    // Regression: Radix Tooltip throws outside a provider, so a collapsed
    // Sidebar crashed any app that had not mounted one at the root.
    render(
      <Sidebar defaultCollapsed>
        <SidebarItem href="/">Home</SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });

  it('renders a nav labelled "Primary" with header, footer and labelled section list', () => {
    render(<Demo />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(nav).toHaveClass('w-60');
    expect(screen.getByText('v1')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.getByTestId('collapsed')).toHaveTextContent('false');
  });

  it('keeps a consumer aria-label', () => {
    render(<Demo aria-label="App" />);
    expect(screen.getByRole('navigation', { name: 'App' })).toBeInTheDocument();
  });

  it('href renders <a> with aria-current; no href renders <button type=button>', () => {
    render(<Demo />);
    const home = screen.getByRole('link', { name: /Home/ });
    expect(home).toHaveAttribute('href', '/');
    expect(home).toHaveAttribute('aria-current', 'page');
    expect(home).toHaveClass('font-medium');
    expect(home).toHaveTextContent('3');
    const projects = screen.getByRole('button', { name: 'Projects' });
    expect(projects).toHaveAttribute('type', 'button');
    expect(projects).not.toHaveAttribute('aria-current');
  });

  it('uncontrolled collapse toggles width, labels, trailing and section label', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const toggle = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveTextContent('Collapse');
    await user.click(toggle);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('w-14');
    const expand = screen.getByRole('button', { name: 'Expand sidebar' });
    expect(expand).toHaveAttribute('aria-expanded', 'false');
    expect(expand).not.toHaveTextContent('Collapse');
    expect(screen.getByTestId('collapsed')).toHaveTextContent('true');
    expect(screen.getByText('Workspace')).toHaveClass('sr-only');
    expect(screen.queryByText('3')).toBeNull();
    // Collapsed items keep their accessible name via the tooltip trigger.
    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('justify-center');
  });

  it('defaultCollapsed starts collapsed', () => {
    render(<Demo defaultCollapsed />);
    expect(screen.getByRole('navigation')).toHaveClass('w-14');
  });

  it('controlled collapsed: calls onCollapsedChange and does not change on its own', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Demo collapsed={false} onCollapsedChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('navigation')).toHaveClass('w-60');
  });

  it('uses Mongolian strings from the provider', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Demo />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('navigation', { name: 'Үндсэн цэс' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Хажуугийн самбарыг хураах' })).toHaveTextContent(
      'Хураах',
    );
  });

  it('forwards ref, merges className, spreads props', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Sidebar ref={ref} className="border-0" data-testid="sb">
        <SidebarSection>
          <SidebarItem href="/">A</SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    expect(ref.current).toBe(screen.getByRole('navigation'));
    expect(ref.current).toHaveClass('border-0', 'sticky');
    expect(ref.current).toHaveAttribute('data-testid', 'sb');
  });

  it('is axe-clean expanded and collapsed', async () => {
    const a = render(<Demo />);
    expect(await axe(a.container)).toHaveNoViolations();
    a.unmount();
    const b = render(<Demo defaultCollapsed />);
    expect(await axe(b.container)).toHaveNoViolations();
  });
});

describe('SidebarItem', () => {
  it('asChild renders the child with merged className/aria-current and forwards ref', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Sidebar>
        <SidebarSection>
          <SidebarItem ref={ref} asChild active className="extra" data-testid="it">
            <a href="/router" data-router="1">
              Router
            </a>
          </SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    const a = screen.getByRole('link', { name: 'Router' });
    expect(ref.current).toBe(a);
    expect(a).toHaveAttribute('href', '/router');
    expect(a).toHaveAttribute('data-router', '1');
    expect(a).toHaveAttribute('data-testid', 'it');
    expect(a).toHaveAttribute('aria-current', 'page');
    expect(a).toHaveClass('extra', 'h-8', 'rounded-md');
    expect(a.parentElement?.tagName).toBe('LI');
  });

  it('forwards ref to <a> / <button>, merges className, spreads props', () => {
    const aRef = createRef<HTMLAnchorElement>();
    const bRef = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    render(
      <Sidebar>
        <SidebarSection>
          <SidebarItem ref={aRef} href="/a" className="x" data-testid="a" sub>
            A
          </SidebarItem>
          <SidebarItem ref={bRef} onClick={onClick} className="y" data-testid="b">
            B
          </SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    expect(aRef.current).toBe(screen.getByRole('link', { name: 'A' }));
    expect(aRef.current).toHaveClass('x', 'ml-6');
    expect(aRef.current).toHaveAttribute('data-testid', 'a');
    expect(bRef.current).toBe(screen.getByRole('button', { name: 'B' }));
    expect(bRef.current).toHaveClass('y');
    expect(bRef.current).toHaveAttribute('data-testid', 'b');
  });

  it('button item fires onClick via keyboard Enter', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Sidebar>
        <SidebarSection>
          <SidebarItem onClick={onClick}>B</SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'B' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('SidebarGroup', () => {
  function Group(props: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (o: boolean) => void;
  }) {
    return (
      <Sidebar>
        <SidebarSection>
          <SidebarGroup label="Settings" {...props}>
            <SidebarItem href="/s/a">Account</SidebarItem>
            <SidebarItem href="/s/b">Billing</SidebarItem>
          </SidebarGroup>
        </SidebarSection>
      </Sidebar>
    );
  }

  it('is open by default and toggles (uncontrolled) with aria-expanded/aria-controls', async () => {
    const user = userEvent.setup();
    render(<Group />);
    const btn = screen.getByRole('button', { name: 'Settings' });
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    const listId = btn.getAttribute('aria-controls');
    expect(listId).toBeTruthy();
    expect(document.getElementById(listId!)).toContainElement(
      screen.getByRole('link', { name: 'Account' }),
    );
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(btn).not.toHaveAttribute('aria-controls');
    expect(screen.queryByRole('link', { name: 'Account' })).toBeNull();
  });

  it('defaultOpen={false} starts closed', () => {
    render(<Group defaultOpen={false} />);
    expect(screen.getByRole('button', { name: 'Settings' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByRole('link', { name: 'Billing' })).toBeNull();
  });

  it('controlled open: reports via onOpenChange and follows the prop', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Group
          open={open}
          onOpenChange={(o) => {
            onOpenChange(o);
            setOpen(o);
          }}
        />
      );
    }
    render(<Controlled />);
    const btn = screen.getByRole('button', { name: 'Settings' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await user.click(btn);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Billing' })).toBeInTheDocument();
  });

  it('controlled open without state update stays put', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Group open onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Settings' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('link', { name: 'Billing' })).toBeInTheDocument();
  });

  it('collapsed sidebar flattens the group into its items', () => {
    render(
      <TooltipProvider>
        <Sidebar defaultCollapsed>
          <SidebarSection>
            <SidebarGroup label="Settings">
              <SidebarItem href="/s/a">Account</SidebarItem>
            </SidebarGroup>
          </SidebarSection>
        </Sidebar>
      </TooltipProvider>,
    );
    expect(screen.queryByRole('button', { name: 'Settings' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Account' })).toBeInTheDocument();
  });

  it('forwards ref to the <li> and merges className', () => {
    const ref = createRef<HTMLLIElement>();
    render(
      <Sidebar>
        <SidebarSection>
          <SidebarGroup ref={ref} label="G" className="mt-2" data-testid="grp">
            <SidebarItem href="/x">X</SidebarItem>
          </SidebarGroup>
        </SidebarSection>
      </Sidebar>,
    );
    expect(ref.current?.tagName).toBe('LI');
    expect(ref.current).toHaveClass('mt-2');
    expect(ref.current).toHaveAttribute('data-testid', 'grp');
  });
});
