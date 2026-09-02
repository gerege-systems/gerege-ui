import {
  BarChart,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from '@gerege-systems/ui';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const DESKTOP = [780, 1224, 1060, 640, 980, 1120];
const MOBILE = [520, 900, 700, 820, 760, 860];

const STATS = [
  { label: 'Desktop', value: '1,224' },
  { label: 'Mobile', value: '860' },
  { label: 'Mix delta', value: '+42%' },
] as const;

export function TrafficChannels() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic channels</CardTitle>
        <p className="text-foreground-subtle text-xs">
          Desktop against mobile over the last six months.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <BarChart
          height={170}
          showTableToggle
          aria-label="Desktop and mobile visits by month"
          series={[
            { name: 'Desktop', data: MONTHS.map((m, i) => ({ x: m, y: DESKTOP[i] })) },
            { name: 'Mobile', data: MONTHS.map((m, i) => ({ x: m, y: MOBILE[i] })) },
          ]}
        />
        <Separator />
        <div className="grid grid-cols-3 gap-2">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span className="text-foreground-subtle text-xs">{s.label}</span>
              <span className="text-sm font-semibold tabular-nums">{s.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View report</Button>
      </CardFooter>
    </Card>
  );
}
