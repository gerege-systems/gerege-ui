import {
  AreaChart,
  Avatar,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  formatMNT,
} from '@gerege-systems/ui';

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const AMOUNT = [4.2, 5.1, 4.8, 6.3, 7.1, 3.4, 2.9];

const RECENT = [
  { who: 'Oyunchimeg', initials: 'OC', amount: 1_240_000, state: 'Paid' },
  { who: 'Uursaikhan LLC', initials: 'UL', amount: 460_000, state: 'Draft' },
  { who: 'Delgerekh Trade', initials: 'DT', amount: 2_150_000, state: 'Overdue' },
] as const;

export function DashboardOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>This week</CardTitle>
        <p className="text-foreground-subtle text-xs">Revenue and the latest invoices</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-foreground-subtle text-xs">Revenue</span>
            <span className="text-xl font-semibold tracking-tight tabular-nums">
              {formatMNT(33_800_000)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-foreground-subtle text-xs">Invoices</span>
            <span className="text-xl font-semibold tracking-tight tabular-nums">42</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-foreground-subtle text-xs">Overdue</span>
            <span className="text-xl font-semibold tracking-tight tabular-nums">3</span>
          </div>
        </div>
        <AreaChart
          height={150}
          aria-label="Revenue by day this week"
          data={WEEK.map((d, i) => ({ x: d, y: AMOUNT[i] }))}
        />
        <Separator />
        <div className="flex flex-col gap-3">
          {RECENT.map((r) => (
            <div key={r.who} className="flex items-center gap-3">
              <Avatar fallback={r.initials} size="sm" />
              <span className="min-w-0 grow truncate text-sm">{r.who}</span>
              <span className="text-sm tabular-nums">{formatMNT(r.amount)}</span>
              <Badge
                tone={r.state === 'Paid' ? 'success' : r.state === 'Overdue' ? 'danger' : 'neutral'}
              >
                {r.state}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
