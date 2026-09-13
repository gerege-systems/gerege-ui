import { useMemo, useState } from 'react';
import { ExternalLink, X } from '@/icons';
import { templateDocs } from '../registry/templates';
import { previewUrl, routeToHash } from '../routing';

/**
 * Templates index. Each card's primary action opens the live preview in a new
 * browser tab (a stretched overlay link), so a template "pops out" of the
 * docs the moment it's clicked. A secondary "Docs" link, layered above the
 * overlay, stays in-site for the API + usage page.
 */
export function TemplatesIndexPage() {
  const allUseCases = useMemo(() => {
    const set = new Set<string>();
    for (const t of templateDocs) {
      for (const u of t.useCases ?? []) set.add(u);
    }
    return Array.from(set).sort();
  }, []);

  const [active, setActive] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (active.size === 0) return templateDocs;
    return templateDocs.filter((t) => (t.useCases ?? []).some((u) => active.has(u)));
  }, [active]);

  const toggle = (u: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(u)) next.delete(u);
      else next.add(u);
      return next;
    });

  return (
    <div>
      <header className="border-border mb-10 border-b pb-6">
        <p className="text-accent text-xs font-medium tracking-wider uppercase">Templates</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page templates</h1>
        <p className="text-foreground-muted mt-3 max-w-2xl text-base leading-relaxed">
          Ready-made layouts composed entirely from the library's own primitives. Click any template
          to open its full-bleed live preview in a new tab — try the brand and theme switchers
          there. The <span className="text-foreground">Docs</span> link keeps the API and usage
          in-site.
        </p>
      </header>

      {allUseCases.length > 0 && (
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-foreground-subtle text-xs tracking-wider uppercase">
              Filter by use case
            </span>
            {active.size > 0 && (
              <button
                type="button"
                onClick={() => setActive(new Set())}
                className="text-foreground-muted hover:text-foreground inline-flex min-h-6 items-center gap-1 py-1 text-xs"
              >
                <X className="size-3" />
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allUseCases.map((u) => {
              const on = active.has(u);
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => toggle(u)}
                  aria-pressed={on}
                  className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    on
                      ? 'border-accent bg-accent-soft text-on-accent-soft'
                      : 'border-border bg-background text-foreground-muted hover:border-border-strong hover:text-foreground'
                  }`}
                >
                  {u}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="border-border bg-background-subtle text-foreground-muted rounded-md border border-dashed p-6 text-center text-sm">
          No templates match the selected use cases.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((doc) => {
            const preview = doc.slug;
            return (
              <div
                key={doc.slug}
                className="group border-border bg-card hover:border-accent relative flex flex-col gap-2 rounded-md border p-5 transition-colors"
              >
                {/* Stretched overlay link — primary action opens the preview tab. */}
                <a
                  href={previewUrl(preview)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open the ${doc.name} preview in a new tab`}
                  className="focus-visible:ring-ring absolute inset-0 rounded-md focus-visible:ring-2 focus-visible:outline-hidden"
                />

                <div className="flex items-center justify-between">
                  <div className="text-foreground text-base font-medium">{doc.name}</div>
                  <ExternalLink
                    className="text-foreground-subtle group-hover:text-accent size-4 transition-colors"
                    aria-hidden
                  />
                </div>
                <div className="text-foreground-muted text-sm leading-relaxed">
                  {doc.description}
                </div>

                {doc.useCases && doc.useCases.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {doc.useCases.map((u, i) => (
                      <span
                        key={i}
                        className={`rounded-full border px-2 py-0.5 text-xs ${
                          active.has(u)
                            ? 'border-accent bg-accent-soft text-on-accent-soft'
                            : 'border-border bg-background text-foreground-subtle'
                        }`}
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-2 flex items-center gap-3 text-xs">
                  <a
                    href={previewUrl(preview)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent relative z-10 inline-flex min-h-6 items-center gap-1 py-1 font-medium hover:underline"
                  >
                    Open preview <ExternalLink className="size-3" aria-hidden />
                  </a>
                  <a
                    href={`#${routeToHash({ kind: 'template', slug: doc.slug })}`}
                    className="text-foreground-muted hover:text-foreground relative z-10 inline-flex min-h-6 items-center py-1"
                  >
                    Docs
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
