import { useMemo, useState } from 'react';
import { ArrowLeft, FileText, Menu, Search, X, ImageIcon } from '@/icons';
import { Avatar } from '@gerege-systems/ui';
import { Badge } from '@gerege-systems/ui';
import { Button } from '@gerege-systems/ui';
import { EmptyState } from '@gerege-systems/ui';
import { IconButton } from '@gerege-systems/ui';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@gerege-systems/ui';
import { Input } from '@gerege-systems/ui';
import { Separator } from '@gerege-systems/ui';
import { cn, formatDate } from '@gerege-systems/ui';
import type { TemplateProps } from './meta';
import { readHashParams, writeHash } from './admin/use-hash-params';
import { useT } from '../i18n/locale';
import { newsDict } from '../i18n/news';

/**
 * News / magazine template — a publication front page (masthead + category
 * nav, lead story, latest grid, trending sidebar) and a full article reader.
 * Fully interactive without a backend: category nav and search filter the
 * mock article list client-side. All copy (chrome + demo stories) comes from
 * `i18n/news.ts`, so `?lang=mn` renders the whole publication in Mongolian.
 */
const CATEGORIES = [
  'all',
  'world',
  'business',
  'technology',
  'science',
  'culture',
  'sport',
] as const;
type Category = (typeof CATEGORIES)[number];

const ARTICLES = [
  {
    id: 'design-systems',
    cat: 'technology',
    author: 'A. Bold',
    initials: 'AB',
    date: '2026-08-21',
    readMinutes: 6,
    hue: 250,
  },
  {
    id: 'markets-pause',
    cat: 'business',
    author: 'B. Erdene',
    initials: 'BE',
    date: '2026-08-21',
    readMinutes: 4,
    hue: 150,
  },
  {
    id: 'deep-sea-survey',
    cat: 'science',
    author: 'T. Ganbat',
    initials: 'TG',
    date: '2026-08-20',
    readMinutes: 5,
    hue: 200,
  },
  {
    id: 'long-form-essay',
    cat: 'culture',
    author: 'S. Khan',
    initials: 'SK',
    date: '2026-08-20',
    readMinutes: 7,
    hue: 320,
  },
] as const satisfies readonly { cat: Category; [k: string]: unknown }[];

type Article = (typeof ARTICLES)[number];
type ArticleId = Article['id'];

type LegalTopic = 'privacy' | 'terms' | 'contact';
const LEGAL: readonly LegalTopic[] = ['privacy', 'terms', 'contact'];

type T = ReturnType<typeof useT<typeof newsDict.en>>;
const catLabel = (t: T, c: Category) => t(`cat.${c}`);
const storyTitle = (t: T, id: ArticleId) => t(`story.${id}.title`);
const storyExcerpt = (t: T, id: ArticleId) => t(`story.${id}.excerpt`);
const legalTitle = (t: T, l: LegalTopic) => t(`legal.${l}.title`);

/** Image placeholder — a flat, per-category tinted surface (solid colour mixed
 *  into the muted background, so it follows light/dark) with a faint image
 *  glyph. No gradient (PHILOSOPHY). Swap for `<img>` with width/height in a
 *  real feed. */
function Cover({ hue = 250, className }: { hue?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('text-foreground/15 flex items-center justify-center', className)}
      style={{
        background: `color-mix(in oklch, var(--background-muted) 78%, oklch(0.62 0.14 ${hue}))`,
      }}
    >
      <ImageIcon className="size-8" strokeWidth={1.25} />
    </div>
  );
}

