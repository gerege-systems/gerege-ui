import type { ComponentType } from 'react';
import {
  BarChart3,
  ChartPie,
  CreditCard,
  File,
  FileText,
  Folder,
  Handshake,
  Home,
  ImageIcon,
  Inbox,
  Kanban,
  Key,
  LayoutGrid,
  Lock,
  MessageSquare,
  Receipt,
  Settings as SettingsIcon,
  Tags,
  User,
  Users,
  Wallet,
} from '@/icons';
import { formatDate, type UiStrings } from '@gerege-systems/ui';
import type { AdminKey } from '../../i18n/admin';

/* =============================================================================
 *  Admin template — demo data. Everything the pages render comes from here so
 *  the UI files stay about structure, not fixtures.
 * ========================================================================== */

/** `label` fields are keys into `i18n/admin.ts`; pages render them with `t(label)`. */
export interface NavItem {
  key: string;
  label: AdminKey;
  icon: ComponentType<{ className?: string }>;
  count?: number;
}
export interface NavSection {
  label: AdminKey;
  items: NavItem[];
}

/** ≤7 top-level items, grouped. `overview` is the home page (no breadcrumb). */
export const NAV: NavSection[] = [
  {
    label: 'section.general',
    items: [
      { key: 'overview', label: 'nav.overview', icon: Home },
      { key: 'analytics', label: 'nav.analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'section.workspace',
    items: [
      { key: 'projects', label: 'nav.projects', icon: Folder },
      { key: 'inbox', label: 'nav.inbox', icon: Inbox, count: 2 },
      { key: 'members', label: 'nav.members', icon: Users },
      { key: 'reports', label: 'nav.reports', icon: FileText },
    ],
  },
  {
    label: 'section.account',
    items: [
      { key: 'settings', label: 'nav.settings', icon: SettingsIcon },
      { key: 'billing', label: 'nav.billing', icon: CreditCard },
    ],
  },
];

/**
 * Top-level modules for the `dual` (icon rail + panel) shell. The rail lists
 * modules; the panel shows the active module's sections. `Workspace` reuses
 * the NAV sections verbatim and `Admin` its Account section; the rest are the
 * back-office areas a product with many surfaces grows into. Page keys are
 * unique across modules — `findModule` relies on it.
 */
export interface NavModule {
  key: string;
  label: AdminKey;
  icon: ComponentType<{ className?: string }>;
  sections: NavSection[];
}

export const MODULES: NavModule[] = [
  { key: 'workspace', label: 'section.workspace', icon: LayoutGrid, sections: NAV.slice(0, 2) },
  {
    key: 'crm',
    label: 'module.crm',
    icon: Users,
    sections: [
      {
        label: 'section.sales',
        items: [
          { key: 'customers', label: 'nav.customers', icon: User },
          { key: 'deals', label: 'nav.deals', icon: Handshake, count: 3 },
          { key: 'pipeline', label: 'nav.pipeline', icon: Kanban },
        ],
      },
      {
        label: 'section.audience',
        items: [{ key: 'segments', label: 'nav.segments', icon: Tags }],
      },
    ],
  },
  {
    key: 'finance',
    label: 'module.finance',
    icon: Wallet,
    sections: [
      {
        label: 'section.money',
        items: [
          { key: 'invoices', label: 'nav.invoices', icon: Receipt },
          { key: 'payments', label: 'nav.payments', icon: CreditCard },
        ],
      },
      {
        label: 'section.insights',
        items: [{ key: 'fin-reports', label: 'nav.fin-reports', icon: ChartPie }],
      },
    ],
  },
  {
    key: 'content',
    label: 'module.content',
    icon: FileText,
    sections: [
      {
        label: 'section.library',
        items: [
          { key: 'pages', label: 'nav.pages', icon: File },
          { key: 'media', label: 'nav.media', icon: ImageIcon },
        ],
      },
      {
        label: 'section.community',
        items: [{ key: 'comments', label: 'nav.comments', icon: MessageSquare, count: 5 }],
      },
    ],
  },
  {
    key: 'admin',
    label: 'module.admin',
    icon: Lock,
    sections: [
      NAV[2],
      {
        label: 'section.security',
        items: [
          { key: 'audit', label: 'nav.audit', icon: FileText },
          { key: 'roles', label: 'nav.roles', icon: Users },
          { key: 'apikeys', label: 'nav.apikeys', icon: Key },
        ],
      },
    ],
  },
];

/**
 * Pages that exist only as destinations (no full demo UI yet). Rendered by
 * `StubPage` with a breadcrumb and a descriptive empty state; copy lives in
 * the dictionary under `stub.<key>.*` and the title is the nav label.
 * (`apikeys` is deliberately absent — it renders the permission-denied state.)
 */
export const STUB_PAGES: Record<string, ComponentType<{ className?: string }>> = {
  customers: User,
  deals: Handshake,
  pipeline: Kanban,
  segments: Tags,
  invoices: Receipt,
  payments: CreditCard,
  'fin-reports': ChartPie,
  pages: File,
  media: ImageIcon,
  comments: MessageSquare,
  audit: FileText,
  roles: Lock,
};

/** Every section across modules — the `dual` shell's palette and breadcrumbs read this. */
export const ALL_SECTIONS: NavSection[] = MODULES.flatMap((m) => m.sections);

/** Module that owns a page (unknown keys → the first module). */
export function findModule(pageKey: string): NavModule {
  return (
    MODULES.find((m) => m.sections.some((s) => s.items.some((i) => i.key === pageKey))) ??
    MODULES[0]
  );
}

export function findNav(key: string): { section: NavSection; item: NavItem } | undefined {
  for (const section of ALL_SECTIONS) {
    const item = section.items.find((i) => i.key === key);
    if (item) return { section, item };
  }
  return undefined;
}

export const USER = { name: 'Alex Morgan', email: 'alex@example.com', initials: 'AM' };

export interface Workspace {
  id: string;
  name: string;
  plan: AdminKey;
  initial: string;
}
export const WORKSPACES: Workspace[] = [
  { id: 'acme', name: 'Acme Inc', plan: 'plan.team', initial: 'A' },
  { id: 'northwind', name: 'Northwind', plan: 'plan.enterprise', initial: 'N' },
  { id: 'globex', name: 'Globex', plan: 'plan.free', initial: 'G' },
];

/* ---------------------------------------------------------------------------
 *  Charts
 * ------------------------------------------------------------------------ */

/** Day index → label is resolved per locale with `t('chart.day', { n })`. */
export const SERIES_A = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  y: Math.round(2200 + i * 22 + Math.sin(i / 3.5) * 180 + Math.cos(i * 3.1) * 60),
}));
export const SERIES_B = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  y: Math.round(1400 + i * 14 + Math.sin(i / 2.5) * 220 + Math.cos(i * 5) * 70),
}));
export const CHANNELS: { label: AdminKey; y: number }[] = [
  { label: 'channel.direct', y: 4200 },
  { label: 'channel.search', y: 3100 },
  { label: 'channel.social', y: 2400 },
  { label: 'channel.email', y: 1800 },
  { label: 'channel.referral', y: 1200 },
];

