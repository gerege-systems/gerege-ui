import { Card, CardContent, CardHeader, CardTitle } from '@gerege-systems/ui';

const ROW_ONE = [
  { token: '--background', css: 'var(--background)' },
  { token: '--foreground', css: 'var(--foreground)' },
  { token: '--accent', css: 'var(--accent)' },
  { token: '--background-subtle', css: 'var(--background-subtle)' },
  { token: '--background-muted', css: 'var(--background-muted)' },
  { token: '--accent-subtle', css: 'var(--accent-subtle)' },
] as const;

const ROW_TWO = [
  { token: '--border', css: 'var(--border)' },
  { token: '--chart-1', css: 'var(--chart-1)' },
  { token: '--chart-2', css: 'var(--chart-2)' },
  { token: '--chart-3', css: 'var(--chart-3)' },
  { token: '--chart-4', css: 'var(--chart-4)' },
  { token: '--chart-5', css: 'var(--chart-5)' },
] as const;

function Swatches({ items }: { items: readonly { token: string; css: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {items.map((s) => (
        <div key={s.token} className="flex min-w-0 flex-col gap-1.5">
          <span
            className="border-border h-12 rounded-md border"
            style={{ background: s.css }}
            aria-hidden
          />
          <span className="text-foreground-subtle truncate font-mono text-[0.625rem]">
            {s.token}
          </span>
        </div>
      ))}
    </div>
  );
}

/** What the current theme resolves to, straight from the tokens. */
export function TokenSwatches() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tokens</CardTitle>
        <p className="text-foreground-subtle text-xs">
          Every colour on this page resolves from these — nothing is hard-coded.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Swatches items={ROW_ONE} />
        <Swatches items={ROW_TWO} />
      </CardContent>
    </Card>
  );
}
