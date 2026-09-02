/**
 * UI blocks — sections composed from library primitives, shipped as source to
 * copy rather than as exports to import.
 *
 * Each block is one file under `./blocks`, and the code shown on the site is
 * that file read back with Vite's `?raw`. There is no second copy to drift:
 * what the preview renders and what the Copy button hands over are the same
 * bytes. The files import from `@gerege-systems/ui` (the site aliases it to the
 * package source), so a paste needs no rewriting.
 */
import type { ComponentType } from 'react';

import { Activity } from './blocks/Activity';
import { CalendarCard } from './blocks/CalendarCard';
import { CommandHint } from './blocks/CommandHint';
import { Controls } from './blocks/Controls';
import { Empty } from './blocks/Empty';
import { Faq } from './blocks/Faq';
import { Forbidden } from './blocks/Forbidden';
import { Invoices } from './blocks/Invoices';
import { Kpis } from './blocks/Kpis';
import { Notifications } from './blocks/Notifications';
import { Onboarding } from './blocks/Onboarding';
import { Pricing } from './blocks/Pricing';
import { ReportIssue } from './blocks/ReportIssue';
import { RevenueChart } from './blocks/RevenueChart';
import { SignIn } from './blocks/SignIn';
import { Team } from './blocks/Team';
import { Upload } from './blocks/Upload';
import { Usage } from './blocks/Usage';
import { CartSummary } from './blocks/CartSummary';
import { CheckoutSteps } from './blocks/CheckoutSteps';
import { DashboardOverview } from './blocks/DashboardOverview';
import { HeroCta } from './blocks/HeroCta';
import { LineTrend } from './blocks/LineTrend';
import { PricingTable } from './blocks/PricingTable';
import { ProductGrid } from './blocks/ProductGrid';
import { SidebarShell } from './blocks/SidebarShell';
import { SignInSplit } from './blocks/SignInSplit';
import { SignUp } from './blocks/SignUp';
import { TopNavShell } from './blocks/TopNavShell';
import { TwoFactor } from './blocks/TwoFactor';

export type BlockCategory = 'App' | 'Auth' | 'Commerce' | 'Marketing';

export interface UiBlock {
  slug: string;
  name: string;
  category: BlockCategory;
  description: string;
  /** File stem under ./blocks — also the key into the raw-source map. */
  file: string;
  Component: ComponentType;
}

