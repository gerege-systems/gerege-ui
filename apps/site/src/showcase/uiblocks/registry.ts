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
import { GoalRing } from './blocks/GoalRing';
import { TransactionList } from './blocks/TransactionList';
import { ReceivingMethod } from './blocks/ReceivingMethod';
import { ConnectBank } from './blocks/ConnectBank';
import { NavMenus } from './blocks/NavMenus';
import { PreferencesPanel } from './blocks/PreferencesPanel';
import { DividendIncome } from './blocks/DividendIncome';
import { TransferConfirm } from './blocks/TransferConfirm';
import { PaymentsMenu } from './blocks/PaymentsMenu';
import { SyncingState } from './blocks/SyncingState';
import { LoadingCard } from './blocks/LoadingCard';
import { NotificationChecklist } from './blocks/NotificationChecklist';
import { InvoiceDetail } from './blocks/InvoiceDetail';
import { ShippingAddress } from './blocks/ShippingAddress';
import { ProfileSettings } from './blocks/ProfileSettings';
import { BookAppointment } from './blocks/BookAppointment';
import { SleepReport } from './blocks/SleepReport';
import { BrowserShare } from './blocks/BrowserShare';
import { TrafficChannels } from './blocks/TrafficChannels';
import { ContributionHeatmap } from './blocks/ContributionHeatmap';
import { DevicePairing } from './blocks/DevicePairing';
import { BalanceCard } from './blocks/BalanceCard';
import { PayoutThreshold } from './blocks/PayoutThreshold';
import { SmartDevice } from './blocks/SmartDevice';
import { SavingsTargets } from './blocks/SavingsTargets';
import { TransferFunds } from './blocks/TransferFunds';
import { RecentTransactions } from './blocks/RecentTransactions';
import { AccountAccess } from './blocks/AccountAccess';
import { PaymentCard } from './blocks/PaymentCard';
import { PowerUsage } from './blocks/PowerUsage';
import { UpcomingPayments } from './blocks/UpcomingPayments';
import { SocialLinks } from './blocks/SocialLinks';
import { ExplainerCard } from './blocks/ExplainerCard';

export type BlockCategory = 'App' | 'Auth' | 'Commerce' | 'Marketing';

