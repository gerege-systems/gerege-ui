import { Card, CardContent, CardHeader, CardTitle } from '@gerege-systems/ui';

const WEEKS = 26;
const LEVELS = [0, 1, 2, 3, 4];
// Deterministic sample so the block renders the same on every load.
const DATA = Array.from({ length: WEEKS * 7 }, (_, i) => LEVELS[(i * 7 + (i % 5)) % 5]);
const TONE = [
  'bg-background-muted',
  'bg-accent/25',
  'bg-accent/45',
  'bg-accent/70',
  'bg-accent',
] as const;

export function ContributionHeatmap() {
  const total = DATA.reduce((n, v) => n + v, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution history</CardTitle>
        <p className="text-foreground-subtle text-xs">Last 6 months · {total} contributions</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex gap-1 overflow-x-auto">
          {Array.from({ length: WEEKS }, (_, w) => (
            <div key={w} className="flex flex-col gap-1">
              {Array.from({ length: 7 }, (_, d) => (
                <span key={d} className={`size-2.5 rounded-[2px] ${TONE[DATA[w * 7 + d]]}`} />
              ))}
            </div>
          ))}
        </div>
        <div className="text-foreground-subtle flex items-center gap-1.5 text-xs">
          Less
          {TONE.map((t) => (
            <span key={t} className={`size-2.5 rounded-[2px] ${t}`} />
          ))}
          More
        </div>
      </CardContent>
    </Card>
  );
}
