import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Icons,
  formatMNT,
} from '@gerege-systems/ui';

const TX = [
  { who: 'Nomin Supermarket', when: 'Today 09:12', amount: -84_500, kind: 'Card' },
  { who: 'Salary — Gerege Systems', when: '2026-09-01', amount: 3_200_000, kind: 'Transfer' },
  { who: 'Unitel', when: '2026-08-30', amount: -49_000, kind: 'Direct debit' },
  { who: 'Refund — Emart', when: '2026-08-29', amount: 24_800, kind: 'Card' },
] as const;

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
        <p className="text-foreground-subtle text-xs">Last 7 days</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {TX.map((t) => (
          <div key={t.who} className="flex items-center gap-3">
            <div className="bg-background-muted text-foreground-subtle flex size-9 shrink-0 items-center justify-center rounded-full">
              {t.amount > 0 ? (
                <Icons.ArrowDown aria-hidden className="size-4" />
              ) : (
                <Icons.ArrowUp aria-hidden className="size-4" />
              )}
            </div>
            <div className="flex min-w-0 grow flex-col">
              <span className="truncate text-sm">{t.who}</span>
              <span className="text-foreground-subtle text-xs">{t.when}</span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span
                className={
                  t.amount > 0
                    ? 'text-success-foreground text-sm tabular-nums'
                    : 'text-sm tabular-nums'
                }
              >
                {t.amount > 0 ? '+' : '−'}
                {formatMNT(Math.abs(t.amount))}
              </span>
              <Badge tone="neutral">{t.kind}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="ghost" className="w-full">
          View all
        </Button>
      </CardFooter>
    </Card>
  );
}
