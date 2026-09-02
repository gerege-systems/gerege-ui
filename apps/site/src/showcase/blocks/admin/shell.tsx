import { createContext, forwardRef, useContext, type ReactNode, type RefObject } from 'react';
import {
  Bell,
  Sparkles,
  AlertTriangle,
  Check,
  Circle,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Menu,
  Moon,
  Plus,
  Search,
  Sun,
  Settings as SettingsIcon,
  User,
} from '@/icons';
import { useModifierKey } from '@/hooks/use-modifier-key';
import { useTheme, type Theme } from '../../theme/theme-context';
import { MonitorIcon, NEXT_THEME } from '../../theme/Controls';
import { adminDict, type AdminKey } from '../../i18n/admin';
import { useT, useLocale, useSetLocale } from '../../i18n/locale';
import {
  Avatar,
  Badge,
  Breadcrumbs,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  IconButton,
  Input,
  Kbd,
  Sheet,
  SheetContent,
  SheetTitle,
  Sidebar,
  SidebarItem,
  SidebarSection,
  TopNav,
  Tooltip,
  cn,
  useSidebar,
  useStrings,
} from '@gerege-systems/ui';
import {
  MODULES,
  NAV,
  NOTIFICATIONS,
  USER,
  WORKSPACES,
  findModule,
  findNav,
  formatRelative,
  type NavSection,
  type Workspace,
} from './data';

/* =============================================================================
 *  Admin template — app shell built from the library Sidebar + TopNav +
 *  Breadcrumbs. The sidebar collapses to an icon rail on desktop (≥lg) and
 *  becomes a Sheet drawer below that. The top bar always shows the tenant.
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 *  Workspace (tenant) switcher — sidebar header slot
 * ------------------------------------------------------------------------ */

