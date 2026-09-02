'use client';

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { formatString, type UiStrings } from '@/lib/strings';
import { Skeleton } from './Skeleton';

/**
 * Tiny, dependency-free chart primitives for inline dashboards — sparklines,
 * KPI cards, at-a-glance trends. For heavy interactive visualisations reach for
 * a charting library. The SVG is drawn in real pixels: a ResizeObserver
 * measures the container width, so points and bars are never distorted.
 *
 * Keyboard: one tab stop per series; ←/→ (Home/End) move between points and
 * the active point is announced via a polite live region.
 */

export interface ChartPoint {
  x: string | number;
  /** `null` breaks the line (a gap) and is skipped in bars/tables. */
  y: number | null;
}

export interface ChartSeries {
  /** Name used in the accessible summary, table header and tooltips. */
  name?: string;
  data: ChartPoint[];
}

export type ChartState = 'loading' | 'empty' | 'error';

/** Text builders for the accessible summary + point labels (i18n). */
export interface ChartLabels {
  /** `<desc>` sentence per series. */
  summary: (s: {
    name: string;
    count: number;
    min: number;
    max: number;
    lastX: string | number | undefined;
    lastY: number | undefined;
  }) => string;
  /** Label of one data point (tooltip, live region). */
  point: (name: string | undefined, x: string | number, y: number) => string;
  /** Accessible name of a series' tab stop. */
  series: (name: string, count: number) => string;
}

export const defaultChartLabels: ChartLabels = {
  summary: ({ name, count, min, max, lastX, lastY }) =>
    `${name}: ${count} points, min ${min}, max ${max}, last ${lastX}: ${lastY}`,
  point: (name, x, y) => `${name ? `${name} — ` : ''}${x}: ${y}`,
  series: (name, count) => `${name}, ${count} points. Use arrow keys to move between points.`,
};

function chartLabelsFromStrings(t: UiStrings['chart']): ChartLabels {
  return {
    summary: ({ name, count, min, max, lastX, lastY }) =>
      formatString(t.summary, { name, count, min, max, x: lastX, y: lastY }),
    point: (name, x, y) => (name ? `${name} — ` : '') + formatString(t.point, { x, y }),
    series: (name, count) => formatString(t.seriesNav, { name, count }),
  };
}

export interface ChartProps {
  /** Primary series. Ignored when `series` is provided. */
  data?: ChartPoint[];
  /** Multiple series drawn on the same scale. */
  series?: ChartSeries[];
  /** Per-series colours. Defaults to `--chart-1..6` (categorical; never the accent). */
  colors?: string[];
  /** Drawing height in px. */
  height?: number;
  /** Defaults to fluid 100%. */
  width?: number | string;
  /** Visible caption rendered above the chart. Doubles as the accessible name. */
  caption?: ReactNode;
  /** Accessible name when there is no `caption`. */
  'aria-label'?: string;
  /** Alias of `aria-label` (SVG `<title>`). */
  title?: string;
  /** Faint horizontal gridlines. Default true. */
  grid?: boolean;
  /** Y-axis tick labels + first/last x labels. Default true. */
  showAxis?: boolean;
  /**
   * Render a visually-hidden `<table>` of the data after the SVG so screen
   * readers and copy/paste get the numbers. Default true.
   */
  tableFallback?: boolean;
  /** Show a small "View as table" toggle that reveals the fallback table. */
  showTableToggle?: boolean;
  /** Replace the drawing with a loading skeleton / empty / error message. */
  state?: ChartState;
  /** Override the generated accessible text (English defaults). */
  labels?: Partial<ChartLabels>;
  className?: string;
}

export const DEFAULT_CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
];

// Width used before the container has been measured (SSR / first paint).
const FALLBACK_W = 600;
const PAD = 6;

/** Measure the container's content width; re-renders on resize. */
function useMeasuredWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;
  useIso(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width: width || FALLBACK_W };
}
const MAX_TICKS = 5;