/** Demo clock: timestamps are offsets from page load so relative labels stay fresh. */
const NOW = Date.now();
const ago = (minutes: number) => new Date(NOW - minutes * 60_000).toISOString();

export const ACTIVITY: {
  id: string;
  who: string;
  initials: string;
  action: AdminKey;
  target: string;
  at: string;
}[] = [
  {
    id: '1',
    who: 'Anu B.',
    initials: 'AB',
    action: 'activity.merged',
    target: 'feat/segments',
    at: ago(12),
  },
  {
    id: '2',
    who: 'Bat E.',
    initials: 'BE',
    action: 'activity.opened',
    target: 'fix/login-flow',
    at: ago(34),
  },
  {
    id: '3',
    who: 'Tuya G.',
    initials: 'TG',
    action: 'activity.commented',
    target: 'Q2 OKRs',
    at: ago(60),
  },
  {
    id: '4',
    who: 'Khulan O.',
    initials: 'KO',
    action: 'activity.archived',
    target: 'old-billing-spike',
    at: ago(180),
  },
];

/* ---------------------------------------------------------------------------
 *  Projects
 * ------------------------------------------------------------------------ */

export type ProjectStatus = 'Active' | 'In review' | 'Blocked' | 'Archived';

export interface Project {
  id: number;
  name: string;
  status: ProjectStatus;
  owner: string;
  /** ISO date — sortable; rendered relative with the absolute in `title`. */
  updatedAt: string;
}

