import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
  formatMNT,
} from '@gerege-systems/ui';

const GOALS = [
  { name: 'Emergency fund', saved: 6_400_000, target: 8_000_000 },
  { name: 'New laptop', saved: 1_900_000, target: 4_200_000 },
  { name: 'Winter trip', saved: 450_000, target: 3_000_000 },
] as const;

export function SavingsTargets() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings targets</CardTitle>
        <p className="text-foreground-subtle text-xs">3 active milestones</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {GOALS.map((g) => {
          const pct = Math.round((g.saved / g.target) * 100);
          return (
            <div key={g.name} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm">
                <span className="min-w-0 grow truncate">{g.name}</span>
                <span className="text-foreground-subtle text-xs tabular-nums">
                  {formatMNT(g.saved)} / {formatMNT(g.target)}
                </span>
              </div>
              <Progress value={pct} size="sm" tone={pct >= 75 ? 'success' : 'accent'} />
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary" className="w-full">
          Add a target
        </Button>
      </CardFooter>
    </Card>
  );
}
