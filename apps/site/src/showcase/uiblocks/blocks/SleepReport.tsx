import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gerege-systems/ui';

/** deep / light / rem minutes per night, oldest first. */
const NIGHTS = [
  [95, 210, 70],
  [80, 235, 60],
  [110, 250, 85],
  [90, 225, 95],
  [130, 240, 74],
  [105, 215, 88],
  [130, 228, 86],
] as const;
const STACK = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'] as const;
const MAX = Math.max(...NIGHTS.map((n) => n[0] + n[1] + n[2]));

const STATS = [
  { value: '2h 10m', label: 'Deep' },
  { value: '3h 48m', label: 'Light' },
  { value: '1h 26m', label: 'REM' },
  { value: '84', label: 'Score' },
] as const;

export function SleepReport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sleep report</CardTitle>
        <p className="text-foreground-subtle text-xs">Last night · 7h 24m</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Stacked bars: one column per night, three phases each. The table
            below carries the same numbers, so the drawing is decorative. */}
        <div className="flex h-32 items-end gap-2" aria-hidden>
          {NIGHTS.map((night, i) => (
            <div key={i} className="flex h-full grow flex-col justify-end gap-0.5">
              {night.map((minutes, phase) => (
                <span
                  key={phase}
                  className="w-full rounded-[2px]"
                  style={{ height: `${(minutes / MAX) * 100}%`, background: STACK[phase] }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-semibold tabular-nums">{s.value}</span>
              <span className="text-foreground-subtle text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="items-center gap-2">
        <Badge tone="success">Good</Badge>
        <span className="grow" />
        <Button size="sm" variant="secondary">
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}
