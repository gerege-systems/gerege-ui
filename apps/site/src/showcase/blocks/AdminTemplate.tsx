import { AdminDashboard, type AdminLayout } from './AdminDashboard';

/**
 * Admin dashboard template — a complete admin console on the library's
 * Sidebar + TopNav shell (collapsible rail, mobile drawer, ⌘K palette, tenant
 * in the top bar). Pages are real and interactive — Projects is the full table
 * pattern (sort, filter chips, debounced search, pagination, bulk actions,
 * confirm-before-delete, empty + loading states); Team, Billing, Settings and
 * Inbox each have their own data and actions. Source: ./AdminDashboard.tsx +
 * ./admin/*. The authentication screens live in the "Authentication" template.
 * `layout` picks the shell: `sidebar`, `sidebar-module` (icon rail + panel), `topnav`
 * (horizontal links) or `topnav-module` (horizontal modules with tiered menus).
 */
export function AdminTemplate({
  layout = 'sidebar',
  initialPage,
}: {
  layout?: AdminLayout;
  initialPage?: string;
}) {
  return <AdminDashboard layout={layout} initialPage={initialPage} />;
}
