import { Breadcrumbs, Card, CardContent, Icons } from '@gerege-systems/ui';

const ROWS = [
  {
    name: 'Change transfer limit',
    desc: 'Adjust how much you can send from your balance.',
    icon: 'ArrowUpDown',
  },
  {
    name: 'Scheduled transfers',
    desc: 'Set up a transfer to send at a later date.',
    icon: 'Calendar',
  },
  { name: 'Direct debits', desc: 'Set up and manage regular payments.', icon: 'Receipt' },
  {
    name: 'Recurring card payments',
    desc: 'Manage your repeated card transactions.',
    icon: 'CreditCard',
  },
] as const;

export function PaymentsMenu() {
  return (
    <Card padding="sm">
      <CardContent className="flex flex-col gap-3">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Settings', href: '/settings' },
            { label: 'Payments' },
          ]}
        />
        <div className="flex flex-col gap-2">
          {ROWS.map((r) => {
            const Glyph = Icons[r.icon];
            return (
              <a
                key={r.name}
                href={`/payments/${r.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-background-subtle hover:bg-background-muted focus-visible:ring-ring flex items-start gap-3 rounded-md p-3 focus-visible:ring-2 focus-visible:outline-none"
              >
                <Glyph aria-hidden className="text-foreground-subtle mt-0.5 size-4 shrink-0" />
                <div className="flex min-w-0 grow flex-col">
                  <span className="text-sm font-medium">{r.name}</span>
                  <span className="text-foreground-subtle text-xs">{r.desc}</span>
                </div>
                <Icons.ChevronRight
                  aria-hidden
                  className="text-foreground-subtle mt-0.5 size-4 shrink-0"
                />
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
