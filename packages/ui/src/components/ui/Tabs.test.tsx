import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

function Demo(props: {
  variant?: 'underline' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
}) {
  return (
    <Tabs defaultValue="overview" orientation={props.orientation}>
      <TabsList aria-label="Sections" variant={props.variant} size={props.size}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings" disabled>
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel</TabsContent>
      <TabsContent value="activity">Activity panel</TabsContent>
      <TabsContent value="settings">Settings panel</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders tablist/tab/tabpanel with the default tab active', () => {
    render(<Demo />);
    const list = screen.getByRole('tablist', { name: 'Sections' });
    expect(list).toHaveAttribute('data-variant', 'underline');
    expect(list).toHaveClass('border-b', 'h-10');
    const overview = screen.getByRole('tab', { name: 'Overview' });
    expect(overview).toHaveAttribute('aria-selected', 'true');
    expect(overview).toHaveAttribute('data-state', 'active');
    expect(overview).toHaveAttribute('data-variant', 'underline');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
    expect(screen.queryByText('Activity panel')).toBeNull();
  });

  it('pills variant + size propagate to list and triggers', () => {
    render(<Demo variant="pills" size="sm" />);
    const list = screen.getByRole('tablist');
    expect(list).toHaveAttribute('data-variant', 'pills');
    expect(list).toHaveClass('rounded-lg', 'h-9');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('data-variant', 'pills');
  });

  it('uncontrolled: click switches panel', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
  });

  it('controlled: value + onValueChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    function Controlled() {
      const [v, setV] = useState('a');
      return (
        <Tabs
          value={v}
          onValueChange={(next) => {
            onChange(next);
            setV(next);
          }}
        >
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsTrigger value="b">B</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Panel A</TabsContent>
          <TabsContent value="b">Panel B</TabsContent>
        </Tabs>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('tab', { name: 'B' }));
    expect(onChange).toHaveBeenCalledWith('b');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');
  });

  it('keyboard: single tab stop, arrows move + activate, skip disabled, Tab reaches panel', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.tab();
    const overview = screen.getByRole('tab', { name: 'Overview' });
    expect(overview).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    const activity = screen.getByRole('tab', { name: 'Activity' });
    expect(activity).toHaveFocus();
    expect(activity).toHaveAttribute('aria-selected', 'true');
    // Settings is disabled → wraps back to Overview.
    await user.keyboard('{ArrowRight}');
    expect(overview).toHaveFocus();
    await user.keyboard('{End}');
    expect(activity).toHaveFocus();
    await user.keyboard('{Home}');
    expect(overview).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus();
  });

  it('vertical orientation uses ArrowDown/ArrowUp', async () => {
    const user = userEvent.setup();
    render(<Demo orientation="vertical" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveFocus();
  });

  it('disabled trigger is not selectable', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const settings = screen.getByRole('tab', { name: 'Settings' });
    expect(settings).toBeDisabled();
    await user.click(settings);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
  });

  it('forwards refs, merges className, spreads props', () => {
    const listRef = createRef<HTMLDivElement>();
    const trigRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();
    render(
      <Tabs defaultValue="a">
        <TabsList ref={listRef} className="w-fit" data-testid="list">
          <TabsTrigger ref={trigRef} value="a" className="px-4" data-testid="trig">
            A
          </TabsTrigger>
        </TabsList>
        <TabsContent ref={contentRef} value="a" className="mt-0" data-testid="content">
          x
        </TabsContent>
      </Tabs>,
    );
    expect(listRef.current).toBe(screen.getByRole('tablist'));
    expect(listRef.current).toHaveClass('w-fit', 'inline-flex');
    expect(listRef.current).toHaveAttribute('data-testid', 'list');
    expect(trigRef.current).toBe(screen.getByRole('tab'));
    expect(trigRef.current).toHaveClass('px-4', 'font-medium');
    expect(contentRef.current).toBe(screen.getByRole('tabpanel'));
    expect(contentRef.current).toHaveClass('mt-0', 'outline-none');
    expect(contentRef.current).toHaveAttribute('data-testid', 'content');
  });

  it('is axe-clean', async () => {
    const { container } = render(<Demo />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('TabsTrigger icons', () => {
  it('sizes a bare svg child to 16px', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">
            <svg data-testid="icon" viewBox="0 0 24 24" />A
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a">a</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'A' }).className).toContain('[&_svg]:size-4');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
