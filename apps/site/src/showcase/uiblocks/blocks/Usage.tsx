import { Card, CardContent, CardHeader, CardTitle, Progress } from '@gerege-systems/ui';

export function Usage() {
  const rows = [
    { label: 'API calls', used: 82, note: '410k / 500k' },
    { label: 'Storage', used: 47, note: '9.4GB / 20GB' },
    { label: 'Seats', used: 30, note: '3 / 10' },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <p className="text-foreground-subtle text-xs">September cycle</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-sm">
              <span className="grow">{r.label}</span>
              <span className="text-foreground-subtle text-xs tabular-nums">{r.note}</span>
            </div>
            <Progress value={r.used} tone={r.used > 80 ? 'warning' : 'accent'} size="sm" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
