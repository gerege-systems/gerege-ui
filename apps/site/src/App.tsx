import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Toaster } from '@/components/ui/Toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { useCommandPaletteShortcut } from '@/components/ui/CommandPalette';

import { isFullBleedRoute, parseHash, routeToHash, type Route } from './showcase/routing';
import { ThemeProvider } from './showcase/theme/theme-context';
import { ShowcaseTopBar } from './showcase/layout/ShowcaseTopBar';
import { ShowcaseFooter } from './showcase/layout/ShowcaseFooter';
import { DocLayout } from './showcase/layout/DocLayout';
import {
  buildComponentSidebar,
  buildCrossKindSections,
  buildGuideSidebar,
  buildTemplateSidebar,
  docTopLinks,
} from './showcase/layout/sidebars';
import { ShowcasePalette } from './showcase/widgets/ShowcasePalette';
import { HomePage } from './showcase/pages/HomePage';
import { ComponentsIndexPage } from './showcase/pages/ComponentsIndexPage';
import { ComponentDocPage } from './showcase/pages/ComponentDocPage';
import { TemplatesIndexPage } from './showcase/pages/TemplatesIndexPage';
import { TemplateDocPage } from './showcase/pages/TemplateDocPage';
import { GuidesIndexPage } from './showcase/pages/GuidesIndexPage';
import { GuidePage } from './showcase/pages/GuidePage';
// Route groups that carry the whole block registry (68 live blocks) or the
// theme editor load on demand; the home page and the docs never pay for them.
const ThemePage = lazy(() =>
  import('./showcase/pages/ThemePage').then((m) => ({ default: m.ThemePage })),
);
const BlocksIndexPage = lazy(() =>
  import('./showcase/pages/BlocksIndexPage').then((m) => ({ default: m.BlocksIndexPage })),
);
const BlockRoute = lazy(() => import('./showcase/pages/BlockRoute'));
import { PreviewPage } from './showcase/pages/PreviewPage';
import { NotFound } from './showcase/pages/NotFound';
import { getComponentDoc } from './showcase/registry/components';
import { getTemplateDoc } from './showcase/registry/templates';
import { getGuideDoc } from './showcase/registry/guides';
import { getBlockMeta } from './showcase/blocks/meta';

/* -----------------------------------------------------------------------------
 *  Root showcase shell.
 *
 *  Routing is hash-based (see ./showcase/routing). Render strategy:
 *    - #preview/* renders PreviewPage standalone — its own tab, no chrome.
 *    - #components/*, #templates/*, #guides/* render inside DocLayout.
 *    - Home / index pages render with the TopBar but no DocLayout.
 *
 *  Theme (light/dark) and the active brand preset are owned by ThemeProvider
 *  and applied to <html>, so they reach portalled overlays and persist into
 *  the standalone preview tab.
 * --------------------------------------------------------------------------- */

export function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Shell />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

function Shell() {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? { kind: 'home' } : parseHash(window.location.hash),
  );

  // Back/forward: the browser's own restore runs before the route has
  // rendered, so it clamps to a page that is still short. Remember where each
  // hash was scrolled to when it was left, and put that back once the new
  // route is tall enough. popstate fires before the hashchange it causes, so
  // the flag is set by the time the route effect below runs.
  const restoring = useRef(false);
  const positions = useRef(new Map<string, number>());
  useEffect(() => {
    // We own restoration; the browser's own pass would clamp to a page that
    // has not rendered yet and then fight the value put back below.
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    const onHash = (e: HashChangeEvent) => {
      positions.current.set(new URL(e.oldURL).hash, window.scrollY);
      setRoute(parseHash(window.location.hash));
    };
    const onPop = () => {
      restoring.current = true;
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  // SPA route change = a new "page": set the document title, reset scroll and
  // move focus to <main> so screen readers announce the new content (07 · SPA).
  const scrollKey = `${route.kind}/${'slug' in route ? route.slug : ''}`;
  const firstRender = useRef(true);
  useEffect(() => {
    const page = routeTitle(route);
    document.title = page ? `${page} — @gerege-systems/ui` : '@gerege-systems/ui';
    if (route.kind === 'preview') return;
    // Only a link click is a new page that starts at the top; a history move
    // goes back to where that hash was left, retried over a few frames while
    // lazy content is still growing the page.
    const wasHistory = restoring.current;
    restoring.current = false;
    if (!wasHistory) {
      window.scrollTo(0, 0);
    } else {
      const y = positions.current.get(window.location.hash) ?? 0;
      let tries = 0;
      const restore = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max >= y || tries++ >= 30) window.scrollTo(0, Math.min(y, Math.max(0, max)));
        else requestAnimationFrame(restore);
      };
      requestAnimationFrame(restore);
    }
    // Keep the browser's initial focus on first load; only move it on navigation.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    document.getElementById('main')?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollKey]);

  const [cmdOpen, setCmdOpen] = useState(false);
  useCommandPaletteShortcut(setCmdOpen);

  if (isFullBleedRoute(route) && route.kind === 'preview') {
    // key: switching template from the preview dock must reset screen state.
    return (
      <PreviewPage
        key={route.slug}
        slug={route.slug}
        initialScreen={route.screen}
        initialVariant={route.variant}
        initialPage={route.page}
      />
    );
  }

  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col">
      <SkipLink />
      <ShowcaseTopBar onOpenPalette={() => setCmdOpen(true)} current={route} />
      <div className="flex-1">
        <RouteView route={route} />
      </div>
      <ShowcaseFooter />
      <ShowcasePalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </div>
  );
}

/** Human page name for `document.title`; empty on the home page. */
function routeTitle(route: Route): string {
  switch (route.kind) {
    case 'home':
      return '';
    case 'catalog':
    case 'components-index':
      return 'Components';
    case 'component':
      return getComponentDoc(route.slug)?.name ?? 'Components';
    case 'templates-index':
      return 'Templates';
    case 'template':
      return getTemplateDoc(route.slug)?.name ?? 'Templates';
    case 'guides-index':
      return 'Guides';
    case 'blocks-index':
      return 'Blocks';
    case 'block':
      // The registry is lazy (see RouteView); the slug reads well enough as a
      // title — "kpi-row" → "Kpi row" — without pulling every block in early.
      return route.slug.charAt(0).toUpperCase() + route.slug.slice(1).replace(/-/g, ' ');
    case 'theme':
      return 'Theme';
    case 'guide':
      return getGuideDoc(route.slug)?.title ?? 'Guides';
    case 'preview':
      return getBlockMeta(route.slug)?.name ?? 'Preview';
    case 'not-found':
      return 'Page not found';
  }
}

/**
 * First focusable on every docs page. Visually hidden until focused. The
 * click is handled in JS because a plain `href="#main"` would be read as a
 * hash route by the showcase router.
 */
function SkipLink() {
  return (
    <a
      href="#main"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById('main')?.focus();
      }}
      className="focus:bg-card focus:text-foreground focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[var(--z-toast)] focus:rounded-md focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md focus:ring-2 focus:outline-hidden"
    >
      Skip to content
    </a>
  );
}

