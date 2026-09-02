import { Badge, Card, CardContent, CardHeader, CardTitle, LineChart } from '@gerege-systems/ui';

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
      <CardContent>
        <LineChart
          height={200}
          showTableToggle
          aria-label="Visits and sign-ups over the last 14 days"
          series={[
            { name: 'Visits', data: DAYS.map((d, i) => ({ x: d, y: VISITS[i] })) },
            { name: 'Sign-ups', data: DAYS.map((d, i) => ({ x: d, y: SIGNUPS[i] })) },
          ]}
        />
      </CardContent>
    </Card>
  );
}