export const STATUSES: ProjectStatus[] = ['Active', 'In review', 'Blocked', 'Archived'];

/** Status → dictionary key (values stay English: they're URL params and sort keys). */
export const STATUS_KEY: Record<ProjectStatus, AdminKey> = {
  Active: 'status.active',
  'In review': 'status.inReview',
  Blocked: 'status.blocked',
  Archived: 'status.archived',
};

export const STATUS_TONE: Record<ProjectStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  Active: 'success',
  'In review': 'warning',
  Blocked: 'danger',
  Archived: 'neutral',
};

const OWNERS = ['Anu B.', 'Bat E.', 'Tuya G.', 'Khulan O.', 'Sara K.', 'Mark R.'];
const NAMES = [
  'Aurora web',
  'Billing v2',
  'Mobile beta',
  'Data pipeline',
  'Design system',
  'Legacy import',
  'Search revamp',
  'Onboarding flow',
  'Audit logging',
  'Marketing site',
  'API gateway',
  'Usage metering',
  'SSO rollout',
  'Webhooks',
  'Notifications v3',
  'Exports',
  'Permissions matrix',
  'Status page',
  'Rate limiting',
  'Sandbox env',
  'CLI',
  'Docs portal',
  'Partner API',
  'Invoice PDFs',
  'Uptime monitor',
  'Feature flags',
  'Session replay',
  'Bulk import',
  'Team spaces',
  'Dark mode',
  'Mobile push',
  'Workflow builder',
];

/** 32 rows — enough to exercise page size 25 and a second page. */
export const SEED_PROJECTS: Project[] = NAMES.map((name, i) => {
  const d = new Date(Date.UTC(2026, 7, 20, 9, 0, 0));
  d.setUTCHours(d.getUTCHours() - i * 7 - (i % 3) * 2);
  return {
    id: i + 1,
    name,
    status: STATUSES[(i * 7) % STATUSES.length],
    owner: OWNERS[(i * 5) % OWNERS.length],
    updatedAt: d.toISOString(),
  };
});

/**
 * Relative label for a timestamp (library `strings.relativeTime`, so it follows
 * the provider locale) with the absolute `yyyy-MM-dd HH:mm` for `title`.
 * Older than a week → the date itself, per 16-ux-writing-mn.
 */
export function formatRelative(
  iso: string,
  rt: UiStrings['relativeTime'],
  now = Date.now(),
): { label: string; title: string } {
  const diffMin = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  const title = formatDate(iso);
  const fill = (tpl: string, n: number) => tpl.replace('{n}', String(n));
  if (diffMin < 1) return { label: rt.justNow, title };
  if (diffMin < 60) return { label: fill(rt.minutesAgo, diffMin), title };
  const h = Math.round(diffMin / 60);
  if (h < 24) return { label: fill(rt.hoursAgo, h), title };
  const days = Math.round(h / 24);
  if (days < 7) return { label: fill(rt.daysAgo, days), title };
  return { label: formatDate(iso, { pattern: 'yyyy-MM-dd' }), title };
}

/* ---------------------------------------------------------------------------
 *  Inbox · Team · Billing · Notifications
 * ------------------------------------------------------------------------ */

