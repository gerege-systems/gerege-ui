import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LineChart,
  Separator,
} from '@gerege-systems/ui';

const DAYS = Array.from({ length: 14 }, (_, i) => `${i + 1}`);
const VISITS = [820, 910, 870, 1040, 1180, 990, 1120, 1260, 1310, 1180, 1420, 1380, 1510, 1600];
const SIGNUPS = [40, 52, 44, 61, 70, 58, 66, 74, 81, 69, 88, 84, 95, 102];

export function LineTrend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic</CardTitle>
        <div className="flex items-center gap-2">
          <p className="text-foreground-subtle text-xs">Last 14 days</p>
          <Badge tone="success">+18%</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* One series only: sign-ups are two orders of magnitude smaller than
            visits, so on a shared axis their line sat flat on the baseline and
            said nothing. They are a figure instead. */}
        <LineChart
          height={190}
          showTableToggle
          aria-label="Visits over the last 14 days"
          data={DAYS.map((d, i) => ({ x: d, y: VISITS[i] }))}
        />
        <Separator />
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Visits', value: VISITS[VISITS.length - 1].toLocaleString('en-US') },
            { label: 'Sign-ups', value: String(SIGNUPS[SIGNUPS.length - 1]) },
            {
              label: 'Conversion',
              value: `${((SIGNUPS[SIGNUPS.length - 1] / VISITS[VISITS.length - 1]) * 100).toFixed(1)}%`,
            },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span className="text-foreground-subtle text-xs">{s.label}</span>
              <span className="text-sm font-semibold tabular-nums">{s.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
