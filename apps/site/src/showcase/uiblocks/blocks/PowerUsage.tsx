import { AreaChart, Badge, Card, CardContent, CardHeader, CardTitle } from '@gerege-systems/ui';

// Full clock times: the axis renders only the first and last label, and a
// bare '00' there reads as a stray zero rather than midnight.
const HOURS = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
const KWH = [0.6, 0.4, 1.1, 2.4, 2.0, 1.7, 3.4, 2.2];

export function PowerUsage() {
  const total = KWH.reduce((n, v) => n + v, 0).toFixed(1);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Power usage</CardTitle>
          <span className="grow" />
          <Badge tone="neutral">{total} kWh today</Badge>
        </div>
        <p className="text-foreground-subtle text-xs">Whole home · every 3 hours</p>
      </CardHeader>
      <CardContent>
        <AreaChart
          height={160}
          aria-label="Power usage through the day, kilowatt hours"
          data={HOURS.map((h, i) => ({ x: h, y: KWH[i] }))}
        />
      </CardContent>
    </Card>
  );
}
