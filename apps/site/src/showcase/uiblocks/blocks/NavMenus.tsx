import { Card, CardContent, Icons } from '@gerege-systems/ui';

const GROUPS = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', icon: 'LayoutGrid', active: true },
      { name: 'Transactions', icon: 'ArrowUpDown', active: false },
      { name: 'Investments', icon: 'BarChart3', active: false },
      { name: 'Accounts', icon: 'Wallet', active: false },
    ],
  },
  {
    label: 'Planning',
    items: [
      { name: 'Goals', icon: 'Star', active: false },
      { name: 'Budget', icon: 'ChartPie', active: false },
      { name: 'Reports', icon: 'FileText', active: false },
      { name: 'Documents', icon: 'Folder', active: false },
    ],
  },
] as const;

export function NavMenus() {
  return (
    <Card padding="sm">
      <CardContent className="flex flex-col gap-4">
        {GROUPS.map((g) => (
          <div key={g.label} className="flex flex-col gap-1">
            <span className="text-foreground-subtle px-2 py-1 text-xs">{g.label}</span>
            <nav aria-label={g.label} className="flex flex-col gap-px">
              {g.items.map((it) => {
                const Glyph = Icons[it.icon];
                return (
                  <a
                    key={it.name}
                    href={`/${it.name.toLowerCase()}`}
                    aria-current={it.active ? 'page' : undefined}
                    className={
                      it.active
                        ? 'bg-background-muted text-foreground flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium'
                        : 'text-foreground-muted hover:bg-background-muted hover:text-foreground flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm'
                    }
                  >
                    <Glyph aria-hidden className="size-4 shrink-0" />
                    {it.name}
                  </a>
                );
              })}
            </nav>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
