import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Icons } from '@gerege-systems/ui';

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    features: ['1 workspace', '2 members', 'Community support'],
    featured: false,
  },
  {
    name: 'Business',
    price: '89,000₮',
    features: ['10 workspaces', 'SSO + audit log', 'Priority support'],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Talk to us',
    features: ['Unlimited', 'SLA + DPA', 'Dedicated environment'],
    featured: false,
  },
] as const;

export function PricingTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
        <p className="text-foreground-subtle text-xs">Per workspace, billed monthly.</p>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={
              p.featured
                ? 'border-accent flex flex-col gap-3 rounded-lg border p-4'
                : 'border-border flex flex-col gap-3 rounded-lg border p-4'
            }
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{p.name}</span>
              {p.featured && <Badge tone="accent">Popular</Badge>}
            </div>
            <span className="text-2xl font-semibold tracking-tight">{p.price}</span>
            <ul className="flex flex-col gap-1.5">
              {p.features.map((f) => (
                <li key={f} className="text-foreground-muted flex items-start gap-2 text-sm">
                  <Icons.Check
                    aria-hidden
                    className="text-success-foreground mt-0.5 size-3.5 shrink-0"
                  />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant={p.featured ? 'primary' : 'secondary'} className="mt-auto w-full">
              {p.price === 'Talk to us' ? 'Contact sales' : 'Choose'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
