import { Folder, Home, Settings, Users } from '@/icons';
import {
  Sidebar,
  SidebarGroup,
  SidebarItem,
  SidebarSection,
  useSidebar,
} from '@/components/ui/Sidebar';
import { BarChart3, FileText } from '@/icons';
import type { ComponentDoc } from '../registry/types';

function VersionFooter() {
  const { collapsed } = useSidebar();
  return (
    <span className="text-foreground-subtle text-xs">{collapsed ? 'v2' : 'v2.4.0 · stable'}</span>
  );
}

function GroupDemo() {
  return (
    <div className="border-border flex h-72 w-full max-w-lg overflow-hidden rounded-md border">
      <Sidebar className="!sticky-none !h-full" defaultCollapsed={false} footer={<VersionFooter />}>
        <SidebarSection>
          <SidebarItem icon={<Home />} active>
            Home
          </SidebarItem>
          <SidebarGroup icon={<BarChart3 />} label="Reports" defaultOpen>
            <SidebarItem sub>Revenue</SidebarItem>
            <SidebarItem sub>Retention</SidebarItem>
          </SidebarGroup>
          <SidebarItem icon={<FileText />}>Docs</SidebarItem>
        </SidebarSection>
      </Sidebar>
      <div className="bg-background-subtle text-foreground-muted flex-1 p-4 text-xs">
        Collapse the rail to see the footer shorten.
      </div>
    </div>
  );
}

const doc: ComponentDoc = {
  slug: 'sidebar',
  name: 'Sidebar',
  group: 'Navigation',
  description:
    'Sticky left navigation rail. Collapsible to icons-only. Compose SidebarSection + SidebarItem; access collapsed state via useSidebar().',
  exports: ['Sidebar', 'SidebarSection', 'SidebarItem', 'SidebarGroup', 'useSidebar'],
  i18n: 'Reads `sidebar.label` (nav aria-label), `sidebar.collapse` / `sidebar.expand` / `sidebar.collapseShort` (rail toggle).',
  sourceFile: 'Sidebar.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <div className="border-border flex h-64 w-full max-w-lg overflow-hidden rounded-md border">
          <Sidebar className="!sticky-none !h-full" defaultCollapsed={false}>
            <SidebarSection>
              <SidebarItem icon={<Home />} active>
                Home
              </SidebarItem>
              <SidebarItem icon={<Folder />}>Projects</SidebarItem>
              <SidebarItem icon={<Users />}>Members</SidebarItem>
              <SidebarItem icon={<Settings />}>Settings</SidebarItem>
            </SidebarSection>
          </Sidebar>
          <div className="bg-background-subtle text-foreground-muted flex-1 p-4 text-xs">
            Main content area
          </div>
        </div>
      ),
      code: `<Sidebar defaultCollapsed={false}>
  <SidebarSection>
    <SidebarItem icon={<Home />} active>Home</SidebarItem>
    <SidebarItem icon={<Folder />}>Projects</SidebarItem>
    <SidebarItem icon={<Users />}>Members</SidebarItem>
  </SidebarSection>
</Sidebar>`,
    },
    {
      title: 'asChild with a router link',
      description:
        "SidebarItem renders an <a> when given `href` and a <button> otherwise. Pass `asChild` to use your router's <Link> instead — styles, icon and active state are merged onto it.",
      preview: (
        <div className="border-border flex h-48 w-full max-w-lg overflow-hidden rounded-md border">
          <Sidebar className="!sticky-none !h-full" defaultCollapsed={false}>
            <SidebarSection>
              <SidebarItem icon={<Home />} asChild active>
                <a href="#components/sidebar">Home</a>
              </SidebarItem>
              <SidebarItem icon={<Folder />} asChild>
                <a href="#components/sidebar">Projects</a>
              </SidebarItem>
            </SidebarSection>
          </Sidebar>
          <div className="bg-background-subtle flex-1" />
        </div>
      ),
      code: `<SidebarItem icon={<Home />} asChild active={pathname === '/'}>
  <Link to="/">Home</Link>
</SidebarItem>`,
    },
    {
      title: 'Groups + useSidebar',
      description:
        'SidebarGroup is a collapsible sub-tree for a section with children pages. `useSidebar()` exposes the collapsed state to anything rendered inside the rail — here a footer that hides its label when the rail is icon-only.',
      preview: <GroupDemo />,
      code: `function VersionFooter() {
  const { collapsed } = useSidebar();
  return <span className="text-xs">{collapsed ? 'v2' : 'v2.4.0 · stable'}</span>;
}

<Sidebar footer={<VersionFooter />}>
  <SidebarSection>
    <SidebarItem icon={<Home />} active>Home</SidebarItem>
    <SidebarGroup icon={<BarChart3 />} label="Reports" defaultOpen>
      <SidebarItem sub>Revenue</SidebarItem>
      <SidebarItem sub>Retention</SidebarItem>
    </SidebarGroup>
  </SidebarSection>
</Sidebar>`,
    },
  ],
  api: [
    {
      title: 'Sidebar',
      rows: [
        {
          name: 'defaultCollapsed',
          type: 'boolean',
          default: 'false',
          description: 'Initial collapsed state.',
        },
        { name: 'collapsed', type: 'boolean', description: 'Controlled collapsed state.' },
        {
          name: 'onCollapsedChange',
          type: '(c: boolean) => void',
          description: 'Fires when collapse changes.',
        },
        { name: 'header', type: 'ReactNode', description: 'Rendered above nav (logo / brand).' },
        { name: 'footer', type: 'ReactNode', description: 'Rendered at the bottom (user menu).' },
      ],
    },
    {
      title: 'SidebarItem',
      rows: [
        { name: 'icon', type: 'ReactNode', description: 'Leading icon, always visible.' },
        {
          name: 'active',
          type: 'boolean',
          default: 'false',
          description: 'Highlights as current.',
        },
        {
          name: 'trailing',
          type: 'ReactNode',
          description: 'Right-aligned content (Badge, count).',
        },
        { name: 'href', type: 'string', description: 'If set, renders as an anchor.' },
      ],
    },
  ],
  accessibility: [
    'Renders as a real <nav>; SidebarItem with `active` sets aria-current="page".',
    'Collapsed icon-only items keep their label as aria-label so screen readers still announce them.',
  ],
  keyboard: [
    {
      key: 'Tab / Shift+Tab',
      action: 'Move through items, group toggles and the collapse button in document order.',
    },
    { key: 'Enter', action: 'Follow the focused item link (`href`) or activate a button item.' },
    {
      key: 'Enter / Space',
      action: 'Toggle a SidebarGroup open / closed, or collapse / expand the rail.',
    },
  ],
  related: [{ slug: 'top-nav', reason: 'Horizontal nav alternative.' }],
};

export default doc;
