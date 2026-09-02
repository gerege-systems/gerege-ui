'use client';

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { ChevronDown, ChevronsLeft, ChevronsRight } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { Tooltip } from './Tooltip';

interface SidebarContextValue {
  collapsed: boolean;
}
const SidebarContext = createContext<SidebarContextValue>({ collapsed: false });

/** Read the parent Sidebar's collapsed state. Useful for brand/footer slots
 *  that need to swap between full and compact rendering. */
export function useSidebar(): SidebarContextValue {
  return useContext(SidebarContext);
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Default state on first mount. Use `defaultCollapsed` for uncontrolled. */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Called when the user toggles via the rail or keyboard. */
  onCollapsedChange?: (next: boolean) => void;
  /** Header slot pinned to the top (brand, workspace switcher, etc.). */
  header?: ReactNode;
  /** Footer slot pinned to the bottom (user card, version, etc.). */
  footer?: ReactNode;
}

/**
 * App-level navigation rail. Holds `SidebarSection` → `SidebarItem` lists,
 * and optionally a `footer`. Supports collapse to icon-only on desktop.
 * Below `md` the rail is hidden — pair it with a Sheet / Drawer for mobile.
 *
 * @example
 *   <Sidebar footer={<UserCard />}>
 *     <SidebarSection label="Workspace">
 *       <SidebarItem icon={<Home />} active>Home</SidebarItem>
 *       <SidebarItem icon={<Folder />}>Projects</SidebarItem>
 *     </SidebarSection>
 *     <SidebarSection label="Account">
 *       <SidebarItem icon={<Settings />}>Settings</SidebarItem>
 *     </SidebarSection>
 *   </Sidebar>
 *
 * @do Use 1–3 sections. More than that signals the IA needs restructuring.
 * @dont Hide critical navigation under the collapsed state — keep icons
 *       always visible with tooltips.
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    defaultCollapsed = false,
    collapsed: controlled,
    onCollapsedChange,
    header,
    footer,
    className,
    children,
    'aria-label': ariaLabel,
    ...props
  },
  ref,
) {
  const strings = useStrings();
  const [internal, setInternal] = useState(defaultCollapsed);
  const collapsed = controlled ?? internal;
  const setCollapsed = (next: boolean) => {
    if (controlled === undefined) setInternal(next);
    onCollapsedChange?.(next);
  };

  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <nav
        data-slot="sidebar"
        ref={ref}
        aria-label={ariaLabel ?? strings.sidebar.label}
        className={cn(
          'border-border bg-background-subtle sticky top-0 hidden h-dvh shrink-0 flex-col gap-2 border-r md:flex',
          // Deliberate motion exception: the rail's own width transitions (layout).
          // Only the rail and the main column it flanks move; no content inside reflows.
          'transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out)] motion-reduce:transition-none',
          collapsed ? 'w-14' : 'w-60',
          className,
        )}
        {...props}
      >
        {header && (
          <div
            className={cn(
              'border-border flex h-14 shrink-0 items-center overflow-hidden border-b',
              collapsed ? 'justify-center px-2' : 'px-3',
            )}
          >
            {header}
          </div>
        )}
        <div className="flex-1 overflow-y-auto py-3">{children}</div>
        {footer && <div className="border-border border-t p-2">{footer}</div>}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? strings.sidebar.expand : strings.sidebar.collapse}
          aria-expanded={!collapsed}
          className={cn(
            'text-foreground-subtle mx-2 mb-2 flex h-8 items-center gap-2 rounded-md px-2',
            'hover:bg-background-muted hover:text-foreground outline-none',
            'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
            'transition-colors duration-[var(--duration-fast)]',
          )}
        >
          {collapsed ? (
            <ChevronsRight className="size-4" aria-hidden />
          ) : (
            <ChevronsLeft className="size-4" aria-hidden />
          )}
          {!collapsed && (
            <span className="text-xs font-medium">{strings.sidebar.collapseShort}</span>
          )}
        </button>
      </nav>
    </SidebarContext.Provider>
  );
});
Sidebar.displayName = 'Sidebar';

export interface SidebarSectionProps extends HTMLAttributes<HTMLDivElement> {
  /** Visible section header. Hidden when collapsed. */
  label?: ReactNode;
}

export function SidebarSection({ label, className, children, ...props }: SidebarSectionProps) {
  const { collapsed } = useContext(SidebarContext);
  const labelId = useId();
  return (
    <div className={cn('mb-3', className)} {...props}>
      {label && (
        // Kept in the DOM (sr-only) while collapsed so the list stays labelled.
        <div
          id={labelId}
          className={cn(
            'text-foreground-subtle px-4 pt-2 pb-1 text-xs font-medium',
            collapsed && 'sr-only',
          )}
        >
          {label}
        </div>
      )}
      <ul aria-labelledby={label ? labelId : undefined} className="flex flex-col gap-px">
        {children}
      </ul>
    </div>
  );
}
SidebarSection.displayName = 'SidebarSection';

