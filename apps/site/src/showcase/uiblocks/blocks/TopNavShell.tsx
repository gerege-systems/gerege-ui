import { Avatar, Badge, Button, Card, CardContent, TopNav, TopNavLink } from '@gerege-systems/ui';

export function TopNavShell() {
  return (
    <Card padding="sm" className="overflow-hidden">
      <CardContent>
        <div className="border-border overflow-hidden rounded-md border">
          <TopNav
            logo={<span className="text-sm font-semibold">Atlas</span>}
            nav={
              <nav className="flex items-center gap-3 text-sm">
                <TopNavLink href="#" active>
                  Overview
                </TopNavLink>
                <TopNavLink href="#">Orders</TopNavLink>
                <TopNavLink href="#">Customers</TopNavLink>
              </nav>
            }
            actions={
              <div className="flex items-center gap-2">
                <Badge tone="success">Live</Badge>
                <Button size="sm" variant="secondary">
                  Invite
                </Button>
                <Avatar fallback="BO" size="sm" />
              </div>
            }
          />
          <div className="text-foreground-muted p-6 text-sm">
            Content area. Use the top nav when the product has fewer than seven destinations.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