/** 1234 → "1.2K", 3_400_000 → "3.4M". */
export function abbreviateNumber(n: number): string {
  const abs = Math.abs(n);
  const fmt = (v: number, s: string) => `${(Math.round(v * 10) / 10).toString()}${s}`;
  if (abs >= 1e9) return fmt(n / 1e9, 'B');
  if (abs >= 1e6) return fmt(n / 1e6, 'M');
  if (abs >= 1e3) return fmt(n / 1e3, 'K');
  return Number.isInteger(n) ? String(n) : (Math.round(n * 100) / 100).toString();
}

/** Round a raw step up to 1 / 2 / 2.5 / 5 × 10^n. */
function niceStep(raw: number): number {
  if (raw <= 0) return 1;
  const exp = Math.floor(Math.log10(raw));
  const base = 10 ** exp;
  const f = raw / base;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * base;
}

/**
 * "Nice" axis: expands [min, max] to multiples of a 1/2/2.5/5 step so ticks
 * read as round numbers (never `754.5`).
 */
export function niceTicks(min: number, max: number, maxTicks = MAX_TICKS) {
  if (max === min) max = min + 1;
  const step = niceStep((max - min) / Math.max(1, maxTicks - 1));
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  // +step/2 guards float drift; toFixed strips 0.30000000000000004-style noise.
  for (let v = hi; v >= lo - step / 2; v -= step) ticks.push(Number(v.toFixed(10)));
  return { min: lo, max: hi, ticks };
}

function resolveSeries(data?: ChartPoint[], series?: ChartSeries[]): ChartSeries[] {
  if (series && series.length) return series;
  return [{ data: data ?? [] }];
}

const isNum = (v: number | null | undefined): v is number => typeof v === 'number';

function domain(all: ChartSeries[], includeZero = true) {
  const ys = all.flatMap((s) => s.data.map((d) => d.y).filter(isNum));
  const rawMin = includeZero ? Math.min(0, ...ys) : Math.min(...ys);
  const rawMax = Math.max(...ys, includeZero ? 1 : -Infinity);
  const { min, max, ticks } = niceTicks(
    Number.isFinite(rawMin) ? rawMin : 0,
    rawMax === -Infinity ? 1 : rawMax,
  );
  return { min, max, range: max - min || 1, ticks };
}

function scales(length: number, w: number, h: number, min: number, range: number) {
  const innerW = w - PAD * 2;
  const innerH = h - PAD * 2;
  const sx = (i: number) => (length <= 1 ? PAD + innerW / 2 : PAD + (i / (length - 1)) * innerW);
  const sy = (v: number) => PAD + innerH - ((v - min) / range) * innerH;
  return { sx, sy };
}

