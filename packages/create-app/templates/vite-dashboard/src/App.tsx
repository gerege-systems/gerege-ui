import { useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Icons,
  Input,
  Sidebar,
  SidebarItem,
  SidebarSection,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Toaster,
  TooltipProvider,
  TopNav,
  toast,
} from '@gerege/ui';

type NavKey = 'overview' | 'projects' | 'customers' | 'billing' | 'settings';

const stats = [
  { label: 'Revenue', value: '$48,200', delta: '+12.4%', tone: 'success' as const },
  { label: 'Active users', value: '2,310', delta: '+3.1%', tone: 'success' as const },
  { label: 'Open tickets', value: '14', delta: '-2', tone: 'neutral' as const },
  { label: 'Churn', value: '1.8%', delta: '+0.2%', tone: 'warning' as const },
];

const orders = [
  { id: 'ORD-1042', customer: 'Alex Morgan', amount: '$1,200.00', status: 'Paid' },
  { id: 'ORD-1041', customer: 'Jamie Lee', amount: '$340.00', status: 'Pending' },
  { id: 'ORD-1040', customer: 'Sam Patel', amount: '$89.00', status: 'Failed' },
  { id: 'ORD-1039', customer: 'Riley Chen', amount: '$2,050.00', status: 'Paid' },
];

const statusTone = { Paid: 'success', Pending: 'warning', Failed: 'danger' } as const;

const Brand = () => (
  <span className="flex items-center gap-2 text-sm font-semibold">
    <span className="bg-accent text-on-accent inline-flex size-6 items-center justify-center rounded-md text-xs">
      <Icons.Zap className="size-3.5" />
    </span>
    __PROJECT_NAME__
  </span>
);

export function App() {
  const [active, setActive] = useState<NavKey>('overview');

  return (
    <TooltipProvider>
      <div className="bg-background text-foreground flex min-h-screen">
        <Sidebar header={<Brand />}>
          <SidebarSection label="Workspace">
            <SidebarItem
              icon={<Icons.Home />}
              active={active === 'overview'}
              onClick={() => setActive('overview')}
            >
              Overview
            </SidebarItem>
            <SidebarItem
              icon={<Icons.Folder />}
              active={active === 'projects'}
              onClick={() => setActive('projects')}
            >
              Projects
            </SidebarItem>
            <SidebarItem
              icon={<Icons.Users />}
              active={active === 'customers'}
              onClick={() => setActive('customers')}
              trailing={<Badge tone="accent">3</Badge>}
            >
              Customers
            </SidebarItem>
          </SidebarSection>
          <SidebarSection label="Account">
            <SidebarItem
              icon={<Icons.CreditCard />}
              active={active === 'billing'}
              onClick={() => setActive('billing')}
            >
              Billing
            </SidebarItem>
            <SidebarItem
              icon={<Icons.Settings />}
              active={active === 'settings'}
              onClick={() => setActive('settings')}
            >
              Settings
            </SidebarItem>
          </SidebarSection>
        </Sidebar>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav
            logo={<span className="text-sm font-medium capitalize">{active}</span>}
            search={<Input type="search" placeholder="Search…" aria-label="Search" />}
            actions={
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Notifications"
                  onClick={() => toast({ title: 'No new notifications' })}
                >
                  <Icons.Bell />
                </Button>
                <Avatar fallback="AM" alt="Alex Morgan" size="sm" />
              </>
            }
          />

          <main className="flex flex-1 flex-col gap-6 p-6">
            {active === 'overview' ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-lg font-semibold">Overview</h1>
                    <p className="text-foreground-muted text-sm">
                      Replace this with your own data — every section is a primitive.
                    </p>
                  </div>
                  <Button onClick={() => toast({ title: 'Report queued', variant: 'success' })}>
                    <Icons.Download />
                    Export
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((s) => (
                    <Card key={s.label}>
                      <CardHeader>
                        <CardDescription>{s.label}</CardDescription>
                        <CardTitle className="text-2xl tabular-nums">{s.value}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge tone={s.tone}>{s.delta}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent orders</CardTitle>
                    <CardDescription>Last 24 hours.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((o) => (
                          <TableRow key={o.id}>
                            <TableCell className="font-mono text-xs">{o.id}</TableCell>
                            <TableCell>{o.customer}</TableCell>
                            <TableCell>
                              <Badge tone={statusTone[o.status as keyof typeof statusTone]} dot>
                                {o.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right tabular-nums">{o.amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            ) : (
              <EmptyState
                title={`Nothing in ${active} yet`}
                description="This page is a placeholder — build it from @gerege/ui primitives."
                action={<Button onClick={() => setActive('overview')}>Back to overview</Button>}
              />
            )}
          </main>
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
