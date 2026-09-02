import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  IconButton,
  Icons,
  formatMNT,
} from '@gerege-systems/ui';

const TX = [
  {
    name: 'Tom n Toms',
    cat: 'Food & drink',
    when: 'Today 10:24',
    amount: -18_500,
    icon: 'ShoppingCart',
  },
  {
    name: 'Nomin Supermarket',
    cat: 'Groceries',
    when: 'Yesterday',
    amount: -142_300,
    icon: 'ShoppingCart',
  },
  { name: 'Stripe payout', cat: 'Income', when: '2026-09-12', amount: 4_200_000, icon: 'Wallet' },
  { name: 'UB Taxi', cat: 'Transport', when: '2026-09-11', amount: -24_100, icon: 'Receipt' },
  { name: 'Netflix', cat: 'Entertainment', when: '2026-09-10', amount: -19_990, icon: 'Receipt' },
] as const;

export function TransactionList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-2">
          <div className="flex flex-col gap-0.5">
            <CardTitle>Recent transactions</CardTitle>
            <p className="text-foreground-subtle text-xs">Your latest account activity.</p>
          </div>
          <span className="grow" />
          <Button size="sm" variant="secondary">
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        {TX.map((t, i) => {
          const Glyph = Icons[t.icon];
          return (
            <div
              key={t.name}
              className={
                i === 0
                  ? 'flex items-center gap-3 py-3'
                  : 'border-border flex items-center gap-3 border-t py-3'
              }
            >
              <span className="bg-background-muted text-foreground-subtle flex size-9 shrink-0 items-center justify-center rounded-md">
                <Glyph aria-hidden className="size-4" />
              </span>
              <div className="flex min-w-0 grow flex-col">
                <span className="truncate text-sm font-medium">{t.name}</span>
                <span className="text-foreground-subtle text-xs">{t.cat}</span>
              </div>
              <span className="text-foreground-subtle hidden shrink-0 text-xs sm:block">
                {t.when}
              </span>
              <span
                className={
                  t.amount > 0
                    ? 'text-success-foreground shrink-0 text-sm font-medium tabular-nums'
                    : 'shrink-0 text-sm font-medium tabular-nums'
                }
              >
                {t.amount > 0 ? '+' : '−'}
                {formatMNT(Math.abs(t.amount))}
              </span>
              <IconButton
                aria-label={`Actions for ${t.name}`}
                icon={<Icons.MoreHorizontal />}
                size="sm"
                variant="ghost"
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
