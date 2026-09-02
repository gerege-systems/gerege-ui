import { cn } from '@/lib/utils';
import { Menu, Search } from '@/icons';
import { Kbd } from '@/components/ui/Kbd';
import { IconButton } from '@/components/ui/IconButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useModifierKey } from '@/hooks/use-modifier-key';
import { routeToHash, type Route } from '../routing';
import { GITHUB_URL, NPM_URL } from '../site.config';
import { BrandMark } from '../components/BrandMark';
import { BrandSwitcher, ThemeToggle } from '../theme/Controls';

interface ShowcaseTopBarProps {
  onOpenPalette: () => void;
  current: Route;
}

const NAV: { label: string; route: Route; matchKinds: Route['kind'][] }[] = [
  {
    label: 'Components',
    route: { kind: 'components-index' },
    matchKinds: ['components-index', 'component'],
  },
  {
    label: 'Templates',
    route: { kind: 'templates-index' },
    matchKinds: ['templates-index', 'template'],
  },
  { label: 'Guides', route: { kind: 'guides-index' }, matchKinds: ['guides-index', 'guide'] },
  { label: 'Theme', route: { kind: 'theme' }, matchKinds: ['theme'] },
];

/** Persistent top bar shared by Home + docs pages (hidden on preview tabs). */
export function ShowcaseTopBar({ onOpenPalette, current }: ShowcaseTopBarProps) {
  const mod = useModifierKey();
  return (
    <header className="border-border bg-background sticky top-0 z-[var(--z-sticky)] border-b">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-6 px-6">
        <a
          href={`#${routeToHash({ kind: 'home' })}`}
          className="focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Home"
        >
          <BrandMark />
        </a>

        <nav className="text-foreground-muted hidden items-center gap-1 text-sm sm:flex">
          {NAV.map((item) => {
            const active = item.matchKinds.includes(current.kind);
            return (
              <a
                key={item.label}
                href={`#${routeToHash(item.route)}`}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-1.5 transition-colors outline-none',
                  'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
                  active ? 'text-foreground' : 'hover:bg-background-muted hover:text-foreground',
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label={`Search (${mod.label}+K)`}
            className="border-border-input bg-card text-foreground-subtle hover:border-border-strong hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background hidden h-8 w-44 items-center gap-2 rounded-md border pr-1.5 pl-2.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:flex lg:w-56"
          >
            <Search className="size-4 shrink-0" aria-hidden />
            <span className="flex-1 truncate text-left text-xs">Search docs…</span>
            <Kbd className="shrink-0">{mod.symbol} K</Kbd>
          </button>

          <BrandSwitcher />

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={iconLinkClass}
            aria-label="GitHub repository"
          >
            <GithubGlyph />
          </a>
          <a
            href={NPM_URL}
            target="_blank"
            rel="noreferrer"
            className={iconLinkClass}
            aria-label="npm package"
          >
            <NpmGlyph />
          </a>

          <ThemeToggle />

          {/* < sm: nav + search + external links collapse into one menu. */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                aria-label="Open menu"
                icon={<Menu />}
                variant="ghost"
                size="sm"
                className="sm:hidden"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={onOpenPalette}>
                <Search aria-hidden />
                Search docs…
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {NAV.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <a
                    href={`#${routeToHash(item.route)}`}
                    aria-current={item.matchKinds.includes(current.kind) ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={NPM_URL} target="_blank" rel="noreferrer">
                  npm
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

/** ≥32px hit area + visible focus ring for the icon-only links. */
const iconLinkClass = cn(
  'hidden size-8 items-center justify-center rounded-md text-foreground-muted outline-none transition-colors sm:inline-flex',
  'hover:bg-background-muted hover:text-foreground',
  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
);

function GithubGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56v-2.07c-3.2.7-3.87-1.37-3.87-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.04 1.78 2.72 1.26 3.38.97.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.27-5.24-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.17.92-.26 1.91-.39 2.9-.39s1.98.13 2.9.39c2.21-1.48 3.18-1.17 3.18-1.17.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.07 0 4.39-2.69 5.36-5.25 5.64.41.35.78 1.03.78 2.08v3.08c0 .31.21.67.8.55C20.21 21.4 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function NpmGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M3 3v18h6V9h6v12h6V3H3zm12 6h-3v6h3V9z" />
    </svg>
  );
}
