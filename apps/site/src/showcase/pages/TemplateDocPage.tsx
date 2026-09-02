import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from '@/icons';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import type { TemplateDoc } from '../registry/templates';
import { CodeBlock } from '../widgets/CodeBlock';
import { SectionAnchor } from '../widgets/SectionAnchor';
import { previewUrl } from '../routing';
import { SRC_BLOCKS } from '../site.config';

interface TemplateDocPageProps {
  doc: TemplateDoc;
}

/** Preview frame widths — the checklist's 375 / 768 / desktop breakpoints. */
const WIDTHS = [
  { key: 'mobile', label: 'Mobile', hint: '375px', width: 375 },
  { key: 'tablet', label: 'Tablet', hint: '768px', width: 768 },
  { key: 'desktop', label: 'Desktop', hint: '1280px', width: 1280 },
] as const;
type WidthKey = (typeof WIDTHS)[number]['key'];

const pillClass = (active: boolean) =>
  cn(
    'rounded-full border px-2.5 py-1 text-xs outline-none transition-colors',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    active
      ? 'border-accent bg-accent-soft text-on-accent-soft'
      : 'border-border text-foreground-muted hover:border-border-strong hover:text-foreground',
  );

/**
 * A "block" page: a complete example composed from @gerege/ui primitives.
 * It is not an importable component — the deliverable is the source below,
 * which you copy into your app and adapt. The preview is the real
 * `#preview/<slug>` route in an iframe, so the width toggle exercises the
 * template's actual breakpoints; the source text loads lazily.
 */
export function TemplateDocPage({ doc }: TemplateDocPageProps) {
  const [source, setSource] = useState<string | null>(null);
  const [screen, setScreen] = useState(doc.screens[0]?.key ?? 'home');
  const [width, setWidth] = useState<WidthKey>('desktop');
  const [variant, setVariant] = useState<string | undefined>(doc.variants?.[0]?.key);
  const [lang, setLang] = useState<'en' | 'mn'>('en');

  useEffect(() => {
    setScreen(doc.screens[0]?.key ?? 'home');
    setVariant(doc.variants?.[0]?.key);
    let alive = true;
    setSource(null);
    import('../blocks/sources').then((m) => {
      if (alive) setSource(m.blockSources[doc.slug] ?? '');
    });
    return () => {
      alive = false;
    };
  }, [doc.slug, doc.screens, doc.variants]);

  const frameWidth = WIDTHS.find((w) => w.key === width)?.width ?? 1280;
  const src = `${previewUrl(doc.slug, screen, variant)}${lang === 'mn' ? '?lang=mn' : ''}`;

  // The docs column is narrower than a real desktop viewport, so the frame
  // keeps its true CSS width (the template's breakpoints stay honest) and is
  // scaled down to fit. Mobile/tablet fit unscaled.
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBoxWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = boxWidth > 0 ? Math.min(1, boxWidth / frameWidth) : 1;
  const FRAME_HEIGHT = 720;

  return (
    <article className="max-w-4xl">
      <header className="border-border mb-8 border-b pb-6">
        <p className="text-accent text-xs font-medium tracking-wider uppercase">Block</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{doc.name}</h1>
        <p className="text-foreground-muted mt-3 text-base leading-relaxed">{doc.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <a
            href={previewUrl(doc.slug)}
            target="_blank"
            rel="noreferrer"
            className="bg-accent text-on-accent focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Open live preview <ExternalLink className="size-3" aria-hidden />
          </a>
          <a
            href={`${SRC_BLOCKS}/${doc.sourceFile}`}
            target="_blank"
            rel="noreferrer"
            className="text-foreground-muted hover:text-accent focus-visible:ring-ring focus-visible:ring-offset-background inline-flex items-center gap-1 rounded-sm text-xs outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            View on GitHub <ExternalLink className="size-3" aria-hidden />
          </a>
        </div>
      </header>

      {doc.useCases.length > 0 && (
        <>
          <SectionAnchor id="use-cases">Use cases</SectionAnchor>
          <ul className="text-foreground-muted space-y-1.5 text-sm">
            {doc.useCases.map((u, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="bg-accent mt-2 size-1 shrink-0 rounded-full" />
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {doc.patterns && doc.patterns.length > 0 && (
        <>
          <SectionAnchor id="patterns">Patterns demonstrated</SectionAnchor>
          <p className="text-foreground-muted mb-3 text-sm leading-relaxed">
            What to look for in the preview. Section names refer to the design-research guides.
          </p>
          <ul className="text-foreground-muted space-y-1.5 text-sm">
            {doc.patterns.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="bg-accent mt-2 size-1 shrink-0 rounded-full" />
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <SectionAnchor id="preview">Preview</SectionAnchor>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        {doc.screens.length > 1 ? (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Screen">
            {doc.screens.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setScreen(s.key)}
                aria-pressed={s.key === screen}
                className={pillClass(s.key === screen)}
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap items-center gap-3">
          {doc.variants && doc.variants.length > 1 && (
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Layout">
              {doc.variants.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setVariant(v.key)}
                  aria-pressed={v.key === variant}
                  className={pillClass(v.key === variant)}
                  title={v.description}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Preview language">
            {(['en', 'mn'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={l === lang}
                className={pillClass(l === lang)}
                title={l === 'en' ? 'English' : 'Монгол'}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Preview width">
            {WIDTHS.map((w) => (
              <button
                key={w.key}
                type="button"
                onClick={() => setWidth(w.key)}
                aria-pressed={w.key === width}
                className={pillClass(w.key === width)}
                title={w.hint}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={boxRef}
        className="border-border bg-background-subtle overflow-hidden rounded-lg border p-0"
        style={{ height: Math.round(FRAME_HEIGHT * scale) }}
      >
        <iframe
          // Remount on screen or width change so the template opens fresh at
          // that viewport (no stale drawer/menu state carried across sizes).
          key={`${doc.slug}/${screen}/${variant ?? ''}/${width}/${lang}`}
          src={src}
          title={`${doc.name} preview`}
          loading="lazy"
          style={{
            width: frameWidth,
            height: FRAME_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className={cn(
            'bg-background block',
            frameWidth < boxWidth && 'border-border mx-auto border-x',
          )}
        />
      </div>
      <p className="text-foreground-subtle mt-2 text-xs">
        Interactive. For the full-screen version,{' '}
        <a href={src} target="_blank" rel="noreferrer" className="prose-link">
          open it in a new tab ↗
        </a>
        .
      </p>

      <SectionAnchor id="source">Source</SectionAnchor>
      <p className="text-foreground-muted mb-4 text-sm leading-relaxed">
        The template's entry file (
        <code className="bg-background-muted rounded px-1 py-0.5 font-mono text-xs">
          {doc.sourceFile}
        </code>
        ), composed from{' '}
        <code className="bg-background-muted rounded px-1 py-0.5 font-mono text-xs">
          @gerege/ui
        </code>{' '}
        primitives. Copy it — plus the building blocks it imports — and wire your own data and
        handlers.
      </p>
      {source === null ? (
        <div className="border-border flex h-24 items-center justify-center rounded-md border">
          <Spinner />
        </div>
      ) : (
        <CodeBlock code={source} />
      )}
    </article>
  );
}
