import { routeToHash, previewUrl } from '../routing';
import { CHANGELOG_URL, GITHUB_URL, NPM_URL, VERSION } from '../site.config';
import { BrandMark } from '../components/BrandMark';

/**
 * Site-wide footer rendered on Home + all doc routes. Hidden on standalone
 * preview tabs so it doesn't pollute template screenshots.
 */
export function ShowcaseFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-border bg-background mt-20 border-t">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-8 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <BrandMark className="text-sm" />
          <p className="text-foreground-muted max-w-xs text-xs">
            Refined-minimal Tailwind v4 + React design system. MIT-licensed.
          </p>
          <p className="text-foreground-subtle text-xs">
            © {year} Gerege Systems · v{VERSION}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-xs sm:grid-cols-3">
          <Column
            title="Docs"
            links={[
              { label: 'Components', href: `#${routeToHash({ kind: 'components-index' })}` },
              { label: 'Templates', href: `#${routeToHash({ kind: 'templates-index' })}` },
              { label: 'Guides', href: `#${routeToHash({ kind: 'guides-index' })}` },
            ]}
          />
          <Column
            title="Project"
            links={[
              { label: 'GitHub', href: GITHUB_URL, external: true },
              { label: 'npm', href: NPM_URL, external: true },
              { label: 'Releases', href: CHANGELOG_URL, external: true },
            ]}
          />
          <Column
            title="Resources"
            links={[
              {
                label: 'Quick start',
                href: `#${routeToHash({ kind: 'guide', slug: 'quickstart' })}`,
              },
              { label: 'Theming', href: `#${routeToHash({ kind: 'guide', slug: 'theming' })}` },
              {
                label: 'Dashboard preview',
                href: previewUrl('admin', 'app', 'sidebar'),
                external: true,
              },
            ]}
          />
        </div>
      </div>
    </footer>
  );
}

function Column({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <div className="text-foreground-subtle mb-2 text-xs font-semibold tracking-wider uppercase">
        {title}
      </div>
      <ul>
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noreferrer' : undefined}
              className="text-foreground-muted hover:text-foreground focus-visible:ring-ring inline-flex min-h-6 items-center rounded-sm py-1 outline-none focus-visible:ring-2"
            >
              {l.label}
              {l.external && <span className="text-foreground-subtle ml-0.5">↗</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
