/**
 * Showcase routing — hash-based, two-segment.
 *
 *   #                       → home
 *   #components             → components index
 *   #components/button      → individual component doc
 *   #templates              → templates index
 *   #templates/auth-signin  → individual template page
 *   #guides                 → guides index
 *   #guides/theming         → individual guide
 *   #catalog                → legacy: full mini-demo wall
 *   #preview/auth-signin    → full-bleed live preview of a template
 *   #preview/auth/signup    → …opened at a specific screen
 *   #preview/admin/app/topnav → …at a specific screen + layout variant
 *   #preview/admin/app/sidebar/projects → …at an in-app page (app shells)
 *   #preview/admin/app/sidebar/projects?status=blocked&p=2 → …page state tail (ignored here)
 *   anything else           → 404
 */

export type Route =
  | { kind: 'home' }
  | { kind: 'catalog' }
  | { kind: 'components-index' }
  | { kind: 'component'; slug: string }
  | { kind: 'templates-index' }
  | { kind: 'template'; slug: string }
  | { kind: 'guides-index' }
  | { kind: 'theme' }
  | { kind: 'guide'; slug: string }
  | { kind: 'preview'; slug: string; screen?: string; variant?: string; page?: string }
  | { kind: 'not-found' };

/**
 * Legacy single-segment hashes → template preview targets. Every entry must
 * resolve to an existing block slug / screen / variant / page (asserted by
 * registry-completeness.test.ts).
 */
export const LEGACY_REDIRECTS: Record<
  string,
  { slug: string; screen?: string; variant?: string; page?: string }
> = {
  'auth-signin': { slug: 'auth', screen: 'signin' },
  'auth-signup': { slug: 'auth', screen: 'signup' },
  'auth-forgot': { slug: 'auth', screen: 'forgot' },
  'auth-magic': { slug: 'auth', screen: 'magic' },
  dashboard: { slug: 'admin', screen: 'app', variant: 'sidebar' },
  'first-run': { slug: 'admin', screen: 'app', variant: 'sidebar' },
  settings: { slug: 'admin', screen: 'app', variant: 'sidebar', page: 'settings' },
  'data-table': { slug: 'admin', screen: 'app', variant: 'sidebar', page: 'projects' },
  record: { slug: 'admin', screen: 'app', variant: 'sidebar', page: 'projects' },
  onboarding: { slug: 'landing', screen: 'signup' },
  // The landing template has no standalone pricing screen — pricing is a
  // section of its home page.
  pricing: { slug: 'landing', screen: 'home' },
};

export function parseHash(hash: string): Route {
  // Strip a query-style tail (`#preview/admin/app/sidebar/projects?status=…`) —
  // list state the admin template keeps in the URL; the router ignores it.
  const raw = hash.replace(/^#/, '').split('?')[0];
  if (!raw) return { kind: 'home' };

  if (raw === 'catalog') return { kind: 'catalog' };
  if (raw === 'components') return { kind: 'components-index' };
  if (raw === 'templates') return { kind: 'templates-index' };
  if (raw === 'guides' || raw === 'docs') return { kind: 'guides-index' };
  if (raw === 'theme') return { kind: 'theme' };

  const [section, slug, screen, variant, page] = raw.split('/');
  if (section === 'components' && slug) return { kind: 'component', slug };
  if (section === 'templates' && slug) return { kind: 'template', slug };
  if ((section === 'guides' || section === 'docs') && slug) return { kind: 'guide', slug };
  if (section === 'preview' && slug) {
    const route: Route = { kind: 'preview', slug };
    if (screen) route.screen = screen;
    if (variant) route.variant = variant;
    if (variant && page) route.page = page;
    return route;
  }

  // Back-compat: legacy single-segment hashes like #dashboard, #auth-signin,
  // #settings used to be top-level pattern keys. Redirect them to the
  // matching screen of a live template preview.
  const legacy = LEGACY_REDIRECTS[raw];
  if (legacy) return { kind: 'preview', ...legacy };

  return { kind: 'not-found' };
}

export function routeToHash(route: Route): string {
  switch (route.kind) {
    case 'home':
      return '';
    case 'catalog':
      return 'catalog';
    case 'components-index':
      return 'components';
    case 'component':
      return `components/${route.slug}`;
    case 'templates-index':
      return 'templates';
    case 'template':
      return `templates/${route.slug}`;
    case 'guides-index':
      return 'guides';
    case 'theme':
      return 'theme';
    case 'guide':
      return `guides/${route.slug}`;
    case 'preview':
      return (
        `preview/${route.slug}` +
        (route.screen ? `/${route.screen}` : '') +
        (route.screen && route.variant ? `/${route.variant}` : '') +
        (route.screen && route.variant && route.page ? `/${route.page}` : '')
      );
    case 'not-found':
      return '404';
  }
}

/** True for routes that render standalone — no showcase TopBar/Footer chrome. */
export function isFullBleedRoute(route: Route): boolean {
  return route.kind === 'preview';
}

/**
 * Absolute URL to a template's full-bleed live preview. Used with
 * `target="_blank"` so a template opens in its own browser tab, isolated from
 * the showcase chrome — the headline behaviour of the Templates section.
 */
export function previewUrl(slug: string, screen?: string, variant?: string): string {
  const base =
    typeof window === 'undefined'
      ? ''
      : `${window.location.origin}${window.location.pathname}${window.location.search}`;
  const route: Route = { kind: 'preview', slug };
  if (screen) route.screen = screen;
  if (screen && variant) route.variant = variant;
  return `${base}#${routeToHash(route)}`;
}