export interface UiBlock {
  slug: string;
  name: string;
  category: BlockCategory;
  description: string;
  /** File stem under ./blocks — also the key into the raw-source map. */
  file: string;
  /**
   * Needs a full row. App shells and comparison tables are laid out for a page,
   * not for a ~400px masonry column, and Tailwind's `md:` responds to the
   * viewport rather than the column they land in.
   */
  wide?: boolean;
  /**
   * Set false to keep a block off the theme wall. A page shell, a bare calendar
   * or a stepper says nothing about a theme that the blocks around them do not
   * already say, and each eats a row.
   */
  wall?: false;
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
    wall: false,
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
    wall: false,
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
    wall: false,
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
    wall: false,
    wide: true,
    name: 'Sidebar shell 01',
    category: 'App',
    file: 'SidebarShell',
    Component: SidebarShell,
    description: 'Collapsible rail, grouped nav, page header and content area.',
  },
  {
    slug: 'topnav-shell',
    wall: false,
    wide: true,
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
    description: 'One series over fourteen days, with the figures it implies underneath.',
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
    wall: false,
    wide: true,
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
  {
    slug: 'activity-heatmap',
    name: 'Activity heatmap 01',
    category: 'App',
    file: 'ContributionHeatmap',
    Component: ContributionHeatmap,
    description: 'Six months of activity as a density grid, with a legend.',
  },
  {
    slug: 'device-pairing',
    name: 'Device pairing 01',
    category: 'App',
    file: 'DevicePairing',
    Component: DevicePairing,
    description: 'Scan-to-link card with a fallback code.',
  },
  {
    slug: 'balance',
    name: 'Balance 01',
    category: 'Commerce',
    file: 'BalanceCard',
    Component: BalanceCard,
    description: 'A headline figure, what is pending, and the two actions on it.',
  },
  {
    slug: 'payout-threshold',
    name: 'Payout threshold 01',
    category: 'App',
    file: 'PayoutThreshold',
    Component: PayoutThreshold,
    description: 'Slider and exact-amount field kept in step.',
  },
  {
    slug: 'device-control',
    name: 'Device control 01',
    category: 'App',
    file: 'SmartDevice',
    Component: SmartDevice,
    description: 'Two sliders and a schedule switch for one device.',
  },
  {
    slug: 'goal-progress',
    name: 'Goal progress 01',
    category: 'App',
    file: 'SavingsTargets',
    Component: SavingsTargets,
    description: 'Milestones with progress that turns success past 75%.',
  },
  {
    slug: 'transfer',
    name: 'Transfer 01',
    category: 'Commerce',
    file: 'TransferFunds',
    Component: TransferFunds,
    description: 'From, to, amount and the fee before you commit.',
  },
  {
    slug: 'transactions',
    name: 'Transactions 01',
    category: 'Commerce',
    file: 'RecentTransactions',
    Component: RecentTransactions,
    description: 'Direction, counterparty and signed amounts.',
  },
  {
    slug: 'account-access',
    name: 'Account access 01',
    category: 'Auth',
    file: 'AccountAccess',
    Component: AccountAccess,
    description: 'Password change with a session-revoke switch.',
  },
  {
    slug: 'payment-card',
    name: 'Payment card 01',
    category: 'Commerce',
    file: 'PaymentCard',
    Component: PaymentCard,
    description: 'Balance, credit used, minimum payment, due date.',
  },
  {
    slug: 'usage-chart',
    name: 'Usage chart 01',
    category: 'App',
    file: 'PowerUsage',
    Component: PowerUsage,
    description: 'Area chart with the day total beside the title.',
  },
  {
    slug: 'schedule',
    name: 'Schedule 01',
    category: 'App',
    file: 'UpcomingPayments',
    Component: UpcomingPayments,
    description: 'Calendar over a dated list of what is due.',
  },
  {
    slug: 'social-links',
    name: 'Social links 01',
    category: 'App',
    file: 'SocialLinks',
    Component: SocialLinks,
    description: 'Prefixed inputs, one per network.',
  },
  {
    slug: 'explainer',
    name: 'Explainer 01',
    category: 'Marketing',
    file: 'ExplainerCard',
    Component: ExplainerCard,
    description: 'Three ticked points and two ways on.',
  },
  {
    slug: 'goal-ring',
    name: 'Goal ring 01',
    category: 'App',
    file: 'GoalRing',
    Component: GoalRing,
    description: 'A single-arc ring around the figure, with the facts behind it listed under.',
  },
  {
    slug: 'invoice',
    name: 'Invoice 01',
    category: 'Commerce',
    file: 'InvoiceDetail',
    Component: InvoiceDetail,
    description: 'Line items, subtotal, VAT and the two actions on an unpaid invoice.',
  },
  {
    slug: 'shipping-address',
    name: 'Shipping address 01',
    category: 'Commerce',
    file: 'ShippingAddress',
    Component: ShippingAddress,
    description: 'Two-column address form with a save-as-default checkbox.',
  },
  {
    slug: 'profile',
    name: 'Profile 01',
    category: 'App',
    file: 'ProfileSettings',
    Component: ProfileSettings,
    description: 'Name, public email and bio, each with the note that belongs to it.',
  },
  {
    slug: 'book-appointment',
    name: 'Appointment 01',
    category: 'App',
    file: 'BookAppointment',
    Component: BookAppointment,
    description: 'Time slots as a radio group, with the note a first visit needs.',
  },
  {
    slug: 'sleep-report',
    name: 'Sleep report 01',
    category: 'App',
    file: 'SleepReport',
    Component: SleepReport,
    description: 'Stacked phase bars over a four-figure summary.',
  },
  {
    slug: 'share-donut',
    name: 'Share donut 01',
    category: 'App',
    file: 'BrowserShare',
    Component: BrowserShare,
    description: 'Four-segment donut with the total in the middle and a legend.',
  },
  {
    slug: 'traffic-channels',
    name: 'Traffic channels 01',
    category: 'App',
    file: 'TrafficChannels',
    Component: TrafficChannels,
    description: 'Two series by month, with the figures that matter under them.',
  },
  {
    slug: 'transaction-list',
    wide: true,
    name: 'Transactions 02 — list',
    category: 'Commerce',
    file: 'TransactionList',
    Component: TransactionList,
    description: 'Merchant, category, date and signed amount, with a row menu.',
  },
  {
    slug: 'receiving-method',
    name: 'Receiving method 01',
    category: 'Commerce',
    file: 'ReceivingMethod',
    Component: ReceivingMethod,
    description:
      'Holder name, two payout methods, and the disabled state a settings form opens in.',
  },
  {
    slug: 'connect-bank',
    name: 'Connect bank 01',
    category: 'Commerce',
    file: 'ConnectBank',
    Component: ConnectBank,
    description: 'The empty state before a payout method exists.',
  },
  {
    slug: 'nav-menu',
    name: 'Nav menu 01',
    category: 'App',
    file: 'NavMenus',
    Component: NavMenus,
    description: 'Grouped navigation with the current page marked.',
  },
  {
    slug: 'preferences',
    name: 'Preferences 01',
    category: 'App',
    file: 'PreferencesPanel',
    Component: PreferencesPanel,
    description: 'A select over two switch rows, with reset and save.',
  },
  {
    slug: 'dividend-income',
    name: 'Dividend income 01',
    category: 'Commerce',
    file: 'DividendIncome',
    Component: DividendIncome,
    description: 'Holdings with a four-quarter sparkline and the payout beside it.',
  },
  {
    slug: 'transfer-confirm',
    name: 'Transfer 02 — confirm',
    category: 'Commerce',
    file: 'TransferConfirm',
    Component: TransferConfirm,
    description: 'Amount, accounts with balances, and the totals before you commit.',
  },
  {
    slug: 'payments-menu',
    name: 'Settings menu 01',
    category: 'App',
    file: 'PaymentsMenu',
    Component: PaymentsMenu,
    description: 'Breadcrumb over navigable rows, each with what it does.',
  },
  {
    slug: 'syncing',
    name: 'Syncing 01',
    category: 'App',
    file: 'SyncingState',
    Component: SyncingState,
    description: 'A working state that says what is happening and offers a way out.',
  },
  {
    slug: 'loading-card',
    name: 'Loading card 01',
    category: 'App',
    file: 'LoadingCard',
    Component: LoadingCard,
    description: 'The shape a card holds while its data is in flight.',
  },
  {
    slug: 'notification-checklist',
    name: 'Notifications 02 — checklist',
    category: 'App',
    file: 'NotificationChecklist',
    Component: NotificationChecklist,
    description: 'Select-all in its indeterminate state over four choices.',
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