/** Catmull-Rom → cubic bézier: a smooth curve through every point. */
function smoothPath(pts: [number, number][]): string {
  if (pts.length === 0) return '';
  if (pts.length < 3) return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Split at `null` gaps → one smooth sub-path per run of real values. */
function segments(
  data: ChartPoint[],
  sx: (i: number) => number,
  sy: (v: number) => number,
): [number, number][][] {
  const out: [number, number][][] = [];
  let run: [number, number][] = [];
  data.forEach((d, i) => {
    if (isNum(d.y)) run.push([sx(i), sy(d.y)]);
    else if (run.length) {
      out.push(run);
      run = [];
    }
  });
  if (run.length) out.push(run);
  return out;
}

const seriesName = (s: ChartSeries, i: number, t: UiStrings['chart']) =>
  s.name ?? formatString(t.series, { n: i + 1 });

/** Plain-language summary for the `<desc>` element. */
function describe(all: ChartSeries[], t: UiStrings['chart'], labels: ChartLabels): string {
  return all
    .map((s, i) => {
      const ys = s.data.map((d) => d.y).filter(isNum);
      const name = seriesName(s, i, t);
      if (!ys.length) return `${name}: ${t.noData}`;
      const last = [...s.data].reverse().find((d) => isNum(d.y));
      return labels.summary({
        name,
        count: ys.length,
        min: Math.min(...ys),
        max: Math.max(...ys),
        lastX: last?.x,
        lastY: last?.y ?? undefined,
      });
    })
    .join('. ');
}

function Grid({ width, height, lines }: { width: number; height: number; lines: number }) {
  const innerH = height - PAD * 2;
  const n = Math.max(1, lines);
  return (
    <g aria-hidden>
      {Array.from({ length: n + 1 }, (_, i) => {
        const y = PAD + (i / n) * innerH;
        return (
          <line
            key={i}
            x1={0}
            x2={width}
            y1={y}
            y2={y}
            stroke="var(--color-border)"
            strokeWidth={1}
            opacity={0.6}
          />
        );
      })}
    </g>
  );
}

/** Axis labels are HTML so they follow the document font and wrap normally. */
function YAxis({ ticks }: { ticks: number[] }) {
  return (
    <div
      aria-hidden
      className="tabular text-foreground-subtle pointer-events-none flex shrink-0 flex-col justify-between py-1.5 pr-1.5 text-right text-xs"
    >
      {ticks.map((t, i) => (
        <span key={i} className="leading-none">
          {abbreviateNumber(t)}
        </span>
      ))}
    </div>
  );
}

function XAxis({ first, last }: { first?: ChartPoint; last?: ChartPoint }) {
  if (!first) return null;
  return (
    <div aria-hidden className="text-foreground-subtle flex justify-between text-xs">
      <span>{String(first.x)}</span>
      {last && last !== first && <span>{String(last.x)}</span>}
    </div>
  );
}

function DataTable({
  id,
  all,
  name,
  visible,
  t,
}: {
  id: string;
  all: ChartSeries[];
  name?: string;
  visible: boolean;
  t: UiStrings['chart'];
}) {
  const longest = Math.max(...all.map((s) => s.data.length));
  const xs = all.find((s) => s.data.length === longest)?.data ?? [];
  // A <table> ignores `sr-only`'s 1px width (min-content wins) and can widen
  // the document on narrow viewports — hide it inside a wrapper instead.
  const table = (
    <table
      id={id}
      data-chart-table
      className={cn(visible && 'tabular text-foreground-muted mt-2 w-full text-left text-xs')}
    >
      <caption className={cn(visible && 'text-foreground-subtle pb-1 text-left')}>
        {formatString(t.tableCaption, { name: name ?? '' }).trim()}
      </caption>
      <thead>
        <tr>
          <th scope="col" className={cn(visible && 'border-border border-b py-1 pr-3 font-medium')}>
            x
          </th>
          {all.map((s, i) => (
            <th
              key={i}
              scope="col"
              className={cn(visible && 'border-border border-b py-1 pr-3 font-medium')}
            >
              {seriesName(s, i, t)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {xs.map((p, i) => (
          <tr key={i}>
            <th scope="row" className={cn(visible && 'py-0.5 pr-3 font-normal')}>
              {String(p.x)}
            </th>
            {all.map((s, si) => (
              <td key={si} className={cn(visible && 'py-0.5 pr-3')}>
                {isNum(s.data[i]?.y) ? String(s.data[i]?.y) : '—'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
  return visible ? table : <div className="sr-only">{table}</div>;
}

function Frame({
  caption,
  ariaLabel,
  title,
  all,
  height,
  width,
  className,
  showAxis,
  ticks,
  xFirst,
  xLast,
  tableFallback,
  showTableToggle,
  state,
  labels,
  children,
}: {
  caption?: ReactNode;
  ariaLabel?: string;
  title?: string;
  all: ChartSeries[];
  height: number;
  width: number | string;
  className?: string;
  showAxis: boolean;
  ticks: number[];
  xFirst?: ChartPoint;
  xLast?: ChartPoint;
  tableFallback: boolean;
  showTableToggle?: boolean;
  state?: ChartState;
  labels: ChartLabels;
  children: (ctx: FrameContext) => ReactNode;
}) {
  const t = useStrings().chart;
  const id = useId().replace(/:/g, '');
  const captionId = `chart-cap-${id}`;
  const titleId = `chart-title-${id}`;
  const descId = `chart-desc-${id}`;
  const tableId = `chart-table-${id}`;
  const name = ariaLabel ?? title;
  const [tableOpen, setTableOpen] = useState(false);
  const { ref: plotRef, width: plotW } = useMeasuredWidth<HTMLDivElement>();
  const roving = useRovingPoints(all, t, labels);

  if (process.env.NODE_ENV !== 'production' && !name && !caption) {
    console.warn(
      '[gerege-systems/ui] Chart: provide `caption`, `aria-label`, or `title` so the chart has an accessible name.',
    );
  }

  const tableRendered = (tableFallback || tableOpen) && !state;

  const stateNode =
    state === 'loading' ? (
      <div role="status" aria-label={t.loading} style={{ height }} className="w-full">
        <Skeleton style={{ height }} className="w-full" />
        <span className="sr-only">{t.loading}</span>
      </div>
    ) : state ? (
      <div
        role={state === 'error' ? 'alert' : 'status'}
        style={{ height }}
        className="text-foreground-subtle flex w-full items-center justify-center text-sm"
      >
        {state === 'error' ? t.error : t.empty}
      </div>
    ) : null;

  return (
    <figure className={cn('flex flex-col gap-1.5', className)} style={{ width }}>
      {caption && (
        <figcaption id={captionId} className="text-foreground-muted text-xs">
          {caption}
        </figcaption>
      )}
      {stateNode ?? (
        <>
          <div className="flex">
            {showAxis && <YAxis ticks={ticks} />}
            {/* The plot area is measured; the SVG is drawn 1:1 in px inside it. */}
            <div ref={plotRef} className="min-w-0 flex-1">
              {/* role=group (not img): series inside are focusable and carry their own labels. */}
              <svg
                data-slot="chart"
                viewBox={`0 0 ${plotW} ${height}`}
                width={plotW}
                height={height}
                role="group"
                aria-labelledby={caption ? captionId : name ? titleId : undefined}
                aria-describedby={descId}
                className="block max-w-full overflow-visible"
              >
                {name && <title id={titleId}>{name}</title>}
                <desc id={descId}>{describe(all, t, labels)}</desc>
                {children({ width: plotW, ...roving })}
              </svg>
            </div>
          </div>
          {showAxis && <XAxis first={xFirst} last={xLast} />}
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {roving.announcement}
          </span>
        </>
      )}
      {showTableToggle && !state && (
        <button
          type="button"
          onClick={() => setTableOpen((v) => !v)}
          aria-expanded={tableOpen}
          aria-controls={tableRendered ? tableId : undefined}
          className={cn(
            'text-foreground-subtle hover:text-foreground self-start rounded-sm text-xs underline-offset-2 outline-none hover:underline',
            'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
          )}
        >
          {tableOpen ? t.hideTable : t.viewAsTable}
        </button>
      )}
      {tableRendered && (
        <DataTable
          id={tableId}
          all={all}
          name={name ?? (typeof caption === 'string' ? caption : undefined)}
          visible={tableOpen}
          t={t}
        />
      )}
    </figure>
  );
}

interface FrameContext {
  width: number;
  active: { series: number; index: number } | null;
  seriesProps: (si: number) => {
    tabIndex: number;
    role: 'group';
    'aria-label': string;
    'data-chart-series': true;
    onKeyDown: (e: KeyboardEvent<SVGGElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
    className: string;
  };
}

/**
 * Roving focus: each series is a single tab stop; ←/→/Home/End move the
 * active point and the live region announces it. Per-point tab stops would
 * make a 200-point chart a 200-tab ordeal.
 */
function useRovingPoints(all: ChartSeries[], t: UiStrings['chart'], labels: ChartLabels) {
  const [active, setActive] = useState<{ series: number; index: number } | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const announce = useCallback(
    (si: number, idx: number) => {
      const s = all[si];
      const d = s?.data[idx];
      if (!d || !isNum(d.y)) return;
      setActive({ series: si, index: idx });
      setAnnouncement(labels.point(s.name, d.x, d.y));
    },
    [all, labels],
  );

  const validIndices = (si: number) =>
    all[si].data.map((d, i) => (isNum(d.y) ? i : -1)).filter((i) => i >= 0);

  const seriesProps = (si: number) => ({
    tabIndex: 0,
    role: 'group' as const,
    'aria-label': labels.series(seriesName(all[si], si, t), validIndices(si).length),
    // Focus ring comes from theme.css `[data-chart-series]:focus-visible`
    // (CSS outline — Tailwind's box-shadow ring does not paint on SVG <g>).
    'data-chart-series': true as const,
    className: cn(
      '[&:focus-visible_[data-active]]:stroke-[var(--ring)] [&:focus-visible_[data-active]]:stroke-[3px]',
    ),
    onFocus: () => {
      const idxs = validIndices(si);
      if (idxs.length) announce(si, active?.series === si ? active.index : idxs[idxs.length - 1]);
    },
    onBlur: () => {
      setActive(null);
      setAnnouncement('');
    },
    onKeyDown: (e: KeyboardEvent<SVGGElement>) => {
      const idxs = validIndices(si);
      if (!idxs.length) return;
      const pos = active?.series === si ? idxs.indexOf(active.index) : idxs.length - 1;
      let next = pos;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(idxs.length - 1, pos + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(0, pos - 1);
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = idxs.length - 1;
      else return;
      e.preventDefault();
      announce(si, idxs[next]);
    },
  });

  return { active, announcement, seriesProps };
}

/** Labelled data point. Invisible until hovered / active unless `always`. */
function Point({
  x,
  y,
  color,
  label,
  always,
  active,
}: {
  x: number;
  y: number;
  color: string;
  label: string;
  always?: boolean;
  active?: boolean;
}) {
  return (
    <circle
      cx={x}
      cy={y}
      r={3.5}
      fill={color}
      data-active={active || undefined}
      className={cn(!always && !active && 'opacity-0 hover:opacity-100')}
    >
      <title>{label}</title>
    </circle>
  );
}

export function LineChart({
  data,
  series,
  colors = DEFAULT_CHART_COLORS,
  height = 160,
  width = '100%',
  caption,
  'aria-label': ariaLabel,
  title,
  grid = true,
  showAxis = true,
  tableFallback = true,
  showTableToggle,
  state,
  labels: labelsProp,
  className,
}: ChartProps) {
  const t = useStrings().chart;
  const labels = { ...chartLabelsFromStrings(t), ...labelsProp };
  const all = resolveSeries(data, series);
  const { min, range, ticks } = domain(all);
  const longest = Math.max(...all.map((s) => s.data.length));
  const primary = all[0].data;

  return (
    <Frame
      caption={caption}
      ariaLabel={ariaLabel}
      title={title}
      all={all}
      height={height}
      width={width}
      className={className}
      showAxis={showAxis}
      ticks={ticks}
      xFirst={primary[0]}
      xLast={primary[primary.length - 1]}
      tableFallback={tableFallback}
      showTableToggle={showTableToggle}
      state={state}
      labels={labels}
    >
      {({ width: w, active, seriesProps }) => (
        <>
          {grid && <Grid width={w} height={height} lines={ticks.length - 1} />}
          {all.map((s, si) => {
            const color = colors[si % colors.length];
            const { sx, sy } = scales(longest, w, height, min, range);
            const segs = segments(s.data, sx, sy);
            const line = segs.map(smoothPath).join(' ');
            const baseline = sy(Math.max(min, 0));
            const area = segs
              .map(
                (pts) =>
                  `${smoothPath(pts)} L${pts[pts.length - 1][0].toFixed(1)},${baseline.toFixed(1)} L${pts[0][0].toFixed(1)},${baseline.toFixed(1)} Z`,
              )
              .join(' ');
            const lastIdx = s.data.map((d) => isNum(d.y)).lastIndexOf(true);
            return (
              <g key={si} {...seriesProps(si)}>
                {area && <path d={area} fill={color} fillOpacity={0.08} />}
                <path
                  d={line}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {s.data.map((d, i) =>
                  isNum(d.y) ? (
                    <Point
                      key={i}
                      x={sx(i)}
                      y={sy(d.y)}
                      color={color}
                      always={i === lastIdx}
                      active={active?.series === si && active.index === i}
                      label={labels.point(s.name, d.x, d.y)}
                    />
                  ) : null,
                )}
              </g>
            );
          })}
        </>
      )}
    </Frame>
  );
}

export function AreaChart(props: ChartProps) {
  // The line chart already renders a flat low-opacity area; alias for intent / naming.
  return <LineChart {...props} />;
}

export function BarChart({
  data,
  series,
  colors = DEFAULT_CHART_COLORS,
  height = 160,
  width = '100%',
  caption,
  'aria-label': ariaLabel,
  title,
  grid = true,
  showAxis = true,
  tableFallback = true,
  showTableToggle,
  state,
  labels: labelsProp,
  className,
}: ChartProps) {
  const t = useStrings().chart;
  const labels = { ...chartLabelsFromStrings(t), ...labelsProp };
  const all = resolveSeries(data, series);
  const longest = Math.max(...all.map((s) => s.data.length));
  const { min, range, ticks } = domain(all);
  const primary = all[0].data;

  return (
    <Frame
      caption={caption}
      ariaLabel={ariaLabel}
      title={title}
      all={all}
      height={height}
      width={width}
      className={className}
      showAxis={showAxis}
      ticks={ticks}
      xFirst={primary[0]}
      xLast={primary[primary.length - 1]}
      tableFallback={tableFallback}
      showTableToggle={showTableToggle}
      state={state}
      labels={labels}
    >
      {({ width: w, active, seriesProps }) => {
        const innerW = w - PAD * 2;
        const slot = innerW / Math.max(1, longest);
        const groupW = slot * 0.62;
        const barW = Math.max(2, groupW / all.length);
        const { sy } = scales(longest, w, height, min, range);
        // Bars grow from the zero line, so negatives hang below it.
        const zeroY = sy(Math.min(Math.max(0, min), min + range));
        return (
          <>
            {grid && <Grid width={w} height={height} lines={ticks.length - 1} />}
            {min < 0 && (
              <line
                aria-hidden
                x1={0}
                x2={w}
                y1={zeroY}
                y2={zeroY}
                stroke="var(--color-border-strong)"
                strokeWidth={1}
              />
            )}
            {all.map((s, si) => (
              <g key={si} {...seriesProps(si)}>
                {s.data.map((d, i) => {
                  if (!isNum(d.y)) return null;
                  const yv = sy(d.y);
                  const x = PAD + i * slot + (slot - groupW) / 2 + si * barW;
                  const label = labels.point(s.name, d.x, d.y);
                  const isActive = active?.series === si && active.index === i;
                  return (
                    <rect
                      key={i}
                      x={x}
                      y={Math.min(zeroY, yv)}
                      width={barW}
                      height={Math.abs(zeroY - yv)}
                      fill={colors[si % colors.length]}
                      rx={2}
                      data-active={isActive || undefined}
                      className="transition-opacity hover:opacity-80"
                    >
                      <title>{label}</title>
                    </rect>
                  );
                })}
              </g>
            ))}
          </>
        );
      }}
    </Frame>
  );
}