/**
 * Shown while a lazy route group downloads. Keeps the `main` landmark in
 * place so the skip link and route focus have a target during the wait.
 */
function RouteFallback() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto w-full max-w-[1400px] px-6 py-8 outline-hidden"
    >
      <Skeleton variant="text" className="w-48" />
    </main>
  );
}

/** Navigation is a side effect: it happens after render, never during it. */
function Redirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.hash = to;
  }, [to]);
  return null;
}

function RouteView({ route }: { route: Route }) {
  switch (route.kind) {
    case 'home':
      return <HomePage />;

    case 'catalog':
      // Back-compat: the old mega-demo wall is gone; send to components index.
      return <Redirect to={routeToHash({ kind: 'components-index' })} />;

    case 'components-index':
      return (
        <DocLayout
          sidebar={buildComponentSidebar()}
          topLinks={docTopLinks}
          current={{ kind: route.kind }}
          crossKindSections={buildCrossKindSections('component')}
        >
          <ComponentsIndexPage />
        </DocLayout>
      );

    case 'component': {
      const doc = getComponentDoc(route.slug);
      if (!doc) return <NotFound />;
      return (
        <DocLayout
          sidebar={buildComponentSidebar()}
          topLinks={docTopLinks}
          current={{ kind: 'component', slug: doc.slug }}
          crossKindSections={buildCrossKindSections('component')}
        >
          <ComponentDocPage doc={doc} />
        </DocLayout>
      );
    }

    case 'templates-index':
      return (
        <DocLayout
          sidebar={buildTemplateSidebar()}
          topLinks={docTopLinks}
          current={{ kind: route.kind }}
          crossKindSections={buildCrossKindSections('template')}
        >
          <TemplatesIndexPage />
        </DocLayout>
      );

    case 'template': {
      const doc = getTemplateDoc(route.slug);
      if (!doc) return <NotFound />;
      return (
        <DocLayout
          sidebar={buildTemplateSidebar()}
          topLinks={docTopLinks}
          current={{ kind: 'template', slug: doc.slug }}
          crossKindSections={buildCrossKindSections('template')}
        >
          <TemplateDocPage doc={doc} />
        </DocLayout>
      );
    }

    case 'guides-index':
      return (
        <DocLayout
          sidebar={buildGuideSidebar()}
          topLinks={docTopLinks}
          current={{ kind: route.kind }}
          crossKindSections={buildCrossKindSections('guide')}
        >
          <GuidesIndexPage />
        </DocLayout>
      );

    case 'guide': {
      const doc = getGuideDoc(route.slug);
      if (!doc) return <NotFound />;
      return (
        <DocLayout
          sidebar={buildGuideSidebar()}
          topLinks={docTopLinks}
          current={{ kind: 'guide', slug: doc.slug }}
          crossKindSections={buildCrossKindSections('guide')}
        >
          <GuidePage doc={doc} />
        </DocLayout>
      );
    }

    case 'blocks-index':
      return (
        <Suspense fallback={<RouteFallback />}>
          <BlocksIndexPage />
        </Suspense>
      );

    case 'block':
      return (
        <Suspense fallback={<RouteFallback />}>
          <BlockRoute slug={route.slug} />
        </Suspense>
      );

    case 'theme':
      return (
        <Suspense fallback={<RouteFallback />}>
          <ThemePage />
        </Suspense>
      );

    case 'preview':
      // Handled by Shell before reaching here; kept so the switch is exhaustive.
      // key: switching template from the preview dock must reset screen state.
      return (
        <PreviewPage
          key={route.slug}
          slug={route.slug}
          initialScreen={route.screen}
          initialVariant={route.variant}
        />
      );

    case 'not-found':
      return <NotFound />;
  }
}