export function WorkspaceSwitcher({
  value,
  onChange,
  variant = 'sidebar',
}: {
  value: string;
  onChange: (id: string) => void;
  /** `sidebar` fills the rail header (collapses with it); `bar` is a compact top-bar trigger. */
  variant?: 'sidebar' | 'bar';
}) {
  // Outside a Sidebar the context defaults to `collapsed: false`, so the bar
  // variant is safe without a provider.
  const t = useT(adminDict);
  const { collapsed: railCollapsed } = useSidebar();
  const collapsed = variant === 'sidebar' && railCollapsed;
  const ws = WORKSPACES.find((w) => w.id === value) ?? WORKSPACES[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={collapsed ? t('ws.label', { name: ws.name }) : undefined}
          className={cn(
            'flex items-center gap-2 rounded-md text-left transition-colors outline-none',
            'hover:bg-background-muted focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
            variant === 'bar' ? 'h-9 min-w-0 px-1.5' : 'h-10 w-full',
            variant === 'sidebar' && (collapsed ? 'justify-center px-0' : 'px-1.5'),
          )}
        >
          <Avatar
            size={variant === 'bar' ? 'sm' : 'md'}
            fallback={ws.initial}
            alt=""
            className="rounded-md [&_span]:rounded-md"
          />
          {variant === 'bar' ? (
            <>
              <span className="text-foreground truncate text-sm font-semibold" title={ws.name}>
                {ws.name}
              </span>
              <ChevronsUpDown className="text-foreground-subtle size-4 shrink-0" aria-hidden />
            </>
          ) : (
            !collapsed && (
              <>
                <span
                  className="text-foreground min-w-0 flex-1 truncate text-sm font-semibold"
                  title={ws.name}
                >
                  {ws.name}
                </span>
                <ChevronsUpDown className="text-foreground-subtle size-4 shrink-0" aria-hidden />
              </>
            )
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[232px]">
        <DropdownMenuLabel>{t('ws.list')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {WORKSPACES.map((w) => (
          <DropdownMenuItem key={w.id} onSelect={() => onChange(w.id)} className="gap-2">
            <Avatar size="sm" fallback={w.initial} alt="" />
            <span className="text-foreground min-w-0 flex-1 truncate text-sm" title={w.name}>
              {w.name}
            </span>
            {w.id === value && <Check className="text-accent size-4" aria-hidden />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <span className="border-border text-foreground-subtle inline-flex size-6 items-center justify-center rounded-md border border-dashed">
            <Plus className="size-3.5" aria-hidden />
          </span>
          {t('ws.create')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------------------------------------------------------------------------
 *  Navigation list — shared by the desktop rail and the mobile drawer
 * ------------------------------------------------------------------------ */

function NavItems({
  page,
  onNavigate,
  sections = NAV,
}: {
  page: string;
  onNavigate: (key: string) => void;
  sections?: NavSection[];
}) {
  const { collapsed } = useSidebar();
  const t = useT(adminDict);
  return (
    <>
      {sections.map((section) => (
        <SidebarSection key={section.label} label={t(section.label)}>
          {section.items.map((it) => {
            const active = page === it.key;
            const Icon = it.icon;
            const item = (
              <SidebarItem
                key={it.key}
                icon={<Icon />}
                active={active}
                onClick={() => onNavigate(it.key)}
                trailing={
                  it.count != null ? (
                    <Badge tone={active ? 'accent' : 'neutral'} className="tabular">
                      {it.count}
                    </Badge>
                  ) : undefined
                }
                className={cn(
                  // Active = accent bar + weight + background, never colour alone.
                  'before:bg-accent relative before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:w-0.5 before:rounded-full before:opacity-0',
                  active && 'text-foreground before:opacity-100',
                )}
              >
                {t(it.label)}
              </SidebarItem>
            );
            // Icon-only rail must still name the destination.
            return collapsed ? (
              <Tooltip key={it.key} label={t(it.label)} side="right">
                {item}
              </Tooltip>
            ) : (
              item
            );
          })}
        </SidebarSection>
      ))}
    </>
  );
}

function UserCard() {
  const { collapsed } = useSidebar();
  return (
    <div className={cn('flex items-center gap-2', collapsed ? 'justify-center' : 'px-1')}>
      <Avatar size="sm" fallback={USER.initials} alt={USER.name} status="online" />
      {!collapsed && (
        <div className="min-w-0 leading-tight">
          <div className="text-foreground truncate text-sm font-medium" title={USER.name}>
            {USER.name}
          </div>
          <div className="text-foreground-subtle truncate text-xs" title={USER.email}>
            {USER.email}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 *  `dual` shell — icon rail of modules (56px) + 240px panel of the active
 *  module's sections. Two-tier navigation for products with many areas.
 * ------------------------------------------------------------------------ */

function RailButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip label={label} side="right">
      <button
        type="button"
        aria-label={label}
        aria-current={active ? 'page' : undefined}
        onClick={onClick}
        className={cn(
          'relative inline-flex size-10 items-center justify-center rounded-md outline-none [&_svg]:size-5',
          'transition-colors duration-[var(--duration-fast)]',
          'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
          // Active = accent bar on the rail's left edge + background + accent
          // icon, never colour alone. The bar sits outside the 40px button so
          // it hugs the rail edge (button is centred in a 56px rail → 8px gap).
          'before:bg-accent before:absolute before:top-2 before:bottom-2 before:-left-2 before:w-0.5 before:rounded-r-full before:opacity-0',
          active
            ? 'bg-background-muted text-accent before:opacity-100'
            : 'text-foreground-muted hover:bg-surface-hover hover:text-foreground',
        )}
      >
        {icon}
      </button>
    </Tooltip>
  );
}

export function AppRail({
  module,
  onModuleChange,
  onNavigate,
}: {
  module: string;
  onModuleChange: (key: string) => void;
  onNavigate: (key: string) => void;
}) {
  const t = useT(adminDict);
  return (
    <nav
      aria-label={t('rail.modules')}
      className="border-border bg-background-subtle hidden w-14 shrink-0 flex-col items-center gap-1 border-r py-2 lg:flex"
    >
      {/* Brand mark — the rail is the only chrome that never scrolls away. */}
      <span
        aria-hidden
        className="bg-foreground text-background mb-2 inline-flex size-8 items-center justify-center rounded-md text-sm font-semibold"
      >
        A
      </span>
      {/* Modules scroll independently when there are more than fit (short
          laptops, many areas); brand above and the user below stay pinned.
          Scrollbar hidden, edge fades signal overflow. */}
      <div className="relative min-h-0 w-full flex-1">
        <div
          className="flex h-full w-full [scrollbar-width:none] flex-col items-center gap-1 overflow-y-auto overscroll-contain py-0.5 [&::-webkit-scrollbar]:hidden"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent, #000 10px, #000 calc(100% - 10px), transparent)',
          }}
        >
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <RailButton
                key={m.key}
                label={t(m.label)}
                icon={<Icon />}
                active={m.key === module}
                onClick={() => onModuleChange(m.key)}
              />
            );
          })}
        </div>
      </div>
      <div className="mt-1 shrink-0">
        <Tooltip label={t('rail.userSettings', { name: USER.name })} side="right">
          <button
            type="button"
            aria-label={t('rail.userOpen', { name: USER.name })}
            onClick={() => onNavigate('settings')}
            className="hover:bg-background-muted focus-visible:ring-ring focus-visible:ring-offset-background inline-flex size-10 items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <Avatar size="sm" fallback={USER.initials} alt="" status="online" />
          </button>
        </Tooltip>
      </div>
    </nav>
  );
}

/** Segmented module strip — the drawer's stand-in for the rail below lg. */
function ModuleTabs({
  module,
  onModuleChange,
}: {
  module: string;
  onModuleChange: (key: string) => void;
}) {
  const t = useT(adminDict);
  return (
    <div
      role="group"
      aria-label={t('rail.modules')}
      className="bg-background-muted flex w-full snap-x [scrollbar-width:none] gap-0.5 overflow-x-auto rounded-md p-0.5 [&::-webkit-scrollbar]:hidden"
    >
      {MODULES.map((m) => {
        const Icon = m.icon;
        const active = m.key === module;
        return (
          <button
            key={m.key}
            type="button"
            aria-pressed={active}
            onClick={() => onModuleChange(m.key)}
            // Five tabs overflow a 256px drawer; keep the active one in view.
            ref={
              active
                ? (el) => el?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
                : undefined
            }
            className={cn(
              'inline-flex h-8 shrink-0 snap-start items-center justify-center gap-1.5 rounded-md px-2.5 text-sm whitespace-nowrap outline-none [&_svg]:size-4',
              'transition-colors duration-[var(--duration-fast)]',
              'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
              active
                ? 'bg-background text-foreground font-medium shadow-sm'
                : 'text-foreground-muted hover:text-foreground',
            )}
          >
            <Icon aria-hidden />
            {t(m.label)}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Leading icon for status badges — shape + colour, so status never relies on
 * colour alone. Decorative: the badge text carries the meaning.
 */
export function StatusIcon({
  tone,
}: {
  tone: 'success' | 'warning' | 'danger' | 'neutral' | 'accent' | 'info';
}) {
  const Icon =
    tone === 'success' ? Check : tone === 'danger' || tone === 'warning' ? AlertTriangle : Circle;
  return <Icon className="size-3 shrink-0" aria-hidden />;
}

function PanelHeader({ label }: { label: string }) {
  // Module name, distinct from the uppercase section labels below it.
  return <h2 className="text-foreground truncate text-sm font-semibold">{label}</h2>;
}

/* ---------------------------------------------------------------------------
 *  Breadcrumb trail — Home › [Module ›] Section › Page. The module crumb is
 *  only meaningful in `dual`, where the rail owns that tier. `href` carries the
 *  page key so `renderLink` can route through `onNavigate`.
 * ------------------------------------------------------------------------ */

export function pageCrumbs(page: string, t: (key: AdminKey) => string, withModule = false) {
  const nav = findNav(page);
  if (!nav || page === 'overview') return null;
  const mod = findModule(page);
  return [
    { label: t('crumb.home'), href: 'overview' },
    ...(withModule && t(mod.label) !== t(nav.section.label)
      ? [{ label: t(mod.label), href: mod.sections[0].items[0].key }]
      : []),
    { label: t(nav.section.label) },
    { label: t(nav.item.label) },
  ];
}

export function PageCrumbs({
  page,
  withModule,
  onNavigate,
  className,
}: {
  page: string;
  withModule?: boolean;
  onNavigate?: (key: string) => void;
  className?: string;
}) {
  const t = useT(adminDict);
  const crumbs = pageCrumbs(page, t, withModule);
  if (!crumbs) return null;
  return (
    <Breadcrumbs
      items={crumbs}
      className={className}
      renderLink={(href, children) => (
        <button
          type="button"
          onClick={() => onNavigate?.(href)}
          className="hover:text-foreground focus-visible:ring-ring rounded-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          {children}
        </button>
      )}
    />
  );
}

/** Shell layout, so `PageHeader` knows when the top bar already shows the trail. */
export const AdminLayoutContext = createContext<'sidebar' | 'topnav' | 'dual'>('sidebar');

/* ---------------------------------------------------------------------------
 *  Demo controls — preview every page in its loading / empty / error state,
 *  toggle the environment banner and the table density. In a real app `state`
 *  comes from your data layer; `density` is a user preference (localStorage).
 * ------------------------------------------------------------------------ */

export type DemoState = 'normal' | 'loading' | 'empty' | 'error';
export type Density = 'default' | 'compact';

export interface DemoControls {
  state: DemoState;
  setState: (s: DemoState) => void;
  density: Density;
  setDensity: (d: Density) => void;
  banner: boolean;
  setBanner: (on: boolean) => void;
}

export const DemoContext = createContext<DemoControls>({
  state: 'normal',
  setState: () => {},
  density: 'default',
  setDensity: () => {},
  banner: false,
  setBanner: () => {},
});

export const useDemo = () => useContext(DemoContext);

const DEMO_STATES: { value: DemoState; label: AdminKey }[] = [
  { value: 'normal', label: 'demo.normal' },
  { value: 'loading', label: 'demo.loading' },
  { value: 'empty', label: 'demo.empty' },
  { value: 'error', label: 'demo.error' },
];

function DemoMenu() {
  const demo = useDemo();
  const t = useT(adminDict);
  const stateLabel = DEMO_STATES.find((s) => s.value === demo.state)?.label ?? 'demo.normal';
  return (
    <DropdownMenu>
      <Tooltip label={t('demo.controls')}>
        <DropdownMenuTrigger asChild>
          <IconButton
            aria-label={t('demo.controlsState', { state: t(stateLabel) })}
            icon={<Sparkles />}
            variant="ghost"
            size="sm"
          />
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-foreground-subtle text-xs font-normal">
          {t('demo.state')}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={demo.state}
          onValueChange={(v) => demo.setState(v as DemoState)}
        >
          {DEMO_STATES.map((s) => (
            <DropdownMenuRadioItem key={s.value} value={s.value}>
              {t(s.label)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-foreground-subtle text-xs font-normal">
          {t('demo.density')}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={demo.density}
          onValueChange={(v) => demo.setDensity(v as Density)}
        >
          <DropdownMenuRadioItem value="default">{t('demo.default')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="compact">{t('demo.compact')}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={demo.banner} onCheckedChange={demo.setBanner}>
          {t('demo.banner')}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Slim environment bar — visible on every page so nobody edits prod thinking it's staging. */
export function EnvBanner({ label }: { label?: string }) {
  const t = useT(adminDict);
  return (
    <div
      role="status"
      className="bg-warning-soft text-warning-text border-warning-border-soft flex h-7 shrink-0 items-center justify-center gap-2 border-b px-4 text-xs font-medium"
    >
      <AlertTriangle className="size-3.5" aria-hidden />
      {t('env.banner', { label: label ?? t('env.staging') })}
    </div>
  );
}

/** `rail` = collapsible sidebar (≥lg); `dual` = icon rail + module panel; `none` = drawer only. */
export type AppSidebarMode = 'rail' | 'dual' | 'none';

export interface AppSidebarProps {
  page: string;
  onNavigate: (key: string) => void;
  workspace: string;
  onWorkspaceChange: (id: string) => void;
  collapsed: boolean;
  onCollapsedChange: (next: boolean) => void;
  /** Mobile drawer state (below lg). */
  drawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
  /** The hamburger that opens the drawer — focus returns to it on close. */
  drawerTriggerRef?: RefObject<HTMLButtonElement>;
  /** Desktop chrome (≥lg). Every mode keeps the drawer below lg. */
  mode?: AppSidebarMode;
  /** Active module for `dual`. */
  module?: string;
  onModuleChange?: (key: string) => void;
}

/**
 * Desktop rail (≥lg, collapsible) + mobile drawer (<lg). Both render the same
 * `Sidebar` from the library so the two never drift.
 */
export function AppSidebar({
  page,
  onNavigate,
  workspace,
  onWorkspaceChange,
  collapsed,
  onCollapsedChange,
  drawerOpen,
  onDrawerOpenChange,
  drawerTriggerRef,
  mode = 'rail',
  module = MODULES[0].key,
  onModuleChange = () => {},
}: AppSidebarProps) {
  const navigate = (key: string) => {
    onNavigate(key);
    onDrawerOpenChange(false);
  };
  const t = useT(adminDict);
  const dual = mode === 'dual';
  const activeModule = MODULES.find((m) => m.key === module) ?? MODULES[0];
  const sections = dual ? activeModule.sections : NAV;
  return (
    <>
      {dual && (
        <>
          <AppRail module={module} onModuleChange={onModuleChange} onNavigate={navigate} />
          <Sidebar
            aria-label={t('rail.nav', { module: t(activeModule.label) })}
            // The tenant lives here (as in the `rail` header); the module is
            // named by the rail tooltip and the breadcrumb, plus this sr-only heading.
            header={
              <>
                <h2 className="sr-only">{t(activeModule.label)}</h2>
                <WorkspaceSwitcher value={workspace} onChange={onWorkspaceChange} />
              </>
            }
            // Panel is fixed-width: no collapse control (the rail already is the icon tier).
            className="md:hidden lg:flex [&>button:last-child]:hidden"
          >
            <NavItems page={page} onNavigate={navigate} sections={sections} />
          </Sidebar>
        </>
      )}
      {mode === 'rail' && (
        <Sidebar
          collapsed={collapsed}
          onCollapsedChange={onCollapsedChange}
          header={<WorkspaceSwitcher value={workspace} onChange={onWorkspaceChange} />}
          footer={<UserCard />}
          // The library default is `hidden md:flex`; the admin shell promotes the
          // breakpoint to lg and serves a drawer below it.
          className="md:hidden lg:flex"
        >
          <NavItems page={page} onNavigate={navigate} />
        </Sidebar>
      )}

      <Sheet open={drawerOpen} onOpenChange={onDrawerOpenChange}>
        <SheetContent
          side="left"
          className="w-64 p-0"
          showClose={false}
          // Controlled sheet (no SheetTrigger): Radix would hand focus back
          // to <body>, so return it to the hamburger explicitly.
          onCloseAutoFocus={(e) => {
            if (!drawerTriggerRef?.current) return;
            e.preventDefault();
            drawerTriggerRef.current.focus();
          }}
        >
          <SheetTitle className="sr-only">{t('drawer.title')}</SheetTitle>
          <Sidebar
            header={
              dual ? (
                <ModuleTabs module={module} onModuleChange={onModuleChange} />
              ) : (
                <WorkspaceSwitcher value={workspace} onChange={onWorkspaceChange} />
              )
            }
            footer={<UserCard />}
            className="flex h-full w-full border-r-0"
          >
            {dual && (
              <div className="px-4 pb-2">
                <PanelHeader label={t(activeModule.label)} />
              </div>
            )}
            <NavItems page={page} onNavigate={navigate} sections={sections} />
          </Sidebar>
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ---------------------------------------------------------------------------
 *  Horizontal primary nav — the `topnav` shell. Sections are flattened to
 *  their items (≤6 here); Settings and Billing stay in the profile menu.
 *  Active = accent bar + weight, never colour alone. Visible ≥lg only; below
 *  that the hamburger opens the same drawer as the sidebar shell.
 * ------------------------------------------------------------------------ */

const TOPNAV_KEYS = ['overview', 'analytics', 'projects', 'inbox', 'members', 'reports'];

function TopNavItems({ page, onNavigate }: { page: string; onNavigate: (key: string) => void }) {
  const items = NAV.flatMap((s) => s.items).filter((it) => TOPNAV_KEYS.includes(it.key));
  const t = useT(adminDict);
  return (
    // The library nav slot shows from md; this shell needs lg for six links +
    // a workspace switcher + search, so the wrapper hides itself below lg.
    <div className="hidden lg:contents">
      {items.map((it) => {
        const active = page === it.key;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onNavigate(it.key)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm outline-none',
              'transition-colors duration-[var(--duration-fast)]',
              'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
              'after:bg-accent after:absolute after:inset-x-3 after:-bottom-2.5 after:h-0.5 after:rounded-full after:opacity-0',
              active
                ? 'text-foreground font-semibold after:opacity-100'
                : 'text-foreground-muted hover:text-foreground font-medium',
            )}
          >
            {t(it.label)}
            {it.count != null && (
              <Badge tone={active ? 'accent' : 'neutral'} className="tabular">
                {it.count}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 *  Top bar — tenant name, search (`/`), ⌘K hint, notifications, profile
 * ------------------------------------------------------------------------ */

export interface AppTopNavProps {
  workspace: Workspace;
  onOpenDrawer: () => void;
  /** Ref to the hamburger so the drawer can restore focus on close. */
  drawerTriggerRef?: RefObject<HTMLButtonElement>;
  onOpenPalette: () => void;
  onNavigate: (key: string) => void;
  onSignOut: () => void;
  searchValue: string;
  onSearchChange: (q: string) => void;
  /** `sidebar` (default) shows the tenant name; `topnav` adds primary links + the workspace switcher; `dual` shows the breadcrumb trail. */
  layout?: 'sidebar' | 'topnav' | 'dual';
  /** Active page — needed for the `topnav` links' active state. */
  page?: string;
  onWorkspaceChange?: (id: string) => void;
}

export const AppTopNav = forwardRef<HTMLInputElement, AppTopNavProps>(function AppTopNav(
  {
    workspace,
    onOpenDrawer,
    drawerTriggerRef,
    onOpenPalette,
    onNavigate,
    onSignOut,
    searchValue,
    onSearchChange,
    layout = 'sidebar',
    page = '',
    onWorkspaceChange,
  },
  searchRef,
) {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  const mod = useModifierKey();
  const t = useT(adminDict);
  const { relativeTime } = useStrings();
  // Site-wide theme (same store as the preview dock), so both stay in sync.
  const { theme, setTheme, toggleTheme } = useTheme();
  const locale = useLocale();
  const setLocale = useSetLocale();
  const themeLabel = (th: Theme) => t(`theme.${th}`);
  return (
    <TopNav
      className="bg-background supports-[backdrop-filter]:bg-background"
      logo={
        <div className="flex min-w-0 items-center gap-2">
          <IconButton
            ref={drawerTriggerRef}
            aria-label={t('topnav.openNav')}
            icon={<Menu />}
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onOpenDrawer}
          />
          {layout === 'topnav' ? (
            // No sidebar header to host the switcher, so it lives in the bar.
            <WorkspaceSwitcher
              variant="bar"
              value={workspace.id}
              onChange={(id) => onWorkspaceChange?.(id)}
            />
          ) : (
            // Sidebar/dual: the sidebar (or panel) header already shows the
            // tenant, so the bar carries the trail (≥lg) and collapses to the
            // current page title below that. Dual adds the module crumb.
            <>
              <PageCrumbs
                page={page}
                withModule={layout === 'dual'}
                onNavigate={onNavigate}
                className="hidden min-w-0 lg:block"
              />
              <span className="text-foreground truncate text-sm font-semibold lg:hidden">
                {t(findNav(page)?.item.label ?? 'crumb.home')}
              </span>
            </>
          )}
        </div>
      }
      nav={layout === 'topnav' ? <TopNavItems page={page} onNavigate={onNavigate} /> : undefined}
      search={
        <Input
          ref={searchRef}
          type="search"
          label={t('topnav.search')}
          hideLabel
          size="sm"
          placeholder={t('topnav.searchPlaceholder')}
          prefix={<Search className="size-4" aria-hidden />}
          suffix={
            <span className="hidden items-center gap-0.5 sm:inline-flex">
              <Kbd>/</Kbd>
            </span>
          }
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          clearable
          onClear={() => onSearchChange('')}
          onKeyDown={(e) => {
            if (e.key === 'Escape') (e.target as HTMLInputElement).blur();
          }}
          className="hidden md:block"
        />
      }
      actions={
        <>
          <Tooltip label={t('topnav.palette', { mod: mod.label })}>
            <IconButton
              aria-label={t('topnav.openPalette')}
              icon={<Search />}
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={onOpenPalette}
            />
          </Tooltip>

          <DemoMenu />

          <Tooltip label={t('topnav.theme', { theme: themeLabel(theme) })}>
            <IconButton
              aria-label={t('topnav.themeSwitch', {
                theme: themeLabel(theme),
                next: themeLabel(NEXT_THEME[theme]),
              })}
              icon={theme === 'light' ? <Sun /> : theme === 'dark' ? <Moon /> : <MonitorIcon />}
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
            />
          </Tooltip>

          {setLocale && (
            <Tooltip label={t('topnav.lang')}>
              <Button
                variant="ghost"
                size="sm"
                aria-label={t('topnav.langSwitch')}
                className="px-2 font-semibold tabular-nums"
                onClick={() => setLocale(locale === 'en' ? 'mn' : 'en')}
              >
                {locale === 'en' ? 'MN' : 'EN'}
              </Button>
            </Tooltip>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                aria-label={unread > 0 ? t('notif.count', { n: unread }) : t('notif.title')}
                icon={
                  <span className="relative inline-flex">
                    <Bell />
                    {unread > 0 && (
                      <span
                        aria-hidden
                        className="bg-accent ring-background absolute -top-0.5 -right-0.5 size-2 rounded-full ring-2"
                      />
                    )}
                  </span>
                }
                variant="ghost"
                size="sm"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[min(20rem,calc(100vw-2rem))]">
              <DropdownMenuLabel className="flex items-center justify-between">
                {t('notif.title')}
                {unread > 0 && <Badge tone="accent">{t('notif.new', { n: unread })}</Badge>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {NOTIFICATIONS.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className="flex items-start gap-2"
                  onSelect={() => onNavigate('inbox')}
                >
                  <Avatar size="xs" fallback={n.initials} alt="" className="mt-0.5" />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-foreground text-sm">
                      <span className="font-medium">{n.who}</span> {t(n.text, { target: n.target })}
                    </span>
                    <span className="text-foreground-subtle text-xs">
                      {formatRelative(n.at, relativeTime).label}
                    </span>
                  </span>
                  {n.unread && (
                    <span
                      aria-label={t('notif.unread')}
                      className="bg-accent mt-1.5 ml-auto size-1.5 rounded-full"
                    />
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => onNavigate('inbox')}>
                {t('notif.viewAll')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={t('account.menu')}
                className="hover:bg-background-muted focus-visible:ring-ring focus-visible:ring-offset-background ml-1 inline-flex size-8 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <Avatar size="sm" fallback={USER.initials} alt={USER.name} status="online" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="leading-tight">
                  <div className="text-foreground text-sm font-medium">{USER.name}</div>
                  <div className="text-foreground-subtle text-xs font-normal">{USER.email}</div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => onNavigate('settings')}>
                <User className="size-4" aria-hidden /> {t('account.profile')}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onNavigate('settings')}>
                <SettingsIcon className="size-4" aria-hidden /> {t('account.settings')}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onNavigate('billing')}>
                <CreditCard className="size-4" aria-hidden /> {t('account.billing')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-foreground-subtle text-xs font-normal">
                {t('account.theme')}
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as Theme)}>
                <DropdownMenuRadioItem value="light">{t('theme.light')}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">{t('theme.dark')}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">{t('theme.system')}</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onSignOut}>
                <LogOut className="size-4" aria-hidden /> {t('account.signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
    />
  );
});

/* ---------------------------------------------------------------------------
 *  Page header — the library has no page-level header primitive, so this thin
 *  local one keeps "h1 left, primary action right" consistent. Breadcrumbs
 *  appear automatically for any page below the home (depth ≥ 2).
 * ------------------------------------------------------------------------ */

export function PageHeader({
  page,
  title,
  subtitle,
  actions,
  onNavigate,
  hideBreadcrumbs,
}: {
  page: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  onNavigate?: (key: string) => void;
  /** Defaults to true in the `dual` shell, whose top bar already shows the trail. */
  hideBreadcrumbs?: boolean;
}) {
  const layout = useContext(AdminLayoutContext);
  const hide = hideBreadcrumbs ?? layout !== 'topnav';
  return (
    <header className="mb-6">
      {!hide && <PageCrumbs page={page} onNavigate={onNavigate} className="mb-2" />}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-foreground-muted mt-1 text-sm">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------------------
 *  ⌘K palette — navigation + actions
 * ------------------------------------------------------------------------ */

export function AdminPalette({
  open,
  onOpenChange,
  onNavigate,
  onAction,
  hasSidebar = true,
  sections = NAV,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (key: string) => void;
  onAction: (action: 'new-project' | 'invite' | 'toggle-sidebar') => void;
  /** False in the `topnav` / `dual` shells — there is no rail to toggle. */
  hasSidebar?: boolean;
  /** Navigation groups to list; the `dual` shell passes every module's sections. */
  sections?: NavSection[];
}) {
  const t = useT(adminDict);
  const run = (fn: () => void) => () => {
    onOpenChange(false);
    fn();
  };
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title={t('palette.title')}>
      <CommandInput placeholder={t('palette.placeholder')} />
      <CommandList>
        <CommandEmpty>{t('palette.empty')}</CommandEmpty>
        <CommandGroup heading={t('palette.actions')}>
          <CommandItem onSelect={run(() => onAction('new-project'))}>
            <Plus /> {t('palette.newProject')}
            <CommandShortcut>N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={run(() => onAction('invite'))}>
            <User /> {t('palette.invite')}
          </CommandItem>
          {hasSidebar && (
            <CommandItem onSelect={run(() => onAction('toggle-sidebar'))}>
              <Menu /> {t('palette.toggleSidebar')}
            </CommandItem>
          )}
        </CommandGroup>
        {sections.map((section) => (
          <CommandGroup key={section.label} heading={t(section.label)}>
            {section.items.map((it) => {
              const Icon = it.icon;
              return (
                <CommandItem
                  key={it.key}
                  value={`${t(section.label)} ${t(it.label)}`}
                  onSelect={run(() => onNavigate(it.key))}
                >
                  <Icon /> {t(it.label)}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
