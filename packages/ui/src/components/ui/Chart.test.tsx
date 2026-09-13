import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import {
  AreaChart,
  BarChart,
  DEFAULT_CHART_COLORS,
  LineChart,
  abbreviateNumber,
  niceTicks,
} from './Chart';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

const data = [
  { x: 'Jan', y: 1200 },
  { x: 'Feb', y: 3400 },
  { x: 'Mar', y: 900 },
];

describe('Chart', () => {
  it('uses the caption as the accessible name and adds a desc summary', () => {
    render(<LineChart data={data} caption="Revenue" />);
    const svg = screen.getByRole('group', { name: 'Revenue' });
    const desc = svg.querySelector('desc');
    expect(desc?.textContent).toContain('min 900');
    expect(desc?.textContent).toContain('max 3400');
    expect(desc?.textContent).toContain('last Mar: 900');
    expect(screen.getByRole('figure')).toContainElement(svg);
  });

  it('falls back to aria-label / title and warns when nothing is given', () => {
    render(<BarChart data={data} aria-label="Signups" />);
    expect(screen.getByRole('group', { name: 'Signups' })).toBeInTheDocument();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<BarChart data={data} />);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('renders abbreviated y ticks and first/last x labels', () => {
    render(<LineChart data={data} caption="Revenue" />);
    expect(screen.getByText('4K')).toBeInTheDocument(); // nice tick above 3400
    expect(screen.getAllByText('Jan').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Mar').length).toBeGreaterThan(0);
    expect(abbreviateNumber(3_400_000)).toBe('3.4M');
    expect(abbreviateNumber(2_500_000_000)).toBe('2.5B');
    expect(abbreviateNumber(0.456)).toBe('0.46');
    expect(niceTicks(0, 3400).ticks[0]).toBe(4000);
    expect(niceTicks(5, 5).max).toBeGreaterThan(5);
  });

  it('showAxis={false} / grid={false} remove axes and gridlines', () => {
    const { container } = render(
      <LineChart data={data} caption="R" showAxis={false} grid={false} />,
    );
    expect(screen.queryByText('4K')).toBeNull();
    expect(container.querySelector('line')).toBeNull();
  });

  it('draws multiple series with distinct colours and no gradient', () => {
    const { container } = render(
      <LineChart
        caption="Two"
        series={[
          { name: 'A', data },
          { name: 'B', data: data.map((d) => ({ ...d, y: (d.y ?? 0) / 2 })) },
        ]}
      />,
    );
    expect(container.querySelector('linearGradient')).toBeNull();
    const strokes = Array.from(container.querySelectorAll('path[stroke]')).map((p) =>
      p.getAttribute('stroke'),
    );
    expect(new Set(strokes).size).toBe(2);
    expect(strokes).toEqual([DEFAULT_CHART_COLORS[0], DEFAULT_CHART_COLORS[1]]);
  });

  it('custom colors and height / width / className are applied', () => {
    const { container } = render(
      <BarChart
        data={data}
        caption="C"
        colors={['red']}
        height={80}
        width={300}
        className="extra"
      />,
    );
    expect(container.querySelector('rect')).toHaveAttribute('fill', 'red');
    expect(container.querySelector('svg')).toHaveAttribute('height', '80');
    expect(screen.getByRole('figure')).toHaveClass('extra');
    expect(screen.getByRole('figure')).toHaveStyle({ width: '300px' });
  });

  it('null points break the line into segments and are skipped in bars', () => {
    const gappy = [
      { x: 1, y: 1 },
      { x: 2, y: null },
      { x: 3, y: 3 },
    ];
    const { container: line } = render(<LineChart data={gappy} caption="L" />);
    expect(line.querySelectorAll('circle')).toHaveLength(2);
    const { container: bar } = render(<BarChart data={gappy} caption="B" />);
    expect(bar.querySelectorAll('rect')).toHaveLength(2);
  });

  it('AreaChart aliases LineChart', () => {
    const { container } = render(<AreaChart data={data} caption="A" />);
    expect(container.querySelector('path[fill-opacity]')).not.toBeNull();
  });

  describe('roving focus', () => {
    it('one tab stop per series; focus announces the last point; arrows / Home / End move', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <LineChart caption="Revenue" series={[{ name: 'Rev', data }]} />,
      );
      const series = container.querySelector('g[tabindex="0"]')!;
      expect(series).toHaveAttribute('role', 'group');
      expect(series).toHaveAttribute(
        'aria-label',
        'Rev, 3 points. Use arrow keys to move between points.',
      );
      expect(container.querySelectorAll('g[tabindex="0"]')).toHaveLength(1);
      const live = container.querySelector('[aria-live="polite"]')!;
      expect(live).toHaveTextContent('');

      await user.tab();
      expect(series).toHaveFocus();
      expect(live).toHaveTextContent('Rev — Mar: 900');
      expect(container.querySelectorAll('[data-active]')).toHaveLength(1);

      await user.keyboard('{ArrowLeft}');
      expect(live).toHaveTextContent('Rev — Feb: 3400');
      await user.keyboard('{ArrowLeft}');
      expect(live).toHaveTextContent('Rev — Jan: 1200');
      await user.keyboard('{ArrowLeft}'); // clamps
      expect(live).toHaveTextContent('Rev — Jan: 1200');
      await user.keyboard('{End}');
      expect(live).toHaveTextContent('Rev — Mar: 900');
      await user.keyboard('{Home}');
      expect(live).toHaveTextContent('Rev — Jan: 1200');
      await user.keyboard('{ArrowRight}');
      expect(live).toHaveTextContent('Rev — Feb: 3400');

      await user.tab();
      expect(series).not.toHaveFocus();
      expect(live).toHaveTextContent('');
      expect(container.querySelectorAll('[data-active]')).toHaveLength(0);
    });

    it('series group carries data-chart-series for the CSS focus outline and no outline-hidden', () => {
      const { container } = render(<LineChart caption="R" series={[{ name: 'Rev', data }]} />);
      const series = container.querySelector('g[tabindex="0"]')!;
      expect(series).toHaveAttribute('data-chart-series', 'true');
      expect(series).not.toHaveClass('outline-hidden');
    });

    it('skips null points when navigating', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <BarChart
          caption="G"
          data={[
            { x: 'a', y: 1 },
            { x: 'b', y: null },
            { x: 'c', y: 3 },
          ]}
        />,
      );
      await user.tab();
      const live = container.querySelector('[aria-live="polite"]')!;
      expect(live).toHaveTextContent('c: 3');
      await user.keyboard('{ArrowLeft}');
      expect(live).toHaveTextContent('a: 1');
    });
  });

  it('BarChart with negative values draws a zero line and bars hang below it', () => {
    const { container } = render(
      <BarChart
        caption="PnL"
        data={[
          { x: 'a', y: 50 },
          { x: 'b', y: -30 },
        ]}
        height={100}
        grid={false}
      />,
    );
    const zero = container.querySelector('line[stroke="var(--color-border-strong)"]');
    expect(zero).not.toBeNull();
    const zeroY = Number(zero!.getAttribute('y1'));
    const [pos, neg] = Array.from(container.querySelectorAll('rect'));
    // positive bar ends at the zero line, negative bar starts at it
    expect(Number(pos.getAttribute('y')) + Number(pos.getAttribute('height'))).toBeCloseTo(
      zeroY,
      5,
    );
    expect(Number(neg.getAttribute('y'))).toBeCloseTo(zeroY, 5);
    expect(Number(neg.getAttribute('height'))).toBeGreaterThan(0);
    expect(screen.getByText('-40')).toBeInTheDocument(); // nice tick below -30
  });

  describe('table fallback', () => {
    it('renders a visually hidden data table inside an sr-only wrapper by default', () => {
      const { container } = render(<LineChart caption="Revenue" data={data} />);
      const table = container.querySelector('table[data-chart-table]')!;
      expect(table).not.toBeNull();
      expect(table.parentElement).toHaveClass('sr-only');
      expect(table.querySelector('caption')).toHaveTextContent('Data table for Revenue');
      expect(table.querySelectorAll('tbody tr')).toHaveLength(3);
      expect(table.querySelectorAll('th[scope="col"]')).toHaveLength(2);
    });

    it('tableFallback={false} removes it; showTableToggle reveals a visible table', async () => {
      const user = userEvent.setup();
      const { container, rerender } = render(
        <LineChart caption="R" data={data} tableFallback={false} />,
      );
      expect(container.querySelector('table')).toBeNull();
      rerender(<LineChart caption="R" data={data} tableFallback={false} showTableToggle />);
      const toggle = screen.getByRole('button', { name: 'View as table' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(toggle).not.toHaveAttribute('aria-controls');
      await user.click(toggle);
      expect(toggle).toHaveTextContent('Hide table');
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      const table = container.querySelector('table')!;
      expect(toggle).toHaveAttribute('aria-controls', table.id);
      expect(table.parentElement).not.toHaveClass('sr-only');
      expect(table).toHaveClass('w-full');
      await user.click(toggle);
      expect(container.querySelector('table')).toBeNull();
    });

    it('null values render as an em dash', () => {
      const { container } = render(<LineChart caption="R" data={[{ x: 'a', y: null }]} />);
      expect(container.querySelector('tbody td')).toHaveTextContent('—');
    });
  });

  describe('states', () => {
    it('loading renders a status skeleton and hides the svg/table', () => {
      const { container } = render(<LineChart caption="R" data={data} state="loading" />);
      expect(screen.getByRole('status', { name: 'Loading chart…' })).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeNull();
      expect(container.querySelector('table')).toBeNull();
    });

    it('empty renders a status message; error renders an alert; toggle hidden', () => {
      const { rerender } = render(<BarChart caption="R" data={[]} state="empty" showTableToggle />);
      expect(screen.getByRole('status')).toHaveTextContent('No data to display.');
      expect(screen.queryByRole('button')).toBeNull();
      rerender(<BarChart caption="R" data={[]} state="error" showTableToggle />);
      expect(screen.getByRole('alert')).toHaveTextContent("Couldn't load this chart.");
    });

    it('an empty data array without `state` still renders without throwing', () => {
      const { container } = render(<LineChart caption="R" data={[]} />);
      expect(container.querySelector('svg')).not.toBeNull();
      expect(container.querySelector('desc')).toHaveTextContent('no data');
    });
  });

  it('custom labels override the generated text', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <LineChart
        caption="R"
        data={data}
        labels={{
          point: (_n, x, y) => `P ${x}=${y}`,
          series: (n, c) => `S ${n} ${c}`,
          summary: ({ count }) => `SUM ${count}`,
        }}
      />,
    );
    expect(container.querySelector('desc')).toHaveTextContent('SUM 3');
    expect(container.querySelector('g[tabindex="0"]')).toHaveAttribute(
      'aria-label',
      'S Series 1 3',
    );
    await user.tab();
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('P Mar=900');
  });

  it('localises summary, series label, table caption and states', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <DesignSystemProvider strings={mnStrings}>
        <LineChart caption="R" data={data} showTableToggle />
      </DesignSystemProvider>,
    );
    expect(container.querySelector('g[tabindex="0"]')?.getAttribute('aria-label')).toContain(
      mnStrings.chart.series.replace('{n}', '1'),
    );
    expect(screen.getByRole('button', { name: mnStrings.chart.viewAsTable })).toBeInTheDocument();
    await user.tab();
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent(
      mnStrings.chart.point.replace('{x}', 'Mar').replace('{y}', '900'),
    );
    rerender(
      <DesignSystemProvider strings={mnStrings}>
        <LineChart caption="R" data={data} state="error" />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(mnStrings.chart.error);
  });

  it('is axe-clean (default, with toggle open, and in states)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <LineChart data={data} caption="Revenue" showTableToggle />
        <BarChart data={data} aria-label="Signups" />
        <BarChart data={data} caption="Loading" state="loading" />
        <BarChart data={data} caption="Broken" state="error" />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole('button', { name: 'View as table' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