function Masthead({
  brand,
  active,
  onCategory,
  query,
  onQuery,
}: {
  brand: React.ReactNode;
  active?: Category;
  onCategory?: (c: Category) => void;
  query?: string;
  onQuery?: (q: string) => void;
}) {
  const t = useT(newsDict);
  const [searchOpen, setSearchOpen] = useState(false);
  const interactive = Boolean(onCategory);

  return (
    <header className="border-border bg-background border-b">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:gap-4 sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <IconButton
              aria-label={t('nav.menu')}
              icon={<Menu />}
              variant="ghost"
              size="sm"
              className="md:hidden"
            />
          </SheetTrigger>
          <SheetContent aria-describedby={undefined} side="left" className="w-72">
            <SheetTitle>{t('nav.sections')}</SheetTitle>
            <nav className="mt-6 flex flex-col gap-1" aria-label={t('nav.sections')}>
              {CATEGORIES.map((c) => (
                <SheetClose asChild key={c}>
                  <button
                    type="button"
                    onClick={() => onCategory?.(c)}
                    aria-current={active === c ? 'page' : undefined}
                    className={cn(
                      'flex h-11 items-center rounded-md px-3 text-left text-base',
                      active === c
                        ? 'bg-accent-soft text-accent font-medium'
                        : 'text-foreground hover:bg-background-muted',
                    )}
                  >
                    {catLabel(t, c)}
                  </button>
                </SheetClose>
              ))}
              <Button className="mt-4 w-full sm:hidden">{t('nav.subscribe')}</Button>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="min-w-0 truncate text-lg font-semibold tracking-tight">{brand}</div>
        <div className="ml-auto flex items-center gap-2">
          {interactive && searchOpen ? (
            <div className="flex items-center gap-1">
              <Input
                // eslint-disable-next-line jsx-a11y/no-autofocus -- field is revealed by the user's own "search" click; focusing it is the expected result
                autoFocus
                size="sm"
                label={t('nav.searchStories')}
                hideLabel
                placeholder={t('nav.searchPlaceholder')}
                value={query}
                onChange={(e) => onQuery?.(e.target.value)}
                className="w-full max-w-56"
              />
              <IconButton
                aria-label={t('nav.closeSearch')}
                icon={<X />}
                variant="ghost"
                size="sm"
                onClick={() => {
                  onQuery?.('');
                  setSearchOpen(false);
                }}
              />
            </div>
          ) : (
            <IconButton
              aria-label={t('nav.search')}
              icon={<Search />}
              variant="ghost"
              size="sm"
              onClick={interactive ? () => setSearchOpen(true) : undefined}
            />
          )}
          <Button size="sm" className="hidden sm:inline-flex">
            {t('nav.subscribe')}
          </Button>
        </div>
      </div>
      <nav aria-label={t('nav.sections')} className="border-border border-t">
        <div className="mx-auto flex max-w-5xl snap-x [scrollbar-width:none] items-center gap-5 overflow-x-auto px-6 py-2.5 text-sm [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCategory?.(c)}
              aria-current={active === c ? 'page' : undefined}
              className={cn(
                'shrink-0 snap-start py-1 whitespace-nowrap',
                active === c
                  ? 'text-accent font-medium'
                  : 'text-foreground-muted hover:text-foreground',
              )}
            >
              {catLabel(t, c)}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

function Footer({
  brand,
  onSection,
  onLegal,
}: {
  brand: React.ReactNode;
  onSection: (c: Category) => void;
  onLegal: (t: LegalTopic) => void;
}) {
  const t = useT(newsDict);
  const linkClass =
    'text-foreground-muted hover:text-foreground rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
  return (
    <footer className="border-border bg-background-subtle border-t">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-10 sm:grid-cols-3">
        <div>
          <div className="text-base font-semibold tracking-tight">{brand}</div>
          <p className="text-foreground-muted mt-2 max-w-xs text-sm leading-relaxed">
            {t('footer.tagline')}
          </p>
        </div>
        <nav aria-label={t('footer.sections')}>
          <h2 className="text-foreground-subtle text-xs font-semibold tracking-wider uppercase">
            {t('nav.sections')}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {CATEGORIES.filter((c) => c !== 'all').map((c) => (
              <li key={c}>
                <button type="button" onClick={() => onSection(c)} className={linkClass}>
                  {catLabel(t, c)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-foreground-subtle text-xs font-semibold tracking-wider uppercase">
            {t('newsletter.title')}
          </h2>
          <p className="text-foreground-muted mt-3 text-sm">{t('newsletter.body')}</p>
          <form className="mt-3 flex flex-wrap gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input
              size="sm"
              type="email"
              label={t('newsletter.email')}
              hideLabel
              autoComplete="email"
              placeholder={t('newsletter.placeholder')}
              className="min-w-0 flex-1 basis-40"
            />
            <Button size="sm" variant="secondary" type="submit">
              {t('newsletter.signUp')}
            </Button>
          </form>
        </div>
      </div>
      <div className="border-border border-t">
        <div className="text-foreground-subtle mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-4 text-xs">
          <span>
            © {new Date().getFullYear()} {brand}
            {t('footer.rights')}
          </span>
          <nav aria-label={t('footer.legal')} className="flex gap-4">
            {LEGAL.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onLegal(l)}
                className="hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                {legalTitle(t, l)}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

/** Legal / contact — in-template destination for the footer links. */
function LegalPage({
  brand,
  topic,
  onBack,
  onSection,
  onLegal,
}: {
  brand: React.ReactNode;
  topic: LegalTopic;
  onBack: () => void;
  onSection: (c: Category) => void;
  onLegal: (t: LegalTopic) => void;
}) {
  const t = useT(newsDict);
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <Masthead brand={brand} onCategory={onSection} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <button
          onClick={onBack}
          className="text-foreground-muted hover:text-foreground mb-6 flex w-fit items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden /> {t('article.back')}
        </button>
        <h1 className="text-3xl leading-tight font-semibold tracking-tight">
          {legalTitle(t, topic)}
        </h1>
        <p className="text-foreground-muted mt-4 max-w-[65ch] text-base leading-relaxed">
          {t(`legal.${topic}.body`)}
        </p>
      </main>
      <Footer brand={brand} onSection={onSection} onLegal={onLegal} />
    </div>
  );
}

function Byline({ initials, author, date }: { initials: string; author: string; date: string }) {
  return (
    <div className="text-foreground-subtle flex items-center gap-2 text-xs">
      <Avatar size="xs" fallback={initials} />
      <span className="text-foreground-muted">{author}</span>
      <span aria-hidden>·</span>
      <time dateTime={date}>{formatDate(date, { pattern: 'yyyy-MM-dd', tz: 'UTC' })}</time>
    </div>
  );
}

function FrontPage({
  brand,
  category,
  setCategory,
  onOpen,
  onLegal,
}: {
  brand: React.ReactNode;
  category: Category;
  setCategory: (c: Category) => void;
  onOpen: (a: Article) => void;
  onLegal: (t: LegalTopic) => void;
}) {
  const t = useT(newsDict);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter(
      (a) =>
        (category === 'all' || a.cat === category) &&
        (!q ||
          storyTitle(t, a.id).toLowerCase().includes(q) ||
          storyExcerpt(t, a.id).toLowerCase().includes(q)),
    );
  }, [category, query, t]);

  const [lead, ...rest] = filtered;

  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <Masthead
        brand={brand}
        active={category}
        onCategory={setCategory}
        query={query}
        onQuery={setQuery}
      />
      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-10 px-6 py-10 lg:grid-cols-[1fr_18rem]">
        <div>
          {!lead ? (
            <div className="border-border bg-card rounded-lg border p-10 text-center">
              <h1 className="text-sm font-medium">{t('front.empty.title')}</h1>
              <p className="text-foreground-muted mt-1 text-sm">
                {query.trim()
                  ? t('front.empty.query', {
                      query: query.trim(),
                      section:
                        category === 'all' ? t('front.empty.anySection') : catLabel(t, category),
                    })
                  : t('front.empty.section', { section: catLabel(t, category) })}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setQuery('');
                  setCategory('all');
                }}
              >
                {t('front.clearFilters')}
              </Button>
            </div>
          ) : (
            <>
              {/* Lead story */}
              <button onClick={() => onOpen(lead)} className="group block w-full text-left">
                <Cover hue={lead.hue} className="aspect-[16/8] w-full rounded-lg" />
                <div className="mt-4">
                  <Badge tone="accent" variant="outline">
                    {catLabel(t, lead.cat)}
                  </Badge>
                  <h1 className="group-hover:text-accent mt-3 text-3xl leading-tight font-semibold tracking-tight">
                    {storyTitle(t, lead.id)}
                  </h1>
                  <p className="text-foreground-muted mt-2 text-base leading-relaxed">
                    {storyExcerpt(t, lead.id)}
                  </p>
                  <div className="mt-3">
                    <Byline {...lead} />
                  </div>
                </div>
              </button>

              {rest.length > 0 && (
                <>
                  <Separator className="my-8" />
                  <h2 className="text-foreground-subtle mb-4 text-xs font-semibold tracking-wider uppercase">
                    {t('front.latest')}
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {rest.map((a) => (
                      <button key={a.id} onClick={() => onOpen(a)} className="group text-left">
                        <Cover hue={a.hue} className="aspect-[16/9] w-full rounded-md" />
                        <Badge tone="neutral" variant="outline" className="mt-3">
                          {catLabel(t, a.cat)}
                        </Badge>
                        <h3 className="text-foreground group-hover:text-accent mt-2 leading-snug font-semibold">
                          {storyTitle(t, a.id)}
                        </h3>
                        <p className="text-foreground-muted mt-1 text-sm leading-relaxed">
                          {storyExcerpt(t, a.id)}
                        </p>
                        <div className="mt-2">
                          <Byline {...a} />
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Trending sidebar */}
        <aside className="lg:border-border lg:border-l lg:pl-8">
          <h2 className="text-foreground-subtle mb-4 text-xs font-semibold tracking-wider uppercase">
            {t('front.trending')}
          </h2>
          <ol className="space-y-5">
            {ARTICLES.map((a, i) => (
              <li key={a.id}>
                <button onClick={() => onOpen(a)} className="group flex gap-3 text-left">
                  <span className="tabular text-border-strong text-xl font-semibold">{i + 1}</span>
                  <span className="text-foreground group-hover:text-accent text-sm leading-snug font-medium">
                    {storyTitle(t, a.id)}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="border-border bg-card mt-8 rounded-lg border p-4 md:p-6">
            <h3 className="text-sm font-semibold">{t('newsletter.title')}</h3>
            <p className="text-foreground-muted mt-1 text-sm">{t('newsletter.body')}</p>
            <Button size="sm" variant="secondary" className="mt-3 w-full">
              {t('newsletter.signUpFree')}
            </Button>
          </div>
        </aside>
      </main>
      <Footer brand={brand} onSection={setCategory} onLegal={onLegal} />
    </div>
  );
}

function ArticlePage({
  brand,
  id,
  onBack,
  onSection,
  onLegal,
}: {
  brand: React.ReactNode;
  id: string;
  onBack: () => void;
  onSection: (c: Category) => void;
  onLegal: (t: LegalTopic) => void;
}) {
  const t = useT(newsDict);
  const a = ARTICLES.find((x) => x.id === id);
  if (!a)
    return (
      <div className="bg-background flex min-h-dvh flex-col">
        <Masthead brand={brand} onCategory={onSection} />
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
          <EmptyState
            icon={<FileText />}
            title={t('article.notFound.title')}
            description={t('article.notFound.body')}
            action={
              <Button variant="secondary" leadingIcon={<ArrowLeft />} onClick={onBack}>
                {t('article.back')}
              </Button>
            }
            headingLevel={1}
            className="min-h-[320px]"
          />
        </main>
        <Footer brand={brand} onSection={onSection} onLegal={onLegal} />
      </div>
    );
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <Masthead brand={brand} onCategory={onSection} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <article>
          {/* `flex w-fit` (not inline-flex): an inline-level button shares the
            line with the inline Badge below, gluing "Back to front page" to
            the category chip. */}
          <button
            onClick={onBack}
            className="text-foreground-muted hover:text-foreground mb-6 flex w-fit items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="size-4" aria-hidden /> {t('article.back')}
          </button>
          <Badge tone="accent" variant="outline">
            {catLabel(t, a.cat)}
          </Badge>
          <h1 className="mt-3 text-4xl leading-tight font-semibold tracking-tight">
            {storyTitle(t, a.id)}
          </h1>
          <p className="text-foreground-muted mt-4 text-lg leading-relaxed">
            {storyExcerpt(t, a.id)}
          </p>
          <div className="mt-5 flex items-center justify-between">
            <Byline {...a} />
            <span className="text-foreground-subtle text-xs">
              {t('article.readTime', { n: a.readMinutes })}
            </span>
          </div>
          <Cover hue={a.hue} className="mt-6 aspect-[16/9] w-full rounded-lg" />
          <div className="text-foreground mt-8 max-w-[65ch] space-y-4 text-base leading-relaxed">
            <p>{t('article.body.1')}</p>
            <p>{t('article.body.2')}</p>
            <p>{t('article.body.3')}</p>
          </div>
        </article>
      </main>
      <Footer brand={brand} onSection={onSection} onLegal={onLegal} />
    </div>
  );
}

export function NewsTemplate({ screen, setScreen, brand }: TemplateProps) {
  const [category, setCategory] = useState<Category>('all');
  // Article id lives in the hash tail (`…?id=markets-pause`) so a story can be
  // reloaded or shared; an unknown id renders the in-template not-found.
  // `writeHash` carries `?lang=` over, so the locale survives navigation.
  const [articleId, setArticleId] = useState(() => readHashParams().get('id') ?? ARTICLES[0].id);
  const [legalTopic, setLegalTopic] = useState<LegalTopic>('privacy');
  const go = (next: string) => {
    writeHash({});
    setScreen(next);
  };
  const openArticle = (a: Article) => {
    setArticleId(a.id);
    writeHash({ id: a.id });
    setScreen('article');
  };
  const openSection = (c: Category) => {
    setCategory(c);
    go('home');
  };
  const openLegal = (t: LegalTopic) => {
    setLegalTopic(t);
    go('legal');
  };
  if (screen === 'article')
    return (
      <ArticlePage
        brand={brand}
        id={articleId}
        onBack={() => go('home')}
        onSection={openSection}
        onLegal={openLegal}
      />
    );
  if (screen === 'legal')
    return (
      <LegalPage
        brand={brand}
        topic={legalTopic}
        onBack={() => go('home')}
        onSection={openSection}
        onLegal={openLegal}
      />
    );
  return (
    <FrontPage
      brand={brand}
      category={category}
      setCategory={setCategory}
      onOpen={openArticle}
      onLegal={openLegal}
    />
  );
}
