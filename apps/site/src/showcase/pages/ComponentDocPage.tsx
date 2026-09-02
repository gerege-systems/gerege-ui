import { useEffect, useState } from 'react';
import { ExternalLink } from '@/icons';
import type { ComponentDoc, PropGroup, PropRow } from '../registry/types';
import { getRelatedDocs } from '../registry/components';
import { CodeBlock } from '../widgets/CodeBlock';
import { CodePreview } from '../widgets/CodePreview';
import { PropsTable } from '../widgets/PropsTable';
import { Kbd } from '@/components/ui/Kbd';
import { SectionAnchor } from '../widgets/SectionAnchor';
import { routeToHash } from '../routing';
import { SRC_UI as GITHUB_BLOB } from '../site.config';

interface ComponentDocPageProps {
  doc: ComponentDoc;
}

export function ComponentDocPage({ doc }: ComponentDocPageProps) {
  const related = doc.related ? getRelatedDocs(doc.related.map((r) => r.slug)) : [];

  const importLine = `import { ${doc.exports.join(', ')} } from '${doc.importPath ?? '@gerege/ui'}';`;

  // The generated-props table is ~5k lines of data used only here — load it on
  // demand so it never sits in the initial bundle. Generated rows render by
  // default; hand-written `doc.api` rows are merged on top (same prop name →
  // manual wins, new names are appended) so docs can annotate without
  // re-listing every prop.
  const [apiGroups, setApiGroups] = useState<PropGroup[]>(() => doc.api ?? []);
  useEffect(() => {
    let alive = true;
    setApiGroups(doc.api ?? []);
    import('../registry/generated-props').then((m) => {
      if (alive)
        setApiGroups(mergeApiGroups(resolveGeneratedGroups(doc, m.getGeneratedProps), doc.api));
    });
    return () => {
      alive = false;
    };
  }, [doc]);

  return (
    <article className="max-w-3xl">
      <header className="border-border mb-10 border-b pb-6">
        <p className="text-accent text-xs font-medium tracking-wider uppercase">{doc.group}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{doc.name}</h1>
        <p className="text-foreground-muted mt-3 text-base leading-relaxed">{doc.description}</p>
        <a
          href={`${GITHUB_BLOB}/${doc.sourceFile}`}
          target="_blank"
          rel="noreferrer"
          className="text-foreground-muted hover:text-accent mt-4 inline-flex min-h-6 items-center gap-1 py-1 text-xs"
        >
          View source <ExternalLink className="size-3" aria-hidden />
        </a>
      </header>

      <SectionAnchor id="import">Import</SectionAnchor>
      <CodeBlock code={importLine} />
      {doc.i18n && (
        <p className="text-foreground-muted mt-3 text-sm leading-relaxed">
          <span className="text-foreground font-medium">i18n:</span> {doc.i18n} Override via{' '}
          <a
            href={`#${routeToHash({ kind: 'component', slug: 'design-system-provider' })}`}
            className="prose-link"
          >
            DesignSystemProvider <code>strings</code>
          </a>
          .
        </p>
      )}

      {doc.examples.length > 0 && (
        <>
          <SectionAnchor id="examples">Examples</SectionAnchor>
          <div className="space-y-10">
            {doc.examples.map((ex, i) => {
              const exId = `ex-${slugify(ex.title)}-${i}`;
              return (
                <section key={exId}>
                  <SectionAnchor id={exId} level={3}>
                    {ex.title}
                  </SectionAnchor>
                  {ex.description && (
                    <p className="text-foreground-muted mb-4 text-sm leading-relaxed">
                      {ex.description}
                    </p>
                  )}
                  <CodePreview
                    preview={ex.preview}
                    code={ex.code}
                    surfaceClassName={ex.surfaceClassName}
                  />
                </section>
              );
            })}
          </div>
        </>
      )}

      {apiGroups.length > 0 && (
        <>
          <SectionAnchor id="api">API reference</SectionAnchor>
          <PropsTable groups={apiGroups} />
        </>
      )}

      {doc.keyboard && doc.keyboard.length > 0 && (
        <>
          <SectionAnchor id="keyboard">Keyboard</SectionAnchor>
          <div
            className="border-border scroll-region overflow-x-auto rounded-md border"
            tabIndex={0}
            role="region"
            aria-label="Keyboard shortcuts table"
          >
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-border bg-background-subtle/60 text-foreground-subtle border-b text-xs tracking-wider uppercase">
                  <th scope="col" className="px-3 py-2 font-medium">
                    Key
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {doc.keyboard.map((k, i) => (
                  <tr key={i} className="border-border border-b align-top last:border-b-0">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="inline-flex flex-wrap items-center gap-1">
                        {k.key.split(' / ').map((part) => (
                          <Kbd key={part}>{part}</Kbd>
                        ))}
                      </span>
                    </td>
                    <td className="text-foreground-muted px-3 py-2">{k.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {doc.guidelines && (doc.guidelines.do.length > 0 || doc.guidelines.dont.length > 0) && (
        <>
          <SectionAnchor id="guidelines">Do / Don&apos;t</SectionAnchor>
          <div className="grid gap-4 sm:grid-cols-2">
            <GuidelineList heading="Do" tone="success" items={doc.guidelines.do} />
            <GuidelineList heading="Don't" tone="danger" items={doc.guidelines.dont} />
          </div>
        </>
      )}

      {doc.accessibility && doc.accessibility.length > 0 && (
        <>
          <SectionAnchor id="accessibility">Accessibility</SectionAnchor>
          <ul className="text-foreground-muted space-y-1.5 text-sm">
            {doc.accessibility.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="bg-accent mt-2 size-1 shrink-0 rounded-full" />
                <span className="leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {related.length > 0 && (
        <>
          <SectionAnchor id="related">Related</SectionAnchor>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((rel) => {
              const reason = doc.related?.find((r) => r.slug === rel.slug)?.reason;
              return (
                <a
                  key={rel.slug}
                  href={`#${routeToHash({ kind: 'component', slug: rel.slug })}`}
                  className="border-border bg-card hover:border-accent block rounded-md border p-4 transition-colors"
                >
                  <div className="text-foreground text-sm font-medium">{rel.name}</div>
                  {reason && <div className="text-foreground-muted mt-1 text-xs">{reason}</div>}
                </a>
              );
            })}
          </div>
        </>
      )}
    </article>
  );
}

function GuidelineList({
  heading,
  tone,
  items,
}: {
  heading: string;
  tone: 'success' | 'danger';
  items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="border-border bg-card rounded-md border p-4">
      <h3
        className={
          tone === 'success'
            ? 'text-success-text mb-3 text-sm font-semibold'
            : 'text-danger-text mb-3 text-sm font-semibold'
        }
      >
        {heading}
      </h3>
      <ul className="text-foreground-muted space-y-2 text-sm">
        {items.map((line, i) => (
          <li key={i} className="flex gap-2">
            <span
              aria-hidden
              className={
                tone === 'success'
                  ? 'bg-success-text mt-2 size-1 shrink-0 rounded-full'
                  : 'bg-danger-text mt-2 size-1 shrink-0 rounded-full'
              }
            />
            <span className="leading-relaxed">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Overlay hand-written prop rows on the generated ones. Generated groups keep
 * their order; a manual row whose name matches a generated row replaces it
 * (wherever it lives), unmatched manual rows are appended under their own
 * group. If nothing was generated, the manual groups render as-is.
 */
function mergeApiGroups(generated: PropGroup[], manual: PropGroup[] | undefined): PropGroup[] {
  if (!manual || manual.length === 0) return generated;
  if (generated.length === 0) return manual;

  const overrides = new Map<string, PropRow>();
  for (const g of manual) for (const r of g.rows) overrides.set(r.name, r);

  const used = new Set<string>();
  const merged: PropGroup[] = generated.map((g) => ({
    title: g.title,
    rows: g.rows.map((r) => {
      const o = overrides.get(r.name);
      if (!o) return r;
      used.add(r.name);
      return { ...r, ...o };
    }),
  }));

  for (const g of manual) {
    const extra = g.rows.filter((r) => !used.has(r.name));
    if (extra.length > 0) merged.push({ title: g.title ?? 'Notes', rows: extra });
  }
  return merged;
}

/**
 * Build prop groups from the auto-generated props (used when a doc file does
 * not declare `api` explicitly). Each exported name becomes its own group with
 * the component name as title (Card / CardHeader / CardTitle each get one).
 * Empty / unknown exports are dropped silently. `getGen` is the lazily-loaded
 * lookup from generated-props.
 */
function resolveGeneratedGroups(
  doc: ComponentDoc,
  getGen: (name: string) => PropGroup[] | undefined,
): PropGroup[] {
  const groups: PropGroup[] = [];
  for (const exportName of doc.exports) {
    const generated = getGen(exportName);
    if (!generated || generated.length === 0) continue;
    for (const g of generated) {
      if (g.rows.length === 0) continue;
      groups.push({
        title: doc.exports.length > 1 ? exportName : g.title,
        rows: g.rows,
      });
    }
  }
  return groups;
}
