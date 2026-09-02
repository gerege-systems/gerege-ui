import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { ArrowRight, Search } from '@/icons';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { routeToHash, type Route } from '../routing';

export interface DocSidebarEntry {
  slug: string;
  label: string;
  group: string;
}

export interface DocSidebarSection {
  /** Heading rendered above the section. Use 'top' for the "Get started" links. */
  title: string;
  /** kind = 'component' | 'template' | 'guide' — used to build the URL. */
  kind: 'component' | 'template' | 'guide';
  entries: DocSidebarEntry[];
}

interface DocSidebarProps {
  sections: DocSidebarSection[];
  current?: { kind: Route['kind']; slug?: string };
  /** Top links: Overview / Components index / Templates index / Guides index. */
  topLinks?: { label: string; route: Route }[];
  /**
   * Additional sections searched ONLY when a query is active. Lets the
   * Components-page sidebar surface matching Templates and Guides results
   * without showing them when the query is empty.
   */
  crossKindSections?: DocSidebarSection[];
  /**
   * Render variant. `'desktop'` (default) is sticky-positioned and hidden
   * on screens < md. `'mobile'` is plain block — meant to be embedded inside
   * a Sheet content.
   */
  variant?: 'desktop' | 'mobile';
  /** Called when a link is clicked. Mobile uses this to close the Sheet. */
  onNavigate?: () => void;
}

const KIND_LABEL: Record<DocSidebarSection['kind'], string> = {
  component: 'Components',
  template: 'Templates',
  guide: 'Guides',
};

interface FlatResult {
  kind: DocSidebarSection['kind'];
  slug: string;
  label: string;
  group: string;
  href: string;
}

