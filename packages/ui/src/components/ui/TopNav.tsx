'use client';

import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useStrings } from '@/hooks/use-strings';
import { cn } from '@/lib/utils';

export interface TopNavProps extends HTMLAttributes<HTMLElement> {
  /** Logo / wordmark slot. Shown on the far left. */
  logo: ReactNode;
  /** Primary navigation links — typically a list of `<TopNavLink>`. */
  nav?: ReactNode;
  /** Search / command bar slot — fills the centre on wide screens. */
  search?: ReactNode;
  /** Right-aligned cluster — notifications, theme toggle, user menu. */
  actions?: ReactNode;
  /** Accessible name of the inner `<nav>` landmark. Default "Primary". */
  navLabel?: string;
}

/**
 * App-level top bar. Layout: `logo · nav · search · actions`. Search and nav
 * are optional.
 *
 * @example
 *   <TopNav
 *     logo={<Logo />}
 *     nav={<><TopNavLink href="/" active>Home</TopNavLink>…</>}
 *     search={<Input type="search" placeholder="Search…" />}
 *     actions={<><Bell /><Avatar /></>}
 *   />
 *
 * @do Pick one primary nav style — links here or in the Sidebar, not both.
 * @dont Stack two rows of navigation in the TopNav. If you need tabs as well,
 *       put them below the bar inside the page content.
 */
export const TopNav = forwardRef<HTMLElement, TopNavProps>(function TopNav(
  { logo, nav, search, actions, navLabel, className, ...props },
  ref,
) {
  const strings = useStrings();
  return (
    <header
      data-slot="top-nav"
      ref={ref}
      className={cn(
        'sticky top-0 z-[var(--z-sticky)] flex h-14 w-full items-center gap-4',
        // Fixed three-column track from lg up: the centre slot keeps its
        // position however wide the logo slot grows, so navigating between
        // pages (breadcrumbs of different lengths) never shifts the search.
        // Below lg the bar stays flex — there is not enough room for three
        // tracks, and logo slots that vary in width (breadcrumbs) are hidden
        // at those widths anyway.
        search && 'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)_minmax(0,1fr)]',
        'border-border bg-background border-b px-4',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-6">
        {logo}
        {nav && (
          <nav
            aria-label={navLabel ?? strings.topNav.label}
            className="hidden items-center gap-1 md:flex"
          >
            {nav}
          </nav>
        )}
      </div>
      {search && <div className="mx-auto w-full max-w-md flex-1 lg:flex-none">{search}</div>}
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
});
TopNav.displayName = 'TopNav';

export interface TopNavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  active?: boolean;
  /** Render the child (e.g. router `<Link>`) instead of an `<a>`. */
  asChild?: boolean;
}

export const TopNavLink = forwardRef<HTMLAnchorElement, TopNavLinkProps>(function TopNavLink(
  { href, active, asChild, className, children, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'a';
  return (
    <Comp
      ref={ref}
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-9 items-center rounded-md px-3 text-sm font-medium outline-none',
        'transition-colors duration-[var(--duration-fast)]',
        active ? 'text-foreground' : 'text-foreground-muted hover:text-foreground',
        'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});
TopNavLink.displayName = 'TopNavLink';
