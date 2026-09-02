import {
  Badge,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
  formatMNT,
} from '@gerege-systems/ui';

const DUE = [
  { name: 'Rent', when: '2026-09-05', amount: 1_450_000, soon: true },
  { name: 'Internet', when: '2026-09-12', amount: 59_000, soon: false },
  { name: 'Card minimum', when: '2026-09-18', amount: 41_300, soon: false },
] as const;

export function UpcomingPayments() {
  return (
    <Card padding="sm">
      <CardHeader>
        <CardTitle>Upcoming payments</CardTitle>
        <p className="text-foreground-subtle text-xs">Pick a date to see what is scheduled.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Calendar draws its own bordered card; inside one it reads as a box
            in a box, so the frame comes off and it spans the card instead. */}
        <Calendar mode="single" className="w-full rounded-none border-0 p-0" />
        <Separator />
        {/* Name over date, amount alone on the right: the three of them on one
            line pushed the amount past the card in a narrow column. */}
        <div className="flex flex-col gap-3">
          {DUE.map((d) => (
            <div key={d.name} className="flex items-start gap-3">
              <div className="flex min-w-0 grow flex-col">
                <span className="truncate text-sm">{d.name}</span>
                <span className="text-foreground-subtle text-xs">{d.when}</span>
              </div>
              {d.soon && (
                <Badge tone="warning" className="shrink-0">
                  Due soon
                </Badge>
              )}
              <span className="shrink-0 text-sm tabular-nums">{formatMNT(d.amount)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
