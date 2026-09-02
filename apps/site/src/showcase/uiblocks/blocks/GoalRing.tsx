import { Card, CardContent, Separator, formatMNT } from '@gerege-systems/ui';

const SAVED = 24_000_000;
const TARGET = 30_000_000;

const FACTS = [
  { label: 'Projected finish', value: 'October 2026' },
  { label: 'Monthly average', value: formatMNT(1_250_000) },
  { label: 'Top contributor', value: 'Auto-transfer' },
] as const;

export function GoalRing() {
  const pct = Math.round((SAVED / TARGET) * 100);
  // r=54 keeps the 8-unit stroke inside a 128 viewBox; the dash carries the arc.
  const r = 54;
  const circumference = 2 * Math.PI * r;

  return (
    <Card>
      <CardContent className="flex flex-col gap-5">
        <div className="relative mx-auto size-44">
          <svg viewBox="0 0 128 128" className="size-full -rotate-90" aria-hidden>
            <circle
              cx="64"
              cy="64"
              r={r}
              fill="none"
              stroke="var(--background-muted)"
              strokeWidth="12"
            />
            <circle
              cx="64"
              cy="64"
              r={r}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(circumference * pct) / 100} ${circumference}`}
            />
          </svg>
          {/* The figure is real text, not a label baked into the drawing, so it
              is selectable and read out in order. */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="text-2xl font-semibold tracking-tight tabular-nums">
              {formatMNT(SAVED)}
            </span>
            <span className="text-foreground-subtle text-xs">
              {pct}% of {formatMNT(TARGET)}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          {FACTS.map((f, i) => (
            <div key={f.label} className="flex flex-col">
              {i > 0 && <Separator />}
              <div className="flex items-center gap-3 py-2.5 text-sm">
                <span className="text-foreground-muted min-w-0 grow truncate">{f.label}</span>
                <span className="shrink-0 font-medium">{f.value}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
