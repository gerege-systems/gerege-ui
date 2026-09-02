import { Card, CardContent, CardHeader, CardTitle, formatMNT } from '@gerege-systems/ui';

const HOLDINGS = [
  { name: 'Gerege Growth Fund', units: 450, bars: [40, 55, 62, 92], amount: 1_842_100 },
  { name: 'MSE Top 20 index', units: 112, bars: [30, 48, 88, 60], amount: 928_400 },
  { name: 'APU shares', units: 85, bars: [26, 52, 84, 58], amount: 340_000 },
  { name: 'Property income', units: 320, bars: [44, 58, 70, 96], amount: 1_139_500 },
] as const;

export function DividendIncome() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Q2 dividend income</CardTitle>
        <p className="text-foreground-subtle text-xs">Quarterly payouts across your holdings.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {HOLDINGS.map((h) => (
          <div key={h.name} className="bg-background-subtle flex items-center gap-3 rounded-md p-3">
            <div className="flex min-w-0 grow flex-col">
              <span className="truncate text-sm font-medium">{h.name}</span>
              <span className="text-foreground-subtle text-xs tabular-nums">{h.units} units</span>
            </div>
            {/* Four quarters as a sparkline; the amount beside it carries the value. */}
            <span aria-hidden className="hidden h-8 shrink-0 items-end gap-0.5 sm:flex">
              {h.bars.map((b, i) => (
                <span
                  key={i}
                  className="bg-foreground-subtle/40 w-1.5 rounded-[1px]"
                  style={{ height: `${b}%` }}
                />
              ))}
            </span>
            <span className="shrink-0 text-sm font-medium tabular-nums">{formatMNT(h.amount)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
