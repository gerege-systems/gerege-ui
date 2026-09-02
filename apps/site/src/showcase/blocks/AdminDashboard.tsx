import { useEffect, useRef, useState } from 'react';
import {
  ConfirmationDialog,
  Toaster,
  cn,
  useCommandPaletteShortcut,
  useToast,
} from '@gerege-systems/ui';
import { ALL_SECTIONS, STUB_PAGES, WORKSPACES, findModule } from './admin/data';
import {
  AdminLayoutContext,
  AdminPalette,
  AppSidebar,
  AppTopNav,
  DemoContext,
  EnvBanner,
  type AppSidebarMode,
  type DemoState,
  type Density,
} from './admin/shell';
import { Analytics, Overview, Reports } from './admin/overview';
import { Projects, type ProjectsHandle } from './admin/projects';
import {
  BillingPage,
  InboxPage,
  Members,
  NotFoundPage,
  PermissionDeniedPage,
  SettingsPage,
  StubPage,
  type MembersHandle,
} from './admin/pages';
import { UnsavedContext } from './admin/unsaved';
import { writeHash } from './admin/use-hash-params';
import { adminDict } from '../i18n/admin';
import { useT } from '../i18n/locale';

/* =============================================================================
 *  AdminDashboard — a complete admin console on the library's app shell.
 *
 *  · Shell: `Sidebar` (collapsible rail ≥lg, Sheet drawer below) + `TopNav`
 *    (tenant name, `/` search, notifications, profile) + `Breadcrumbs` on
 *    every page below the home. `layout="topnav"` drops the rail and moves
 *    primary navigation into the top bar as horizontal links (≤6 sections);
 *    the drawer still serves viewports below lg. `layout="dual"` is the
 *    two-tier shell: a 56px icon rail of modules + a 240px panel with the
 *    active module's sections (Slack / Linear style); below lg the drawer
 *    carries both tiers (module tabs above the list).
 *  · Keyboard: ⌘K / Ctrl+K opens the command palette, `/` focuses search,
 *    Esc closes overlays and blurs the search field.
 *  · Pages live in ./admin/* — Projects is the full table pattern (sort,
 *    filter chips, debounced search, 25/50/100 pagination, bulk bar,
 *    confirm-before-delete, first-run vs filtered empty, skeleton). Its list
 *    state lives in the URL (`…/projects?status=blocked&p=2`); the active page
 *    is mirrored into the preview hash too, so every view is a deep link.
 *  · Guards: Settings › Profile registers its dirty flag (`useUnsavedGuard`);
 *    `navigate()` then confirms "Discard changes?" and the tab warns on close.
 *    API keys renders the permission-denied (403) state.
 *
 *  Copy the folder, swap the demo data for your API, and wire `page` to your
 *  router.
 * ========================================================================== */

const SIDEBAR_KEY = 'admin-template:sidebar-collapsed';
const DENSITY_KEY = 'cb-demo-density';

/**
 * Density is a layout preference, so it lives on the shell root as
 * `data-density` and cascades via these selectors: table rows 44 → 36px,
 * card padding 24 → 16px (CANON). Pages need no per-row branching.
 */
const DENSITY_CLASSES = [
  'data-[density=compact]:[&_td]:py-2',
  'data-[density=compact]:[&_th]:h-8',
  "data-[density=compact]:[&_[class*='md:p-6']]:p-4",
  "data-[density=compact]:[&_[class*='md:px-6']]:px-4",
  "data-[density=compact]:[&_[class*='md:pt-6']]:pt-4",
].join(' ');

/** `sidebar` = collapsible rail (default); `topnav` = horizontal links, no rail; `dual` = icon rail + module panel. */
export type AdminLayout = 'sidebar' | 'topnav' | 'dual';

const SIDEBAR_MODE: Record<AdminLayout, AppSidebarMode> = {
  sidebar: 'rail',
  topnav: 'none',
  dual: 'dual',
};

/** Every navigable page key across all modules (the `sidebar`/`topnav` NAV is a subset). */
const PAGES = ALL_SECTIONS.flatMap((s) => s.items.map((i) => i.key));

