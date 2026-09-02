import { ArrowDown, ArrowUp, Inbox, Plus } from '@/icons';
import {
  Avatar,
  Badge,
  BarChart,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  EmptyState,
  ErrorState,
  LineChart,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
  formatNumber,
  type ChartState,
} from '@gerege/ui';
import { useMemo, useState, type ReactNode } from 'react';
import { useStrings } from '@gerege/ui';
import { ACTIVITY, CHANNELS, SERIES_A, SERIES_B, formatRelative } from './data';
import { PageHeader, useDemo, type DemoState } from './shell';
import { adminDict, type AdminKey } from '../../i18n/admin';
import { useT } from '../../i18n/locale';

/** Demo state → chart state (`normal` draws the chart). */
const chartState = (s: DemoState): ChartState | undefined => (s === 'normal' ? undefined : s);

/** Page-level failure with retry — shared by the three dashboard pages. */
function PageError({ onRetry }: { onRetry: () => void }) {
  const t = useT(adminDict);
  return (
    <ErrorState
      variant="500"
      title={t('page.errorTitle')}
      description={t('page.errorDesc')}
      onRetry={onRetry}
      live
    />
  );
}

/** KPI tile placeholder — same box so the row doesn't jump. */
function KpiSkeleton() {
  return (
    <Card aria-hidden>
      <CardContent className="space-y-2 pt-4 md:pt-6">
        <Skeleton variant="text" className="w-20" />
        <Skeleton className="h-8 w-28" />
        <Skeleton variant="text" className="w-32" />
      </CardContent>
    </Card>
  );
}

function KpiRow({
  loading,
  columns,
  children,
}: {
  loading: boolean;
  columns: string;
  children: ReactNode;
}) {
  const t = useT(adminDict);
  return (
    <section aria-label={t('kpi.section')} className={cn('grid grid-cols-1 gap-3', columns)}>
      {loading
        ? Array.from({ length: 4 }, (_, i) => <KpiSkeleton key={i} />).slice(0, 4)
        : children}
    </section>
  );
}

/* =============================================================================
 *  Admin template — Overview, Analytics, Reports (KPI row → chart → table)
 * ========================================================================== */

/** Chart series/categories carry locale-independent data; labels resolve here. */
function useChartData() {
  const t = useT(adminDict);
  return useMemo(
    () => ({
      seriesA: SERIES_A.map((p) => ({ x: t('chart.day', { n: p.day }), y: p.y })),
      seriesB: SERIES_B.map((p) => ({ x: t('chart.day', { n: p.day }), y: p.y })),
      channels: CHANNELS.map((c) => ({ x: t(c.label), y: c.y })),
    }),
    [t],
  );
}

/**
 * KPI tile: label → value (tabular) → delta. The delta carries arrow + sign +
 * colour and names the comparison window, so it reads without colour.
 */
