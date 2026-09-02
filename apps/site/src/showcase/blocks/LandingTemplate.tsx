import { useState, type MouseEvent, type ReactNode } from 'react';
import { ArrowRight, BarChart3, Github, Lock, Menu, Plug, Sparkles, Star, Zap } from '@/icons';
import { Avatar } from '@gerege/ui';
import { Button } from '@gerege/ui';
import { Card, CardContent } from '@gerege/ui';
import {
  IconButton,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@gerege/ui';
import { AuthLayout, SignUpForm } from './Authentication';
import { Pricing } from './Pricing';
import type { TemplateProps } from './meta';
import { useT } from '../i18n/locale';
import { landingDict } from '../i18n/landing';

/**
 * Landing page template — a complete SaaS marketing site following the
 * landing anatomy: nav → hero → logo strip → features → how it works →
 * pricing → testimonial → FAQ → final CTA → footer. The matching sign-up
 * screen is reached from the preview dock.
 *
 * One primary CTA label (`t('cta')`) is repeated in the nav, hero, pricing
 * and final CTA — a different label reads as a different action. All copy
 * lives in `i18n/landing.ts` (EN / MN).
 */

type T = ReturnType<typeof useT<(typeof landingDict)['en']>>;

/** Section ids. Nav + footer links are real anchors to these. */
const SECTIONS = {
  product: 'product',
  features: 'features',
  how: 'how-it-works',
  pricing: 'pricing',
  customers: 'customers',
  faq: 'faq',
} as const;

const navItems = (t: T) => [
  { label: t('navProduct'), id: SECTIONS.product },
  { label: t('navFeatures'), id: SECTIONS.features },
  { label: t('navPricing'), id: SECTIONS.pricing },
  { label: t('navCustomers'), id: SECTIONS.customers },
  { label: t('navFaq'), id: SECTIONS.faq },
];

const features = (t: T) => [
  { icon: Zap, title: t('featFastTitle'), body: t('featFastBody') },
  { icon: Lock, title: t('featSecureTitle'), body: t('featSecureBody') },
  { icon: BarChart3, title: t('featInsightTitle'), body: t('featInsightBody') },
  { icon: Plug, title: t('featIntegrateTitle'), body: t('featIntegrateBody') },
  { icon: Sparkles, title: t('featDelightTitle'), body: t('featDelightBody') },
  { icon: Github, title: t('featOpenTitle'), body: t('featOpenBody') },
];

const steps = (t: T) => [
  { title: t('step1Title'), body: t('step1Body') },
  { title: t('step2Title'), body: t('step2Body') },
  { title: t('step3Title'), body: t('step3Body') },
];

const faq = (t: T) => [
  { q: t('faq1Q'), a: t('faq1A') },
  { q: t('faq2Q'), a: t('faq2A') },
  { q: t('faq3Q'), a: t('faq3A') },
  { q: t('faq4Q'), a: t('faq4A') },
  { q: t('faq5Q'), a: t('faq5A') },
];

const LOGOS = ['Northwind', 'Acme', 'Globex', 'Initech', 'Umbrella'];

/**
 * Smooth-scroll to a section. The hrefs are real (`#features`), this handler
 * only swaps the browser's jump for a smooth scroll and keeps the hash out of
 * a hash-routed host like the showcase. Drop it in an app with path routing.
 */
function scrollTo(e: MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function SectionLink({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={`#${id}`} onClick={(e) => scrollTo(e, id)} className={className}>
      {children}
    </a>
  );
}

function Nav({ brand, onSignUp }: { brand: ReactNode; onSignUp: () => void }) {
  const t = useT(landingDict);
  const nav = navItems(t);
  return (
    <header className="border-border bg-background sticky top-0 z-[var(--z-sticky)] border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
        <div className="text-sm">{brand}</div>
        <nav
          aria-label={t('navPrimary')}
          className="text-foreground-muted hidden items-center gap-6 text-sm md:flex"
        >
          {nav.map((n) => (
            <SectionLink
              key={n.id}
              id={n.id}
              className="hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {n.label}
            </SectionLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onSignUp} className="hidden sm:inline-flex">
            {t('signIn')}
          </Button>
          <Button size="sm" variant="secondary" onClick={onSignUp}>
            {t('cta')}
          </Button>
          {/* Section links (and Sign in) move into a drawer below md. */}
          <Sheet>
            <SheetTrigger asChild>
              <IconButton
                aria-label={t('openMenu')}
                icon={<Menu />}
                variant="ghost"
                size="sm"
                className="md:hidden"
              />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle>{t('menu')}</SheetTitle>
              <nav aria-label={t('navPrimary')} className="mt-6 flex flex-col gap-1">
                {nav.map((n) => (
                  <SheetClose asChild key={n.id}>
                    <a
                      href={`#${n.id}`}
                      onClick={(e) => scrollTo(e, n.id)}
                      className="text-foreground hover:bg-background-muted flex h-11 items-center rounded-md px-3 text-base"
                    >
                      {n.label}
                    </a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="mt-2 justify-start sm:hidden"
                    onClick={onSignUp}
                  >
                    {t('signIn')}
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

type LegalTopic = 'privacy' | 'terms' | 'security';
const legalPages = (t: T): { key: LegalTopic; title: string; body: string }[] => [
  { key: 'privacy', title: t('privacyTitle'), body: t('privacyBody') },
  { key: 'terms', title: t('termsTitle'), body: t('termsBody') },
  { key: 'security', title: t('securityTitle'), body: t('securityBody') },
];

/** Legal pages — in-template destinations for the footer links. */
function LegalPage({
  brand,
  topic,
  onBack,
  onLegal,
}: {
  brand: ReactNode;
  topic: LegalTopic;
  onBack: () => void;
  onLegal: (t: LegalTopic) => void;
}) {
  const t = useT(landingDict);
  const legal = legalPages(t);
  const active = legal.find((l) => l.key === topic) ?? legal[0];
  return (
    <div className="bg-background min-h-dvh">
      <header className="border-border border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="min-w-0 truncate">{brand}</div>
          <Button variant="ghost" size="sm" onClick={onBack}>
            {t('backToSite')}
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl px-6 py-12">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">{active.title}</h1>
        <p className="text-foreground-muted mt-4 max-w-[65ch] text-base leading-relaxed">
          {active.body}
        </p>
        <nav aria-label={t('legalNav')} className="border-border mt-10 border-t pt-6">
          <ul className="text-foreground-muted flex flex-wrap gap-4 text-sm">
            {legal
              .filter((l) => l.key !== active.key)
              .map((l) => (
                <li key={l.key}>
                  <button
                    type="button"
                    onClick={() => onLegal(l.key)}
                    className="text-accent font-medium hover:underline"
                  >
                    {l.title}
                  </button>
                </li>
              ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}

function Landing({
  brand,
  onSignUp,
  onLegal,
}: {
  brand: ReactNode;
  onSignUp: () => void;
  onLegal: (topic: LegalTopic) => void;
}) {
  const t = useT(landingDict);
  const year = new Date().getFullYear();
  return (
    <div className="bg-background">
      <Nav brand={brand} onSignUp={onSignUp} />

      <main>
        {/* Hero */}
        <section
          id={SECTIONS.product}
          className="mx-auto max-w-4xl scroll-mt-16 px-6 py-24 text-center"
        >
          <div className="border-border bg-card text-foreground-muted mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <Sparkles className="text-accent size-3" aria-hidden />
            {t('heroBadge')}
          </div>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            {t('heroTitleBefore')}
            <span className="text-accent">{t('heroTitleAccent')}</span>
            {t('heroTitleAfter')}
          </h1>
          <p className="text-foreground-muted mx-auto mt-5 max-w-[65ch] text-lg leading-relaxed">
            {t('heroBody')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="xl" onClick={onSignUp}>
              {t('cta')} <ArrowRight className="ml-1 size-4" aria-hidden />
            </Button>
            <Button size="xl" variant="outline">
              {t('bookDemo')}
            </Button>
          </div>
          <p className="text-foreground-subtle mt-4 text-sm">{t('heroRisk')}</p>
        </section>

        {/* Logo strip — uniform 32px row height, greyscale */}
        <section aria-label={t('customersLabel')} className="bg-background-subtle py-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6">
            <span className="text-foreground-subtle text-xs font-medium tracking-wider uppercase">
              {t('trustedBy')}
            </span>
            {LOGOS.map((c) => (
              <span
                key={c}
                className="text-foreground-muted hover:text-foreground inline-flex h-8 items-center text-lg font-semibold tracking-tight grayscale transition-colors"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id={SECTIONS.features} className="mx-auto max-w-6xl scroll-mt-16 px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">{t('featuresTitle')}</h2>
            <p className="text-foreground-muted mt-3">{t('featuresBody')}</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features(t).map((f) => (
              <Card key={f.title}>
                <CardContent className="pt-6">
                  <div className="bg-accent-soft text-on-accent-soft mb-3 inline-flex size-9 items-center justify-center rounded-md">
                    <f.icon className="size-5" aria-hidden />
                  </div>
                  <h3 className="text-foreground text-sm font-semibold">{f.title}</h3>
                  <p className="text-foreground-muted mt-1.5 text-sm leading-relaxed">{f.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works — 3 numbered steps */}
        <section id={SECTIONS.how} className="bg-background-subtle scroll-mt-16 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight">{t('howTitle')}</h2>
              <p className="text-foreground-muted mt-3">{t('howBody')}</p>
            </div>
            <ol className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps(t).map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span
                    aria-hidden
                    className="tabular border-border bg-card text-foreground inline-flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-foreground text-base font-semibold">
                      <span className="sr-only">{t('stepLabel', { n: i + 1 })}</span>
                      {s.title}
                    </h3>
                    <p className="text-foreground-muted mt-1.5 text-sm leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Pricing */}
        <section id={SECTIONS.pricing} className="scroll-mt-16 py-24">
          <Pricing onTierSelect={onSignUp} className="py-0" />
        </section>

        {/* Testimonial */}
        <section id={SECTIONS.customers} className="bg-background-subtle scroll-mt-16 py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <div
              className="text-warning-text mb-4 flex items-center justify-center gap-1"
              role="img"
              aria-label={t('ratingLabel')}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" aria-hidden />
              ))}
            </div>
            <blockquote className="text-foreground text-2xl leading-relaxed font-medium tracking-tight">
              {t('quote')}
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Avatar size="lg" fallback="JM" />
              <div className="text-left text-sm">
                <div className="text-foreground font-medium">{t('quoteName')}</div>
                <div className="text-foreground-subtle">{t('quoteRole')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ — native <details>: keyboard-ready, indexable, no JS */}
        <section id={SECTIONS.faq} className="mx-auto max-w-3xl scroll-mt-16 px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight">{t('faqTitle')}</h2>
            <p className="text-foreground-muted mt-3">{t('faqBody')}</p>
          </div>
          <div className="divide-border border-border mt-10 divide-y border-y">
            {faq(t).map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="text-foreground focus-visible:ring-ring focus-visible:ring-offset-background flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm text-base font-medium outline-none marker:content-none focus-visible:ring-2 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden
                    className="text-foreground-subtle transition-transform duration-[var(--duration-fast)] group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="text-foreground-muted mt-3 max-w-[65ch] text-sm leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA — h2 + one line + the same primary button */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="border-border bg-accent text-on-accent rounded-lg border px-8 py-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">{t('finalTitle')}</h2>
            <p className="mx-auto mt-3 max-w-[65ch] opacity-90">{t('finalBody')}</p>
            <div className="mt-7 flex justify-center">
              <Button size="lg" variant="secondary" onClick={onSignUp}>
                {t('cta')} <ArrowRight className="ml-1 size-4" aria-hidden />
              </Button>
            </div>
            <p className="mt-4 text-sm">{t('finalRisk')}</p>
          </div>
        </section>
      </main>

      {/* Footer — real anchors to the sections above; legal links open the
          in-template legal page. Resources are paths for the host app. */}
      <footer className="border-border border-t">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
          <FooterColumn
            heading={t('footProduct')}
            links={[
              { label: t('navFeatures'), id: SECTIONS.features },
              { label: t('footHow'), id: SECTIONS.how },
              { label: t('navPricing'), id: SECTIONS.pricing },
              { label: t('navFaq'), id: SECTIONS.faq },
            ]}
          />
          <FooterColumn
            heading={t('footCompany')}
            links={[
              { label: t('navProduct'), id: SECTIONS.product },
              { label: t('navCustomers'), id: SECTIONS.customers },
              { label: t('footContact'), id: SECTIONS.faq },
            ]}
          />
          <FooterColumn
            heading={t('footResources')}
            links={[
              { label: t('footDocs'), href: '/docs' },
              { label: t('footApi'), href: '/docs/api' },
              { label: t('footStatus'), href: '/status' },
            ]}
          />
          <FooterColumn
            heading={t('footLegal')}
            links={[
              { label: t('footPrivacy'), onClick: () => onLegal('privacy') },
              { label: t('footTerms'), onClick: () => onLegal('terms') },
              { label: t('footSecurity'), onClick: () => onLegal('security') },
            ]}
          />
        </div>
        <div className="border-border text-foreground-subtle border-t py-6 text-center text-xs">
          {t('copyright', { year })}
        </div>
      </footer>
    </div>
  );
}

type FooterLink = { label: string; id?: string; href?: string; onClick?: () => void };

function FooterColumn({ heading, links }: { heading: string; links: FooterLink[] }) {
  const linkClass =
    'rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
  return (
    <div>
      <div className="text-foreground-subtle mb-3 text-xs font-semibold tracking-wider uppercase">
        {heading}
      </div>
      <ul className="text-foreground-muted space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            {l.id ? (
              <SectionLink id={l.id} className={linkClass}>
                {l.label}
              </SectionLink>
            ) : l.onClick ? (
              <button type="button" onClick={l.onClick} className={linkClass}>
                {l.label}
              </button>
            ) : (
              <a href={l.href} className={linkClass}>
                {l.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LandingTemplate({ screen, setScreen, brand }: TemplateProps) {
  const t = useT(landingDict);
  const [legalTopic, setLegalTopic] = useState<LegalTopic>('privacy');
  const openLegal = (topic: LegalTopic) => {
    setLegalTopic(topic);
    setScreen('legal');
  };
  if (screen === 'legal') {
    return (
      <LegalPage
        brand={brand}
        topic={legalTopic}
        onBack={() => setScreen('home')}
        onLegal={openLegal}
      />
    );
  }
  if (screen === 'signup') {
    return (
      <AuthLayout
        brand={brand}
        title={t('signupTitle')}
        subtitle={t('signupSubtitle')}
        footer={
          <>
            {t('justLooking')}{' '}
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="text-accent focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {t('backToSite')}
            </button>
          </>
        }
      >
        <SignUpForm onSubmit={async () => {}} />
      </AuthLayout>
    );
  }
  return <Landing brand={brand} onSignUp={() => setScreen('signup')} onLegal={openLegal} />;
}