export function AdminDashboard({
  layout = 'sidebar',
  initialPage,
}: {
  layout?: AdminLayout;
  /** Page to open first (deep link from the preview route); unknown keys fall back to overview. */
  initialPage?: string;
}) {
  const hasRail = layout === 'sidebar';
  const { push } = useToast();
  const t = useT(adminDict);
  // Unknown keys are kept so the shell can render its own 404 (the chrome
  // stays, the user keeps their bearings).
  const [page, setPage] = useState(() => initialPage || 'overview');
  const known = PAGES.includes(page);
  // `dual` only: which module the panel shows. Navigating to a page selects
  // its module; clicking the rail only switches the panel.
  const [module, setModule] = useState(() => findModule(page).key);
  const [workspace, setWorkspace] = useState(WORKSPACES[0].id);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  // The drawer only exists below lg; if the viewport grows past it (window
  // resize, preview width toggle) close it so it never sits over the rail.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => {
      if (mq.matches) setDrawerOpen(false);
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Demo controls (top-bar menu): data state, density, environment banner.
  const [demoState, setDemoState] = useState<DemoState>('normal');
  const [banner, setBanner] = useState(false);
  const [density, setDensityState] = useState<Density>(() => {
    try {
      return localStorage.getItem(DENSITY_KEY) === 'compact' ? 'compact' : 'default';
    } catch {
      return 'default';
    }
  });
  const setDensity = (d: Density) => {
    setDensityState(d);
    try {
      localStorage.setItem(DENSITY_KEY, d);
    } catch {
      /* private mode */
    }
  };

  const searchRef = useRef<HTMLInputElement>(null);
  const projectsRef = useRef<ProjectsHandle>(null);
  const membersRef = useRef<MembersHandle>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);

  // Persist the rail state like a real app would.
  const onCollapsedChange = (next: boolean) => {
    setCollapsed(next);
    try {
      localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0');
    } catch {
      /* private mode */
    }
  };

  // ⌘K → palette (library hook). `/` → search, unless typing in a field.
  useCommandPaletteShortcut(setPaletteOpen);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Mirror the active page into the preview hash (replaceState — no history
  // spam) so reload / share lands on the same page. Only when hosted at the
  // preview route; the template itself stays router-agnostic.
  useEffect(() => {
    const m = /^#(preview\/admin)(?:\/|$|\?)/.exec(window.location.hash);
    if (m) writeHash({}, `${m[1]}/app/${layout}/${page}`);
  }, [layout, page]);

  // Unsaved-changes guard: a page registers `dirty`; navigation then asks first.
  const [dirty, setDirty] = useState(false);
  const [pendingNav, setPendingNav] = useState<(() => void) | null>(null);
  const go = (key: string) => {
    setPage(key);
    setModule(findModule(key).key);
    setDrawerOpen(false);
  };
  const guarded = (key: string, then?: () => void) => {
    const run = () => {
      go(key);
      then?.();
    };
    if (dirty && key !== page) setPendingNav(() => run);
    else run();
  };
  const navigate = (key: string) => guarded(key);

  // Global search lands on the Projects list.
  const onSearchChange = (q: string) => {
    setSearch(q);
    if (q && page !== 'projects') guarded('projects');
  };

  const runAction = (action: 'new-project' | 'invite' | 'toggle-sidebar') => {
    switch (action) {
      case 'new-project':
        // Defer until the page has mounted its handle.
        guarded('projects', () => window.setTimeout(() => projectsRef.current?.create(), 0));
        break;
      case 'invite':
        guarded('members', () => window.setTimeout(() => membersRef.current?.invite(), 0));
        break;
      case 'toggle-sidebar':
        onCollapsedChange(!collapsed);
        break;
    }
  };

  const ws = WORKSPACES.find((w) => w.id === workspace) ?? WORKSPACES[0];

  return (
    // h-dvh + min-h-0 down the column: flex children default to
    // min-height:auto, so without it <main> grows to its content, overflows the
    // shell, and any focus() on an off-screen row scrolls the overflow-hidden
    // root itself (sidebar "scrolls away"). With min-h-0 only <main> scrolls.
    <AdminLayoutContext.Provider value={layout}>
      <UnsavedContext.Provider value={setDirty}>
        <DemoContext.Provider
          value={{
            state: demoState,
            setState: setDemoState,
            density,
            setDensity,
            banner,
            setBanner,
          }}
        >
          <div
            data-density={density}
            className={cn(
              'bg-background text-foreground flex h-dvh overflow-hidden',
              DENSITY_CLASSES,
            )}
          >
            <AppSidebar
              page={page}
              onNavigate={navigate}
              workspace={workspace}
              onWorkspaceChange={setWorkspace}
              collapsed={collapsed}
              onCollapsedChange={onCollapsedChange}
              drawerOpen={drawerOpen}
              onDrawerOpenChange={setDrawerOpen}
              drawerTriggerRef={drawerTriggerRef}
              mode={SIDEBAR_MODE[layout]}
              module={module}
              onModuleChange={setModule}
            />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <AppTopNav
                ref={searchRef}
                workspace={ws}
                onOpenDrawer={() => setDrawerOpen(true)}
                drawerTriggerRef={drawerTriggerRef}
                onOpenPalette={() => setPaletteOpen(true)}
                onNavigate={navigate}
                onSignOut={() =>
                  push({ title: t('toast.signedOut'), description: t('toast.signedOutDesc') })
                }
                searchValue={search}
                onSearchChange={onSearchChange}
                layout={layout}
                page={page}
                onWorkspaceChange={setWorkspace}
              />
              {banner && <EnvBanner />}
              <main
                id="main"
                tabIndex={-1}
                // `relative`: a scroll pane must be the containing block for its
                // absolutely positioned descendants. Without it an `sr-only`
                // label (position:absolute) deep in a long page resolves against
                // the initial containing block, escapes both this pane's and the
                // shell's overflow, and grows the document — a second scrollbar
                // and dead space below the shell.
                className="bg-background-subtle relative min-h-0 flex-1 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] outline-none md:p-6 md:pb-[max(1.5rem,env(safe-area-inset-bottom))]"
              >
                <div className="mx-auto max-w-[1440px]">
                  {!known && <NotFoundPage page={page} onNavigate={navigate} />}
                  {page === 'overview' && <Overview onNavigate={navigate} />}
                  {page === 'analytics' && <Analytics onNavigate={navigate} />}
                  {page === 'projects' && (
                    <Projects ref={projectsRef} onNavigate={navigate} globalQuery={search} />
                  )}
                  {page === 'inbox' && <InboxPage onNavigate={navigate} />}
                  {page === 'members' && <Members ref={membersRef} onNavigate={navigate} />}
                  {page === 'reports' && <Reports onNavigate={navigate} />}
                  {page === 'settings' && <SettingsPage onNavigate={navigate} />}
                  {page === 'billing' && <BillingPage onNavigate={navigate} />}
                  {page === 'apikeys' && <PermissionDeniedPage onNavigate={navigate} />}
                  {page in STUB_PAGES && <StubPage page={page} onNavigate={navigate} />}
                </div>
              </main>
            </div>

            <AdminPalette
              open={paletteOpen}
              onOpenChange={setPaletteOpen}
              onNavigate={navigate}
              onAction={runAction}
              hasSidebar={hasRail}
              sections={layout === 'dual' ? ALL_SECTIONS : undefined}
            />
            <ConfirmationDialog
              open={pendingNav !== null}
              onOpenChange={(open) => {
                if (!open) setPendingNav(null);
              }}
              title={t('unsaved.title')}
              description={t('unsaved.desc')}
              cancelLabel={t('unsaved.keep')}
              confirmLabel={t('unsaved.discard')}
              confirmVariant="destructive"
              onConfirm={() => {
                const run = pendingNav;
                setPendingNav(null);
                setDirty(false);
                run?.();
              }}
            />
            <Toaster />
          </div>
        </DemoContext.Provider>
      </UnsavedContext.Provider>
    </AdminLayoutContext.Provider>
  );
}
