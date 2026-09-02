import { Card, CardContent, CardHeader, CardTitle, formatMNT } from '@gerege-systems/ui';

const KPIS = [
  { label: 'Total revenue', value: formatMNT(48_250_000), delta: '+12.4%', tone: 'up' },
  { label: 'Orders', value: '1,284', delta: '+3.1%', tone: 'up' },
  { label: 'Average order', value: formatMNT(37_570), delta: 'No change', tone: 'flat' },
  { label: 'Refunds', value: '2.8%', delta: '+0.4%', tone: 'down' },
] as const;

export function Kpis() {
  return (
    <Card padding="sm">
      <CardHeader>
        <CardTitle>Metrics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {KPIS.map((k) => (
          <div key={k.label} className="flex flex-col gap-0.5">
            <span className="text-foreground-subtle text-xs">{k.label}</span>
            {/* 28px overflows a half-width card once formatMNT adds the ₮. */}
            <span className="text-2xl font-semibold tracking-tight tabular-nums">{k.value}</span>
            <span
              className={
                k.tone === 'up'
                  ? 'text-success-foreground text-xs'
                  : k.tone === 'down'
                    ? 'text-danger-foreground text-xs'
                    : 'text-foreground-subtle text-xs'
              }
            >
              {k.delta}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