export function DocSidebar({
  sections,
  current,
  topLinks = [],
  crossKindSections = [],
  variant = 'desktop',
  onNavigate,
}: DocSidebarProps) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  // When idle: show only the primary sections, grouped normally.
  const idleSections = useMemo(
    () =>
      sections.map((s) => ({
        ...s,
        groups: groupEntries(s.entries),
      })),
    [sections],
  );

  // When searching: combine primary + cross-kind sections, filter each.
  const searchSections = useMemo(() => {
    if (!q) return [];
    const all = [...sections, ...crossKindSections];
    return all
      .map((s) => ({
        ...s,
        groups: groupEntries(
          s.entries.filter(
            (e) => e.label.toLowerCase().includes(q) || e.group.toLowerCase().includes(q),
          ),
        ),
      }))
      .filter((s) => s.groups.length > 0);
  }, [sections, crossKindSections, q]);

  // Flat keyboard navigation list — in render order, across kinds + groups.
  const flatResults = useMemo<FlatResult[]>(() => {
    if (!q) return [];
    const out: FlatResult[] = [];
    for (const section of searchSections) {
      for (const group of section.groups) {
        for (const entry of group.entries) {
          out.push({
            kind: section.kind,
            slug: entry.slug,
            label: entry.label,
            group: entry.group,
            href: `#${routeToHash({ kind: section.kind, slug: entry.slug } as Route)}`,
          });
        }
      }
    }
    return out;
  }, [searchSections, q]);

  const [highlighted, setHighlighted] = useState(0);
  // Reset highlight whenever query (and therefore flatResults) changes.
  useEffect(() => {
    setHighlighted(0);
  }, [q]);

  const onSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setQuery('');
      return;
    }
    if (flatResults.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % flatResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((i) => (i - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = flatResults[highlighted];
      if (target) {
        window.location.hash = target.href.slice(1);
        setQuery('');
        onNavigate?.();
      }
    }
  };

  const isSearching = q.length > 0;
  const renderedSections = isSearching ? searchSections : idleSections;
  let flatIndex = -1;

  return (
    <aside
      className={
        variant === 'mobile'
          ? 'bg-background h-full w-full overflow-y-auto px-4 py-4'
          : // No left padding: the container already supplies px-6, and another
            // 16px on top of it put the whole rail 16px right of the brand mark
            // in the bar above it.
            'border-border bg-background sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r py-6 pr-4 pl-0 md:block'
      }
    >
      <div className="mb-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onSearchKeyDown}
          placeholder="Search…"
          prefix={<Search className="size-3.5" />}
          hideLabel
          label="Search docs"
          size="sm"
          clearable={isSearching}
          onClear={() => setQuery('')}
        />
        {isSearching && flatResults.length > 0 && (
          <p className="text-foreground-subtle mt-1.5 px-2 text-xs">
            ↑↓ to navigate · ↵ to open · Esc to clear
          </p>
        )}
      </div>

      {!isSearching && topLinks.length > 0 && (
        <nav className="mb-6 flex flex-col gap-px">
          {topLinks.map((link) => {
            const isActive = link.route.kind === current?.kind && !('slug' in link.route);
            return (
              <SidebarLink
                key={link.label}
                href={`#${routeToHash(link.route)}`}
                active={isActive}
                onNavigate={onNavigate}
              >
                {link.label}
              </SidebarLink>
            );
          })}
        </nav>
      )}

      {isSearching && renderedSections.length === 0 && (
        <p className="text-foreground-muted px-2 py-4 text-xs">No matches for "{query}".</p>
      )}

      {renderedSections.map((section) => (
        <div key={`${section.kind}-${section.title}`} className="mb-6">
          {isSearching && (
            <div className="mb-2 flex items-center justify-between px-2">
              <div className="text-foreground-subtle text-xs font-semibold tracking-wider uppercase">
                {KIND_LABEL[section.kind]}
              </div>
              {section.kind !== current?.kind && (
                <a
                  href={`#${routeToHash(indexRouteFor(section.kind))}`}
                  className="text-foreground-subtle hover:text-accent inline-flex min-h-6 items-center gap-0.5 py-1 text-xs"
                >
                  Open <ArrowRight className="size-2.5" aria-hidden />
                </a>
              )}
            </div>
          )}
          {section.groups.map((group) => (
            <div key={group.name} className="mb-3">
              {!isSearching && (
                <div className="text-foreground-muted mb-1 px-2 text-xs font-medium tracking-wide uppercase">
                  {group.name}
                </div>
              )}
              <div className="flex flex-col gap-px">
                {group.entries.map((entry) => {
                  const active = current?.kind === section.kind && current.slug === entry.slug;
                  const hash = routeToHash({
                    kind: section.kind,
                    slug: entry.slug,
                  } as Route);
                  if (isSearching) flatIndex += 1;
                  const isKbdHighlighted = isSearching && flatIndex === highlighted;
                  return (
                    <SidebarLink
                      key={entry.slug}
                      href={`#${hash}`}
                      active={active}
                      highlighted={isKbdHighlighted}
                      onNavigate={onNavigate}
                    >
                      {entry.label}
                    </SidebarLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}

function indexRouteFor(kind: DocSidebarSection['kind']): Route {
  if (kind === 'component') return { kind: 'components-index' };
  if (kind === 'template') return { kind: 'templates-index' };
  return { kind: 'guides-index' };
}

function SidebarLink({
  href,
  active,
  highlighted,
  onNavigate,
  children,
}: {
  href: string;
  active: boolean;
  highlighted?: boolean;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'rounded-md px-2 py-1.5 text-sm transition-colors',
        active
          ? 'bg-accent-soft text-on-accent-soft font-medium'
          : highlighted
            ? 'bg-background-muted text-foreground'
            : 'text-foreground-muted hover:bg-background-muted hover:text-foreground',
      )}
    >
      {children}
    </a>
  );
}

function groupEntries(entries: DocSidebarEntry[]) {
  const map = new Map<string, DocSidebarEntry[]>();
  for (const e of entries) {
    if (!map.has(e.group)) map.set(e.group, []);
    map.get(e.group)!.push(e);
  }
  // Preserve registry order within each group (it's deliberate — e.g. Guides
  // lead with "Quick start", Inputs lead with the text fields). Alphabetising
  // here pushed "Quick start" into the middle of the guides list.
  return Array.from(map.entries()).map(([name, entries]) => ({
    name,
    entries,
  }));
}