export function KpiTile({
  label,
  value,
  delta,
  /** True when the change is good for the business (a falling error rate is positive). */
  positive,
  compare,
}: {
  label: string;
  value: string;
  delta?: number;
  positive?: boolean;
  compare?: string;
}) {
  const t = useT(adminDict);
  const up = delta !== undefined && delta >= 0;
  return (
    <Card>
      <CardContent className="pt-4 md:pt-6">
        <div className="text-foreground-muted text-xs font-medium">{label}</div>
        <div className="tabular text-foreground mt-1 text-3xl font-semibold tracking-tight">
          {value}
        </div>
        {delta !== undefined && (
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                'tabular inline-flex items-center gap-0.5 font-medium',
                positive ? 'text-success-text' : 'text-danger-text',
              )}
            >
              {up ? (
                <ArrowUp className="size-3" aria-hidden />
              ) : (
                <ArrowDown className="size-3" aria-hidden />
              )}
              <span className="sr-only">{up ? t('kpi.up') : t('kpi.down')}</span>
              {up ? '+' : '−'}
              {formatNumber(Math.abs(delta))}%
            </span>
            <span className="text-foreground-subtle">{compare ?? t('kpi.compare')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** One period filter at the top, shared by every widget on the page. */
const RANGES = ['7d', '30d', '90d'] as const;
type Range = (typeof RANGES)[number];
const RANGE_LOWER: Record<Range, AdminKey> = {
  '7d': 'range.last7',
  '30d': 'range.last30',
  '90d': 'range.last90',
};

function RangeSelect({ value, onChange }: { value: Range; onChange: (v: Range) => void }) {
  const t = useT(adminDict);
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Range)}>
      <SelectTrigger size="sm" aria-label={t('range.label')} className="w-44" />
      <SelectContent>
        {RANGES.map((r) => (
          <SelectItem key={r} value={r}>
            {t(`range.${r}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function Overview({ onNavigate }: { onNavigate: (key: string) => void }) {
  const [range, setRange] = useState<Range>('30d');
  const demo = useDemo();
  const t = useT(adminDict);
  const { relativeTime } = useStrings();
  const { seriesA, seriesB } = useChartData();
  const compare = t('kpi.comparePrev', { n: parseInt(range, 10) });
  const header = (
    <PageHeader
      page="overview"
      title={t('overview.title')}
      subtitle={t('overview.subtitle')}
      actions={<RangeSelect value={range} onChange={setRange} />}
      onNavigate={onNavigate}
    />
  );
  if (demo.state === 'error')
    return (
      <div>
        {header}
        <PageError onRetry={() => demo.setState('normal')} />
      </div>
    );
  const empty = demo.state === 'empty';
  const activity = empty ? [] : ACTIVITY;
  return (
    <div>
      {header}
      <KpiRow loading={demo.state === 'loading'} columns="sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile
          label={t('kpi.activeUsers')}
          value={empty ? '—' : '2,840'}
          delta={empty ? undefined : 12}
          positive
          compare={compare}
        />
        <KpiTile
          label={t('kpi.sessions')}
          value={empty ? '—' : '8,402'}
          delta={empty ? undefined : 4}
          positive
          compare={compare}
        />
        <KpiTile
          label={t('kpi.openIssues')}
          value={empty ? '—' : '14'}
          delta={empty ? undefined : -6}
          positive
          compare={compare}
        />
        <KpiTile
          label={t('kpi.errorRate')}
          value={empty ? '—' : '0.32%'}
          delta={empty ? undefined : 0.05}
          compare={compare}
        />
      </KpiRow>

      <Card className="mt-4">
        <CardHeader>
          <h2 className="text-foreground text-base leading-none font-semibold">
            {t('overview.chartTitle')}
          </h2>
          <CardDescription>
            {t('overview.chartDesc', { range: t(RANGE_LOWER[range]) })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Two series → categorical colours, not the brand accent. */}
          <LineChart
            series={[
              { name: t('series.this'), data: seriesA },
              { name: t('series.prev'), data: seriesB },
            ]}
            height={200}
            state={chartState(demo.state)}
            caption={t('overview.caption')}
          />
        </CardContent>
      </Card>

      <Card padding="none" className="mt-4">
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 px-4 pt-4 md:px-6 md:pt-6">
          <h2 className="text-foreground text-base leading-none font-semibold">
            {t('activity.title')}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('inbox')}>
            {t('common.viewAll')}
          </Button>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('col.who')}</TableHead>
              <TableHead>{t('col.action')}</TableHead>
              <TableHead>{t('col.target')}</TableHead>
              <TableHead className="text-right">{t('col.when')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demo.state === 'loading' &&
              Array.from({ length: 4 }, (_, i) => (
                <TableRow key={`sk-${i}`} aria-hidden>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton variant="avatar" className="size-6" />
                      <Skeleton variant="text" className="w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" className="w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-28 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" className="ml-auto w-12" />
                  </TableCell>
                </TableRow>
              ))}
            {activity.length === 0 && demo.state !== 'loading' && (
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <EmptyState
                    icon={<Inbox />}
                    title={t('activity.emptyTitle')}
                    description={t('activity.emptyDesc')}
                    className="min-h-[160px] rounded-none border-0 bg-transparent"
                  />
                </TableCell>
              </TableRow>
            )}
            {activity.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar size="xs" fallback={r.initials} alt="" />
                    <span className="text-foreground">{r.who}</span>
                  </div>
                </TableCell>
                <TableCell className="text-foreground-muted">{t(r.action)}</TableCell>
                <TableCell>
                  <Badge tone="neutral" variant="outline">
                    {r.target}
                  </Badge>
                </TableCell>
                <TableCell
                  className="tabular text-foreground-subtle text-right"
                  title={formatRelative(r.at, relativeTime).title}
                >
                  {formatRelative(r.at, relativeTime).label}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export function Analytics({ onNavigate }: { onNavigate: (key: string) => void }) {
  const [range, setRange] = useState<Range>('30d');
  const demo = useDemo();
  const t = useT(adminDict);
  const { seriesB, channels } = useChartData();
  const header = (
    <PageHeader
      page="analytics"
      title={t('analytics.title')}
      subtitle={t('analytics.subtitle')}
      actions={<RangeSelect value={range} onChange={setRange} />}
      onNavigate={onNavigate}
    />
  );
  if (demo.state === 'error')
    return (
      <div>
        {header}
        <PageError onRetry={() => demo.setState('normal')} />
      </div>
    );
  const empty = demo.state === 'empty';
  return (
    <div>
      {header}
      <KpiRow loading={demo.state === 'loading'} columns="sm:grid-cols-3">
        <KpiTile
          label={t('kpi.pageViews')}
          value={empty ? '—' : '128k'}
          delta={empty ? undefined : 8}
          positive
        />
        <KpiTile
          label={t('kpi.avgSession')}
          value={empty ? '—' : t('kpi.avgSessionValue')}
          delta={empty ? undefined : 5.8}
          positive
        />
        <KpiTile
          label={t('kpi.bounce')}
          value={empty ? '—' : '38%'}
          delta={empty ? undefined : -2}
          positive
        />
      </KpiRow>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-foreground text-base leading-none font-semibold">
              {t('analytics.sessionsTitle')}
            </h2>
            <CardDescription>{t('range.30d')}</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={seriesB}
              height={200}
              state={chartState(demo.state)}
              caption={t('analytics.sessionsCaption')}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-foreground text-base leading-none font-semibold">
              {t('analytics.channelTitle')}
            </h2>
            <CardDescription>{t('analytics.thisMonth')}</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={channels}
              height={200}
              state={chartState(demo.state)}
              caption={t('analytics.channelCaption')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function Reports({ onNavigate }: { onNavigate: (key: string) => void }) {
  const demo = useDemo();
  const t = useT(adminDict);
  const { seriesA, channels } = useChartData();
  const header = (
    <PageHeader
      page="reports"
      title={t('reports.title')}
      subtitle={t('reports.subtitle')}
      actions={
        <Button size="sm" leadingIcon={<Plus />}>
          {t('reports.new')}
        </Button>
      }
      onNavigate={onNavigate}
    />
  );
  if (demo.state === 'error')
    return (
      <div>
        {header}
        <PageError onRetry={() => demo.setState('normal')} />
      </div>
    );
  return (
    <div>
      {header}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-foreground text-base leading-none font-semibold">
              {t('reports.wauTitle')}
            </h2>
            <CardDescription>{t('reports.updatedDaily')}</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={seriesA}
              height={180}
              state={chartState(demo.state)}
              caption={t('reports.wauCaption')}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-foreground text-base leading-none font-semibold">
              {t('reports.revTitle')}
            </h2>
            <CardDescription>{t('reports.thisQuarter')}</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={channels}
              height={180}
              state={chartState(demo.state)}
              caption={t('reports.revCaption')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
