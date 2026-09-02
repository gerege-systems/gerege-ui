import { ArrowRight, ExternalLink, Package, Sparkles } from '@/icons';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { componentDocs } from '../registry/components';
import { templateDocs } from '../registry/templates';
import { guideDocs } from '../registry/guides';
import { previewUrl, routeToHash } from '../routing';
import { CHANGELOG_URL, PKG_NAME, VERSION } from '../site.config';

const FEATURED = [
  'button',
  'input',
  'dialog',
  'data-grid',
  'card',
  'toast',
  'command-palette',
  'date-picker',
];

export function HomePage() {
  return (
    // Same column as the top bar and the footer (max-w-[1400px] px-6) so the
    // page does not start further in than the nav above it. The hero keeps its
    // own max-w-3xl measure.
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto max-w-[1400px] px-6 py-16 outline-none lg:py-24"
    >
      {/* Hero */}
      <div className="max-w-3xl">
        <div className="border-border bg-card text-foreground-muted mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
          <Sparkles className="text-accent size-3" aria-hidden />
          Refined-minimal · Tailwind v4 · React 18
        </div>
        <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
          A design system you can actually <span className="text-accent">use today</span>.
        </h1>
        <p className="text-foreground-muted mt-4 text-lg leading-relaxed">
          {componentDocs.length} accessible primitives, {templateDocs.length} page templates,{' '}
          {guideDocs.length} guides — all dark-mode-ready, all keyboard-accessible, all on one
          Tailwind v4 token system. Re-brand the whole thing live with the switcher up top.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild>
            <a href={`#${routeToHash({ kind: 'components-index' })}`}>
              Browse components <ArrowRight className="ml-1 size-4" aria-hidden />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`#${routeToHash({ kind: 'templates-index' })}`}>Browse templates</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href={`#${routeToHash({ kind: 'guide', slug: 'quickstart' })}`}>Quick start</a>
          </Button>
        </div>

        <div className="text-foreground-muted mt-6 flex flex-wrap items-center gap-2 text-xs">
          <a
            href={CHANGELOG_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent inline-flex items-center gap-1"
            aria-label="View release notes"
          >
            <Badge variant="outline" tone="neutral">
              v{VERSION}
            </Badge>
            <span className="text-foreground-subtle text-xs">release notes ↗</span>
          </a>
          <span>·</span>
          <code className="bg-background-muted rounded px-1.5 py-0.5 font-mono">
            pnpm add {PKG_NAME}
          </code>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          {
            label: 'Components',
            value: componentDocs.length,
            href: routeToHash({ kind: 'components-index' }),
          },
          {
            label: 'Templates',
            value: templateDocs.length,
            href: routeToHash({ kind: 'templates-index' }),
          },
          { label: 'Guides', value: guideDocs.length, href: routeToHash({ kind: 'guides-index' }) },
        ].map((s) => (
          <a
            key={s.label}
            href={`#${s.href}`}
            className="group border-border bg-card hover:border-accent flex items-baseline justify-between rounded-md border p-5 transition-colors"
          >
            <div>
              <div className="text-foreground-subtle text-xs tracking-wider uppercase">
                {s.label}
              </div>
              <div className="mt-1 text-3xl font-semibold tracking-tight">{s.value}</div>
            </div>
            <ArrowRight
              className="text-foreground-subtle group-hover:text-accent size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        ))}
      </div>

      {/* Highlighted templates — open in a new tab */}
      <section className="mt-20">
        <div className="mb-6 flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Templates</h2>
            <p className="text-foreground-muted mt-1 text-sm">Open live in a new tab ↗</p>
          </div>
          <a
            href={`#${routeToHash({ kind: 'templates-index' })}`}
            className="text-foreground-muted hover:text-accent text-sm"
          >
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {templateDocs.slice(0, 6).map((t) => (
            <a
              key={t.slug}
              href={previewUrl(t.slug)}
              target="_blank"
              rel="noreferrer"
              className="group border-border bg-card hover:border-accent flex flex-col gap-1.5 rounded-md border p-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-foreground text-sm font-medium">{t.name}</span>
                <ExternalLink
                  className="text-foreground-subtle group-hover:text-accent size-3.5 transition-colors"
                  aria-hidden
                />
              </div>
              <div className="text-foreground-muted text-xs leading-relaxed">{t.description}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Featured components */}
      <section className="mt-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Featured components</h2>
          <a
            href={`#${routeToHash({ kind: 'components-index' })}`}
            className="text-foreground-muted hover:text-accent text-sm"
          >
            View all →
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {FEATURED.map((slug) => componentDocs.find((d) => d.slug === slug))
            .filter((d): d is NonNullable<typeof d> => Boolean(d))
            .map((d) => (
              <a
                key={d.slug}
                href={`#${routeToHash({ kind: 'component', slug: d.slug })}`}
                className="group border-border bg-card hover:border-accent flex flex-col gap-1.5 rounded-md border p-4 transition-colors"
              >
                <div className="text-foreground text-sm font-medium">{d.name}</div>
                <div className="text-foreground-subtle text-xs tracking-wide uppercase">
                  {d.group}
                </div>
              </a>
            ))}
        </div>
      </section>

      {/* Install strip */}
      <section className="border-border bg-card mt-20 rounded-lg border p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Package className="text-accent size-4" aria-hidden />
              Install in seconds
            </div>
            <pre
              className="bg-background-muted scroll-region mt-3 overflow-x-auto rounded-md px-4 py-3 font-mono text-sm"
              tabIndex={0}
              role="region"
              aria-label="Install command"
            >
              <code>pnpm add {PKG_NAME}</code>
            </pre>
          </div>
          <Button asChild>
            <a href={`#${routeToHash({ kind: 'guide', slug: 'quickstart' })}`}>
              Read the Quick start <ArrowRight className="ml-1 size-4" aria-hidden />
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
