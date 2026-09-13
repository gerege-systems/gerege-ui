import { TopNav, TopNavLink } from '@/components/ui/TopNav';
import { Avatar } from '@/components/ui/Avatar';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'top-nav',
  name: 'TopNav',
  group: 'Navigation',
  description:
    'Horizontal app header. Slots: logo, nav (links), and actions (search, profile). Use as the chrome at the top of a dashboard.',
  exports: ['TopNav', 'TopNavLink'],
  i18n: 'Reads `topNav.label` (the <nav> aria-label).',
  sourceFile: 'TopNav.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <div className="border-border w-full max-w-2xl overflow-hidden rounded-md border">
          <TopNav
            logo={<span className="text-sm font-semibold">Atlas</span>}
            nav={
              <nav className="flex items-center gap-3 text-sm">
                <TopNavLink href="#components/top-nav" active>
                  Home
                </TopNavLink>
                <TopNavLink href="#components/sidebar">Projects</TopNavLink>
                <TopNavLink href="#components/avatar">Members</TopNavLink>
              </nav>
            }
            actions={<Avatar fallback="BO" size="sm" />}
          />
        </div>
      ),
      code: `<TopNav
  logo={<span className="text-sm font-semibold">Atlas</span>}
  nav={
    <nav className="flex items-center gap-3 text-sm">
      <TopNavLink href="/" active>Home</TopNavLink>
      <TopNavLink href="/projects">Projects</TopNavLink>
    </nav>
  }
  actions={<Avatar fallback="BO" size="sm" />}
/>`,
    },
    {
      title: 'asChild with a router link',
      description:
        'TopNavLink renders an <a>. Pass `asChild` to merge its styles and `aria-current` onto a router <Link> so client-side navigation keeps working.',
      preview: (
        <div className="border-border w-full max-w-2xl overflow-hidden rounded-md border">
          <TopNav
            logo={<span className="text-sm font-semibold">Atlas</span>}
            nav={
              <nav className="flex items-center gap-3 text-sm">
                <TopNavLink asChild active>
                  <a href="#components/top-nav">Home</a>
                </TopNavLink>
                <TopNavLink asChild>
                  <a href="#components/sidebar">Projects</a>
                </TopNavLink>
              </nav>
            }
          />
        </div>
      ),
      code: `<TopNavLink asChild active={pathname === '/'}>
  <Link to="/">Home</Link>
</TopNavLink>`,
    },
  ],
  api: [
    {
      title: 'TopNav',
      rows: [
        { name: 'logo', type: 'ReactNode', description: 'Leftmost slot — brand mark or wordmark.' },
        { name: 'nav', type: 'ReactNode', description: 'Center slot — link list.' },
        {
          name: 'actions',
          type: 'ReactNode',
          description: 'Right slot — search, profile, notifications.',
        },
      ],
    },
    {
      title: 'TopNavLink',
      rows: [
        { name: 'href', type: 'string', required: true, description: 'Destination.' },
        {
          name: 'active',
          type: 'boolean',
          default: 'false',
          description: 'Highlights as current.',
        },
      ],
    },
  ],
  accessibility: ['TopNavLink with `active` sets aria-current="page".'],
  keyboard: [
    {
      key: 'Tab / Shift+Tab',
      action: 'Move through the nav links, the search slot and the actions in order.',
    },
    { key: 'Enter', action: 'Follow the focused link.' },
  ],
  related: [{ slug: 'sidebar', reason: 'For vertical app nav.' }],
};

export default doc;
