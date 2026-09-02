import { AreaChart, Badge, Card, CardContent, CardHeader, CardTitle } from '@gerege-systems/ui';

const HOURS = ['00', '03', '06', '09', '12', '15', '18', '21'];
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
