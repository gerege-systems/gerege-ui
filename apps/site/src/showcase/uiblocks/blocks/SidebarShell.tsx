import {
  Avatar,
  Button,
  Card,
  CardContent,
  Icons,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  SidebarSection,
} from '@gerege-systems/ui';

export function SidebarShell() {
  return (
    <Card padding="sm" className="overflow-hidden">
      <CardContent>
        <div className="border-border flex h-[22rem] overflow-hidden rounded-md border">
          <Sidebar className="!sticky-none !h-full" defaultCollapsed={false}>
            <SidebarSection>
              <SidebarItem icon={<Icons.Home />} active>
                Overview
              </SidebarItem>
              <SidebarItem icon={<Icons.Users />}>Customers</SidebarItem>
              <SidebarGroup icon={<Icons.BarChart3 />} label="Reports" defaultOpen>
                <SidebarItem sub>Revenue</SidebarItem>
                <SidebarItem sub>Retention</SidebarItem>
              </SidebarGroup>
              <SidebarItem icon={<Icons.Settings />}>Settings</SidebarItem>
            </SidebarSection>
          </Sidebar>
          <div className="flex min-w-0 grow flex-col">
            <div className="border-border flex h-12 shrink-0 items-center gap-3 border-b px-4">
              <span className="text-sm font-medium">Overview</span>
              <span className="grow" />
              <Button size="sm">New report</Button>
              <Avatar fallback="OC" size="sm" status="online" />
            </div>
            <div className="text-foreground-muted grow p-4 text-sm">
              Page content sits here. The rail collapses to icons under 1024px.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
