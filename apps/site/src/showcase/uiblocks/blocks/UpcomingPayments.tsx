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
  { name: 'Rent', when: '2026-09-05', amount: 1_450_000, tone: 'warning' },
  { name: 'Internet', when: '2026-09-12', amount: 59_000, tone: 'neutral' },
  { name: 'Card minimum', when: '2026-09-18', amount: 41_300, tone: 'neutral' },
] as const;

export function UpcomingPayments() {
  return (
    <Card padding="sm">
      <CardHeader>
        <CardTitle>Upcoming payments</CardTitle>
        <p className="text-foreground-subtle text-xs">Pick a date to see what is scheduled.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Calendar mode="single" />
        <Separator />
        <div className="flex flex-col gap-2.5">
          {DUE.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <span className="min-w-0 grow truncate">{d.name}</span>
              <Badge tone={d.tone}>{d.when}</Badge>
              <span className="tabular-nums">{formatMNT(d.amount)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
