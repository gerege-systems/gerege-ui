import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { ExternalLink, Search } from '@/icons';
import { cn } from '@/lib/utils';
import { routeToHash } from '../routing';
import { CopyBlockButton } from '../uiblocks/BlockSource';
import { BLOCK_CATEGORIES, UI_BLOCKS, type BlockCategory } from '../uiblocks/registry';

/**
 * `#blocks` — the sections, rendered live at full size.
 *
 * Blocks are not exported from the package: the code becomes yours, so the
 * listing's job is to let you judge one and take it, not to document an API.
 * Previews render at real size rather than as thumbnails, because a screenshot
 * of a block tells you nothing about how it wraps.
 */
export function BlocksIndexPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<BlockCategory | 'All'>('All');

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return UI_BLOCKS.filter(
      (b) =>
        (category === 'All' || b.category === category) &&
        (q === '' ||
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)),
    );
  }, [query, category]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        BLOCK_CATEGORIES.map((c) => [c, UI_BLOCKS.filter((b) => b.category === c).length]),
      ) as Record<BlockCategory, number>,
    [],
  );

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-8">
      <header className="flex max-w-2xl flex-col gap-1.5 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Blocks</h1>
        <p className="text-foreground-muted text-sm">
          Sections composed from the primitives, shipped as source to copy. Try them under a
          different theme on the <a href={`#${routeToHash({ kind: 'theme' })}`}>Theme</a> page; for
          whole multi-page products see{' '}
          <a href={`#${routeToHash({ kind: 'templates-index' })}`}>Templates</a>.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          aria-label="Search blocks"
          placeholder="Search blocks"
          prefix={<Search />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {(['All', ...BLOCK_CATEGORIES] as const).map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? 'primary' : 'secondary'}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
              <span
                className={cn('text-xs', category === c ? 'opacity-80' : 'text-foreground-subtle')}
              >
                {c === 'All' ? UI_BLOCKS.length : counts[c]}
              </span>
            </Button>
          ))}
        </div>
        <span className="grow" />
        <span className="text-foreground-subtle text-xs">
          {matches.length} of {UI_BLOCKS.length}
        </span>
      </div>

      {matches.length === 0 ? (
        <EmptyState
          title="No blocks match"
          description="Try a different word, or clear the category filter."
          action={
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setQuery('');
                setCategory('All');
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {matches.map((b) => (
            <section key={b.slug} className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-sm font-semibold">
                      <a href={`#${routeToHash({ kind: 'block', slug: b.slug })}`}>{b.name}</a>
                    </h2>
                    <Badge tone="neutral">{b.category}</Badge>
                  </div>
                  <p className="text-foreground-subtle text-xs">{b.description}</p>
                </div>
                <span className="grow" />
                <div className="flex shrink-0 items-center gap-2">
                  <CopyBlockButton file={b.file} />
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`#${routeToHash({ kind: 'block', slug: b.slug })}`}>
                      <ExternalLink aria-hidden />
                      Open
                    </a>
                  </Button>
                </div>
              </div>
              {/* No frame around the preview: every block is already a Card,
                  so a bordered surface behind it reads as a card in a card. */}
              <b.Component />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
