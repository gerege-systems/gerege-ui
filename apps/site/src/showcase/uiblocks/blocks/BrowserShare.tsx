import { Badge, Card, CardContent, CardHeader, CardTitle, Progress } from '@gerege-systems/ui';

const SHARE = [
  { name: 'Chrome', pct: 42, color: 'var(--chart-1)' },
  { name: 'Safari', pct: 18, color: 'var(--chart-2)' },
  { name: 'Firefox', pct: 31, color: 'var(--chart-3)' },
  { name: 'Edge', pct: 9, color: 'var(--chart-4)' },
] as const;
const TOTAL = 935;

export function BrowserShare() {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-2">
          <div className="flex flex-col gap-0.5">
            <CardTitle>Browser share</CardTitle>
            <p className="text-foreground-subtle text-xs">January – June 2026</p>
          </div>
          <span className="grow" />
          <Badge tone="neutral">Firefox</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="relative mx-auto size-40">
          <svg viewBox="0 0 128 128" className="size-full -rotate-90" aria-hidden>
            {SHARE.map((s) => {
              const dash = (circumference * s.pct) / 100;
              const el = (
                <circle
                  key={s.name}
                  cx="64"
                  cy="64"
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="12"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += dash;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold tracking-tight tabular-nums">{TOTAL}</span>
            <span className="text-foreground-subtle text-xs">Visitors</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
          {SHARE.map((s) => (
            <span key={s.name} className="text-foreground-muted flex items-center gap-1.5 text-xs">
              <span className="size-2 rounded-[2px]" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm">
            <span className="grow">Firefox</span>
            <span className="text-foreground-subtle tabular-nums">31%</span>
          </div>
          <Progress value={31} size="sm" />
        </div>
      </CardContent>
    </Card>
  );
}