export interface Message {
  id: number;
  from: string;
  initials: string;
  subject: AdminKey;
  preview: AdminKey;
  at: string;
  unread: boolean;
}
export const SEED_MESSAGES: Message[] = [
  {
    id: 1,
    from: 'Anu Bold',
    initials: 'AB',
    subject: 'msg.1.subject',
    preview: 'msg.1.preview',
    at: ago(12),
    unread: true,
  },
  {
    id: 2,
    from: 'Bat Erdene',
    initials: 'BE',
    subject: 'msg.2.subject',
    preview: 'msg.2.preview',
    at: ago(60),
    unread: true,
  },
  {
    id: 3,
    from: 'Tuya Ganbat',
    initials: 'TG',
    subject: 'msg.3.subject',
    preview: 'msg.3.preview',
    at: ago(180),
    unread: false,
  },
  {
    id: 4,
    from: 'Khulan O.',
    initials: 'KO',
    subject: 'msg.4.subject',
    preview: 'msg.4.preview',
    at: ago(26 * 60),
    unread: false,
  },
  {
    id: 5,
    from: 'Sara Khan',
    initials: 'SK',
    subject: 'msg.5.subject',
    preview: 'msg.5.preview',
    at: ago(2 * 24 * 60),
    unread: false,
  },
];

export interface Member {
  id: number;
  name: string;
  email: string;
  initials: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Billing';
  status: 'Active' | 'Invited';
}
export const ROLES: Member['role'][] = ['Owner', 'Admin', 'Member', 'Billing'];
export const ROLE_KEY: Record<Member['role'], AdminKey> = {
  Owner: 'role.owner',
  Admin: 'role.admin',
  Member: 'role.member',
  Billing: 'role.billing',
};
export const MEMBER_STATUS_KEY: Record<Member['status'], AdminKey> = {
  Active: 'member.active',
  Invited: 'member.invited',
};
export const SEED_MEMBERS: Member[] = [
  {
    id: 1,
    name: 'Anu Bold',
    email: 'anu@example.com',
    initials: 'AB',
    role: 'Owner',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Bat Erdene',
    email: 'bat@example.com',
    initials: 'BE',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Tuya Ganbat',
    email: 'tuya@example.com',
    initials: 'TG',
    role: 'Member',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Khulan O.',
    email: 'khulan@example.com',
    initials: 'KO',
    role: 'Member',
    status: 'Invited',
  },
  {
    id: 5,
    name: 'Sara Khan',
    email: 'sara@example.com',
    initials: 'SK',
    role: 'Billing',
    status: 'Active',
  },
];

/** Amounts in USD; the MN preview renders them in ₮ (see `useMoney` in pages.tsx). */
export const INVOICES: { id: string; date: string; amount: number; status: AdminKey }[] = [
  { id: 'INV-2041', date: '2026-06-01', amount: 240, status: 'invoice.paid' },
  { id: 'INV-2032', date: '2026-05-01', amount: 240, status: 'invoice.paid' },
  { id: 'INV-2018', date: '2026-04-01', amount: 240, status: 'invoice.paid' },
];

export const NOTIFICATIONS: {
  id: number;
  who: string;
  initials: string;
  text: AdminKey;
  target: string;
  at: string;
  unread: boolean;
}[] = [
  {
    id: 1,
    who: 'Anu B.',
    initials: 'AB',
    text: 'notif.mentioned',
    target: 'Q2 OKRs',
    at: ago(2),
    unread: true,
  },
  {
    id: 2,
    who: 'Bat E.',
    initials: 'BE',
    text: 'notif.requestedReview',
    target: 'fix/login-flow',
    at: ago(18),
    unread: true,
  },
  {
    id: 3,
    who: 'Tuya G.',
    initials: 'TG',
    text: 'notif.commented',
    target: 'feat/segments',
    at: ago(60),
    unread: false,
  },
];