export const UI_BLOCKS: UiBlock[] = [
  {
    slug: 'kpi-row',
    name: 'KPI row',
    category: 'App',
    file: 'Kpis',
    Component: Kpis,
    description: 'Four metrics with direction, two-up on narrow screens.',
  },
  {
    slug: 'revenue-chart',
    name: 'Chart 01 — bars',
    category: 'App',
    file: 'RevenueChart',
    Component: RevenueChart,
    description: 'Two-series bar chart with a legend and a table fallback.',
  },
  {
    slug: 'sign-in',
    name: 'Sign in 01',
    category: 'Auth',
    file: 'SignIn',
    Component: SignIn,
    description: 'Email and password, a divider, and two alternative providers.',
  },
  {
    slug: 'invoice-table',
    name: 'Invoice table',
    category: 'App',
    file: 'Invoices',
    Component: Invoices,
    description: 'Status badges and right-aligned amounts in a compact table.',
  },
  {
    slug: 'notification-settings',
    name: 'Notification settings',
    category: 'App',
    file: 'Notifications',
    Component: Notifications,
    description: 'Switch rows with descriptions plus a quota bar.',
  },
  {
    slug: 'calendar',
    name: 'Calendar',
    category: 'App',
    file: 'CalendarCard',
    Component: CalendarCard,
    description: 'A single-date calendar inside a card.',
  },
  {
    slug: 'team-members',
    name: 'Team members',
    category: 'App',
    file: 'Team',
    Component: Team,
    description: 'Avatars with status and a role select per row.',
  },
  {
    slug: 'element-strip',
    name: 'Element strip',
    category: 'App',
    file: 'Controls',
    Component: Controls,
    description: 'Buttons, badges, tabs and an alert — a quick token check.',
  },
  {
    slug: 'plan-picker',
    name: 'Pricing 01 — picker',
    category: 'Marketing',
    file: 'Pricing',
    Component: Pricing,
    description: 'Radio plans with descriptions and one call to action.',
  },
  {
    slug: 'report-issue',
    name: 'Report an issue',
    category: 'App',
    file: 'ReportIssue',
    Component: ReportIssue,
    description: 'Select, subject and details with send and cancel.',
  },
  {
    slug: 'file-upload',
    name: 'File upload',
    category: 'App',
    file: 'Upload',
    Component: Upload,
    description: 'Drop zone plus the progress row for a file already uploading.',
  },
  {
    slug: 'onboarding-steps',
    name: 'Onboarding steps',
    category: 'App',
    file: 'Onboarding',
    Component: Onboarding,
    description: 'A three-step stepper with continue and skip.',
  },
  {
    slug: 'faq',
    name: 'FAQ',
    category: 'Marketing',
    file: 'Faq',
    Component: Faq,
    description: 'Single-open accordion for common questions.',
  },
  {
    slug: 'empty-state',
    name: 'Empty state',
    category: 'App',
    file: 'Empty',
    Component: Empty,
    description: 'Empty list with one action to get out of it.',
  },
  {
    slug: 'forbidden',
    name: 'Permission denied',
    category: 'App',
    file: 'Forbidden',
    Component: Forbidden,
    description: 'The 403 state with a way back.',
  },
  {
    slug: 'search-box',
    name: 'Search box',
    category: 'App',
    file: 'CommandHint',
    Component: CommandHint,
    description: 'Search field with the palette shortcut spelled out.',
  },
  {
    slug: 'activity-feed',
    name: 'Activity feed',
    category: 'App',
    file: 'Activity',
    Component: Activity,
    description: 'Who did what, when — avatars and relative times.',
  },
  {
    slug: 'usage-meters',
    name: 'Usage meters',
    category: 'App',
    file: 'Usage',
    Component: Usage,
    description: 'Quota rows that turn warning past 80%.',
  },
  {
    slug: 'sign-in-split',
    name: 'Sign in 02 — split',
    category: 'Auth',
    file: 'SignInSplit',
    Component: SignInSplit,
    description: 'Form beside a quote panel; the panel drops away under md.',
  },
  {
    slug: 'sign-up',
    name: 'Sign up 01',
    category: 'Auth',
    file: 'SignUp',
    Component: SignUp,
    description: 'Name, work email, password rule and the terms checkbox.',
  },
  {
    slug: 'two-factor',
    name: 'Two-factor 01',
    category: 'Auth',
    file: 'TwoFactor',
    Component: TwoFactor,
    description: 'Six-digit code with a recovery route out.',
  },
  {
    slug: 'sidebar-shell',
    name: 'Sidebar shell 01',
    category: 'App',
    file: 'SidebarShell',
    Component: SidebarShell,
    description: 'Collapsible rail, grouped nav, page header and content area.',
  },
  {
    slug: 'topnav-shell',
    name: 'Top nav shell 01',
    category: 'App',
    file: 'TopNavShell',
    Component: TopNavShell,
    description: 'Horizontal chrome for products with few destinations.',
  },
  {
    slug: 'dashboard-overview',
    name: 'Dashboard 01',
    category: 'App',
    file: 'DashboardOverview',
    Component: DashboardOverview,
    description: 'Three figures, an area chart and the latest invoices in one card.',
  },
  {
    slug: 'line-trend',
    name: 'Chart 02 — lines',
    category: 'App',
    file: 'LineTrend',
    Component: LineTrend,
    description: 'Two series over fourteen days with a table fallback.',
  },
  {
    slug: 'product-grid',
    name: 'Products 01',
    category: 'Commerce',
    file: 'ProductGrid',
    Component: ProductGrid,
    description: 'Image placeholder, price, stock tag and an add action.',
  },
  {
    slug: 'cart',
    name: 'Cart 01',
    category: 'Commerce',
    file: 'CartSummary',
    Component: CartSummary,
    description: 'Editable quantities, remove buttons and a totals block.',
  },
  {
    slug: 'checkout',
    name: 'Checkout 01',
    category: 'Commerce',
    file: 'CheckoutSteps',
    Component: CheckoutSteps,
    description: 'Stepper, address fields and delivery options.',
  },
  {
    slug: 'pricing-table',
    name: 'Pricing 02 — table',
    category: 'Marketing',
    file: 'PricingTable',
    Component: PricingTable,
    description: 'Three tiers with a highlighted plan and feature ticks.',
  },
  {
    slug: 'hero',
    name: 'Hero 01',
    category: 'Marketing',
    file: 'HeroCta',
    Component: HeroCta,
    description: 'One promise, one primary action, one supporting line.',
  },
];

export const BLOCK_CATEGORIES: BlockCategory[] = ['App', 'Auth', 'Commerce', 'Marketing'];

export function getBlock(slug: string): UiBlock | undefined {
  return UI_BLOCKS.find((b) => b.slug === slug);
}

/**
 * Raw sources, loaded on demand — eager `?raw` would put every block's text in
 * the main bundle for a page most visitors never open.
 */
const RAW = import.meta.glob('./blocks/*.tsx', { query: '?raw', import: 'default' }) as Record<
  string,
  () => Promise<string>
>;

export async function loadBlockSource(file: string): Promise<string> {
  const load = RAW[`./blocks/${file}.tsx`];
  if (!load) throw new Error(`No source for block file ${file}`);
  return load();
}