interface SidebarItemBaseProps {
  /** Lucide icon shown to the left. */
  icon?: ReactNode;
  /** Mark as the current page. */
  active?: boolean;
  /** Trailing badge / counter slot. */
  trailing?: ReactNode;
  /** Render a sub-item indented under a parent. */
  sub?: boolean;
  /**
   * Tooltip text shown while the sidebar is collapsed. Defaults to `children`
   * when that is a plain string.
   */
  tooltip?: ReactNode;
  /**
   * Render the child element (router `<Link>`) instead of `<a>`/`<button>`.
   * The child receives className, aria-current and the item content.
   */
  asChild?: boolean;
}

type SidebarItemAnchorProps = SidebarItemBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    /** Renders an `<a>`. Omit to render a `<button>`. */
    href: string;
  };

type SidebarItemButtonProps = SidebarItemBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

/** Discriminated on `href`: with it the item is an anchor, without it a button. */
export type SidebarItemProps = SidebarItemAnchorProps | SidebarItemButtonProps;

export const SidebarItem = forwardRef<HTMLElement, SidebarItemProps>(
  function SidebarItem(props, ref) {
    const { icon, active, trailing, sub, tooltip, asChild, className, children, ...rest } = props;
    const { collapsed } = useContext(SidebarContext);

    const classes = cn(
      'flex h-8 w-full items-center gap-2 rounded-md px-2 text-sm outline-none',
      'transition-colors duration-[var(--duration-fast)]',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      active
        ? 'bg-background-muted text-foreground font-medium'
        : 'text-foreground-muted hover:bg-background-muted hover:text-foreground',
      sub && !collapsed && 'ml-6',
      collapsed && 'justify-center',
      className,
    );

    const labelTitle = typeof children === 'string' ? children : undefined;
    const tip = tooltip ?? labelTitle;
    // Collapsed: keep an sr-only label so the control always has a name —
    // the Tooltip only wires aria-describedby while it is open.
    const showTooltip = collapsed && !!tip;

    const content = (
      <>
        {icon && <span className="flex shrink-0 items-center [&_svg]:size-4">{icon}</span>}
        {collapsed ? (
          <span className="sr-only">{children}</span>
        ) : (
          <span className="flex-1 truncate text-left" title={labelTitle}>
            {children}
          </span>
        )}
        {!collapsed && trailing && <span className="ml-auto">{trailing}</span>}
      </>
    );

    let element: ReactNode;
    if (asChild) {
      const { href: _href, type: _type, ...slotProps } = rest as Record<string, unknown>;
      element = (
        <Slot
          ref={ref}
          aria-current={active ? 'page' : undefined}
          className={classes}
          {...(slotProps as HTMLAttributes<HTMLElement>)}
        >
          {children && typeof children === 'object' && 'props' in (children as object)
            ? children
            : null}
        </Slot>
      );
    } else if (rest.href !== undefined) {
      const { href, ...anchorProps } = rest as Omit<
        SidebarItemAnchorProps,
        keyof SidebarItemBaseProps
      >;
      element = (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          aria-current={active ? 'page' : undefined}
          className={classes}
          {...anchorProps}
        >
          {content}
        </a>
      );
    } else {
      const {
        href: _href,
        type,
        ...buttonProps
      } = rest as Omit<SidebarItemButtonProps, keyof SidebarItemBaseProps>;
      element = (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          type={type ?? 'button'}
          aria-current={active ? 'page' : undefined}
          className={classes}
          {...buttonProps}
        >
          {content}
        </button>
      );
    }

    return (
      <li className="px-2">
        {showTooltip ? (
          <Tooltip label={tip} side="right">
            {element}
          </Tooltip>
        ) : (
          element
        )}
      </li>
    );
  },
);
SidebarItem.displayName = 'SidebarItem';

/** Lightweight collapsible sub-section inside the sidebar. */
export interface SidebarGroupProps extends Omit<HTMLAttributes<HTMLLIElement>, 'children'> {
  icon?: ReactNode;
  label: ReactNode;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export const SidebarGroup = forwardRef<HTMLLIElement, SidebarGroupProps>(function SidebarGroup(
  {
    icon,
    label,
    defaultOpen = true,
    open: controlled,
    onOpenChange,
    className,
    children,
    ...props
  },
  ref,
) {
  const { collapsed } = useContext(SidebarContext);
  const [internal, setInternal] = useState(defaultOpen);
  const open = controlled ?? internal;
  const listId = useId();
  const toggle = () => {
    const next = !open;
    if (controlled === undefined) setInternal(next);
    onOpenChange?.(next);
  };
  if (collapsed) return <>{children}</>;
  return (
    <li ref={ref} className={className} {...props}>
      <button
        type="button"
        onClick={toggle}
        aria-controls={open ? listId : undefined}
        aria-expanded={open}
        className={cn(
          'text-foreground-muted mx-2 flex h-8 w-[calc(100%-1rem)] items-center gap-2 rounded-md px-2 text-sm outline-none',
          'transition-colors duration-[var(--duration-fast)]',
          'hover:bg-background-muted hover:text-foreground',
          'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2',
        )}
      >
        {icon && <span className="flex shrink-0 items-center [&_svg]:size-4">{icon}</span>}
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown
          className={cn('size-3.5 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      {open && (
        <ul id={listId} className="flex flex-col gap-px">
          {children}
        </ul>
      )}
    </li>
  );
});
SidebarGroup.displayName = 'SidebarGroup';
