import { forwardRef, useImperativeHandle, useState } from 'react';
import { FileText, Lock, Mail, Plus, Receipt, Trash2, Users } from '@/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  ConfirmationDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  ErrorState,
  IconButton,
  Input,
  RadioGroup,
  RadioItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
  formatDate,
  formatMNT,
  formatNumber,
  useStrings,
  useToast,
} from '@gerege-systems/ui';
import {
  INVOICES,
  MEMBER_STATUS_KEY,
  ROLES,
  ROLE_KEY,
  SEED_MEMBERS,
  SEED_MESSAGES,
  STUB_PAGES,
  formatRelative,
  type Member,
  type Message,
} from './data';
import { PageHeader, StatusIcon, useDemo } from './shell';
import { useTheme, type Theme } from '../../theme/theme-context';
import { useUnsavedGuard } from './unsaved';
import { adminDict, type AdminKey } from '../../i18n/admin';
import { useLocale, useT } from '../../i18n/locale';

/* =============================================================================
 *  Admin template — Inbox, Team, Settings, Billing
 * ========================================================================== */

export function InboxPage({ onNavigate }: { onNavigate: (key: string) => void }) {
  const { push } = useToast();
  const t = useT(adminDict);
  const { relativeTime } = useStrings();
  const [items, setItems] = useState<Message[]>(SEED_MESSAGES);
  const unread = items.filter((m) => m.unread).length;
  // Recoverable delete: no confirm, a 5s Undo in the toast restores the row
  // at its original position (CANON · Undo window).
  const remove = (m: Message) => {
    const snapshot = items;
    setItems((xs) => xs.filter((x) => x.id !== m.id));
    push({
      title: t('toast.conversationDeleted'),
      description: t(m.subject),
      duration: 5000,
      action: {
        label: t('common.undo'),
        altText: t('undo.deleteConversation', { subject: t(m.subject) }),
        onClick: () => setItems(snapshot),
      },
    });
  };
  return (
    <div>
      <PageHeader
        page="inbox"
        title={t('inbox.title')}
        subtitle={t('inbox.subtitle', { n: items.length, unread })}
        actions={
          <Button
            variant="outline"
            size="sm"
            disabled={unread === 0}
            onClick={() => setItems((xs) => xs.map((m) => ({ ...m, unread: false })))}
          >
            {t('inbox.markAllRead')}
          </Button>
        }
        onNavigate={onNavigate}
      />
      {items.length === 0 ? (
        <EmptyState icon={<Mail />} title={t('inbox.zero')} description={t('inbox.zeroDesc')} />
      ) : (
        <Card padding="none">
          <ul className="divide-border divide-y">
            {items.map((m) => (
              <li
                key={m.id}
                className={cn(
                  'hover:bg-background-muted flex items-start gap-3 px-4 py-3 md:px-6',
                  m.unread && 'bg-accent-soft/40',
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    setItems((xs) => xs.map((x) => (x.id === m.id ? { ...x, unread: false } : x)))
                  }
                  className="focus-visible:ring-ring flex min-w-0 flex-1 items-start gap-3 rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <Avatar size="sm" fallback={m.initials} alt="" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-foreground truncate text-sm font-medium">{m.from}</span>
                      {m.unread && (
                        <span
                          className="bg-accent size-1.5 shrink-0 rounded-full"
                          aria-label={t('notif.unread')}
                        />
                      )}
                      <span
                        className="text-foreground-subtle ml-auto shrink-0 text-xs"
                        title={formatRelative(m.at, relativeTime).title}
                      >
                        {formatRelative(m.at, relativeTime).label}
                      </span>
                    </span>
                    <span className="text-foreground block truncate text-sm">{t(m.subject)}</span>
                    <span className="text-foreground-muted block truncate text-xs">
                      {t(m.preview)}
                    </span>
                  </span>
                </button>
                <IconButton
                  aria-label={t('inbox.deleteFrom', { name: m.from })}
                  icon={<Trash2 />}
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(m)}
                />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Member['status'] }) {
  const t = useT(adminDict);
  const tone = status === 'Active' ? 'success' : 'warning';
  return (
    <Badge tone={tone} variant="outline">
      <StatusIcon tone={tone} />
      {t(MEMBER_STATUS_KEY[status])}
    </Badge>
  );
}

function RoleSelect({
  member: m,
  onChange,
  className,
}: {
  member: Member;
  onChange: (id: number, role: Member['role']) => void;
  className?: string;
}) {
  const t = useT(adminDict);
  return (
    <Select value={m.role} onValueChange={(v) => onChange(m.id, v as Member['role'])}>
      <SelectTrigger
        size="sm"
        aria-label={t('members.roleFor', { name: m.name })}
        className={className}
        disabled={m.role === 'Owner'}
      />
      <SelectContent>
        {ROLES.map((r) => (
          <SelectItem key={r} value={r}>
            {t(ROLE_KEY[r])}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function RemoveButton({ member: m, onRemove }: { member: Member; onRemove: (m: Member) => void }) {
  const t = useT(adminDict);
  return (
    <IconButton
      aria-label={t('members.remove', { name: m.name })}
      icon={<Trash2 />}
      variant="ghost"
      size="sm"
      disabled={m.role === 'Owner'}
      title={m.role === 'Owner' ? t('members.ownerLocked') : undefined}
      onClick={() => onRemove(m)}
    />
  );
}

export interface MembersHandle {
  invite: () => void;
}

export const Members = forwardRef<MembersHandle, { onNavigate: (key: string) => void }>(
  function Members({ onNavigate }, ref) {
    const { push } = useToast();
    const demo = useDemo();
    const t = useT(adminDict);
    const [items, setItems] = useState<Member[]>(SEED_MEMBERS);
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Member['role']>('Member');
    const [pendingRemove, setPendingRemove] = useState<Member | null>(null);

    useImperativeHandle(ref, () => ({ invite: () => setOpen(true) }));

    const invite = () => {
      const name =
        email
          .split('@')[0]
          .replace(/\W/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()) || t('members.newMember');
      setItems((xs) => [
        ...xs,
        {
          id: Math.max(0, ...xs.map((x) => x.id)) + 1,
          name,
          email,
          initials: name.slice(0, 2).toUpperCase(),
          role,
          status: 'Invited',
        },
      ]);
      push({ variant: 'success', title: t('toast.invitationSent'), description: email });
      setEmail('');
      setOpen(false);
    };

    // Removal is confirmed (access is revoked immediately) and still
    // reversible for 5s — the toast's Undo restores the row.
    const remove = (m: Member) => {
      const snapshot = items;
      setItems((xs) => xs.filter((x) => x.id !== m.id));
      push({
        title: t('toast.memberRemoved'),
        description: m.name,
        duration: 5000,
        action: {
          label: t('common.undo'),
          altText: t('undo.remove', { name: m.name }),
          onClick: () => setItems(snapshot),
        },
      });
    };

    const setMemberRole = (id: number, next: Member['role']) =>
      setItems((xs) => xs.map((x) => (x.id === id ? { ...x, role: next } : x)));

    const visible = demo.state === 'empty' ? [] : items;
    const inviteButton = (
      <Button size="sm" leadingIcon={<Plus />} onClick={() => setOpen(true)}>
        {t('members.invite')}
      </Button>
    );

    return (
      <div>
        <PageHeader
          page="members"
          title={t('members.title')}
          subtitle={t('members.subtitle')}
          actions={inviteButton}
          onNavigate={onNavigate}
        />
        {demo.state === 'error' ? (
          <ErrorState
            variant="500"
            title={t('members.errorTitle')}
            description={t('members.errorDesc')}
            onRetry={() => demo.setState('normal')}
            live
          />
        ) : visible.length === 0 && demo.state !== 'loading' ? (
          <EmptyState
            icon={<Users />}
            title={t('members.emptyTitle')}
            description={t('members.emptyDesc')}
            action={
              <Button leadingIcon={<Plus />} onClick={() => setOpen(true)}>
                {t('members.inviteTeammate')}
              </Button>
            }
            className="min-h-[320px]"
          />
        ) : (
          <Card padding="none">
            {/* <sm: a stacked list — the 4-column table would put the Role
                select past the 320px edge inside a horizontal scroller. */}
            <ul className="divide-border divide-y sm:hidden">
              {demo.state === 'loading'
                ? Array.from({ length: 4 }, (_, i) => (
                    <li key={`sk-${i}`} aria-hidden className="space-y-3 p-4">
                      <div className="flex items-center gap-2">
                        <Skeleton variant="avatar" className="size-8" />
                        <Skeleton variant="text" className="w-32" />
                      </div>
                      <Skeleton className="h-8 w-full" />
                    </li>
                  ))
                : visible.map((m) => (
                    <li key={m.id} className="space-y-3 p-4">
                      <div className="flex items-center gap-2">
                        <Avatar size="sm" fallback={m.initials} alt="" />
                        <div className="min-w-0 flex-1 leading-tight">
                          <div className="text-foreground truncate font-medium">{m.name}</div>
                          <div className="text-foreground-subtle truncate text-xs">{m.email}</div>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                      <div className="flex items-center gap-2">
                        <RoleSelect member={m} onChange={setMemberRole} className="w-full" />
                        <RemoveButton member={m} onRemove={setPendingRemove} />
                      </div>
                    </li>
                  ))}
            </ul>
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('col.name')}</TableHead>
                    <TableHead>{t('col.role')}</TableHead>
                    <TableHead>{t('col.status')}</TableHead>
                    <TableHead className="w-12 text-right">
                      <span className="sr-only">{t('common.actions')}</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demo.state === 'loading'
                    ? Array.from({ length: 4 }, (_, i) => (
                        <TableRow key={`sk-${i}`} aria-hidden>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Skeleton variant="avatar" className="size-8" />
                              <Skeleton variant="text" className="w-32" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-8 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="ml-auto size-8" />
                          </TableCell>
                        </TableRow>
                      ))
                    : visible.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar size="sm" fallback={m.initials} alt="" />
                              <div className="leading-tight">
                                <div className="text-foreground font-medium">{m.name}</div>
                                <div className="text-foreground-subtle text-xs">{m.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <RoleSelect member={m} onChange={setMemberRole} className="w-32" />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={m.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <RemoveButton member={m} onRemove={setPendingRemove} />
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('invite.title')}</DialogTitle>
              <DialogDescription>{t('invite.desc')}</DialogDescription>
            </DialogHeader>
            <form
              id="invite-form"
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes('@')) invite();
              }}
            >
              <Input
                label={t('field.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('field.emailPlaceholder')}
                autoComplete="off"
                required
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="invite-role" className="text-foreground text-sm font-medium">
                  {t('field.role')}
                </label>
                <Select value={role} onValueChange={(v) => setRole(v as Member['role'])}>
                  <SelectTrigger id="invite-role" placeholder={t('field.role')} />
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {t(ROLE_KEY[r])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </form>
            <DialogFooter>
              <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" form="invite-form" disabled={!email.includes('@')}>
                {t('invite.send')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmationDialog
          open={pendingRemove !== null}
          onOpenChange={(o) => !o && setPendingRemove(null)}
          title={
            pendingRemove
              ? t('remove.title', { name: pendingRemove.name })
              : t('remove.titleGeneric')
          }
          description={t('remove.desc')}
          confirmLabel={t('remove.confirm')}
          confirmVariant="destructive"
          onConfirm={() => {
            if (pendingRemove) remove(pendingRemove);
            setPendingRemove(null);
          }}
        />
      </div>
    );
  },
);

const NOTIFICATION_ROWS: [AdminKey, AdminKey, boolean][] = [
  ['notifications.email', 'notifications.emailDesc', true],
  ['notifications.push', 'notifications.pushDesc', true],
  ['notifications.digest', 'notifications.digestDesc', false],
  ['notifications.marketing', 'notifications.marketingDesc', false],
];

/** Settings: sections ≤ 720px wide; explicit Save for the multi-field form,
 *  autosave (inline "Saved") for the toggles. */
export function SettingsPage({ onNavigate }: { onNavigate: (key: string) => void }) {
  const { push } = useToast();
  const t = useT(adminDict);
  const { theme, setTheme } = useTheme();
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  // Warn before the tab closes and before in-app navigation while unsaved.
  useUnsavedGuard(dirty);
  return (
    <div className="max-w-2xl">
      <PageHeader
        page="settings"
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
        onNavigate={onNavigate}
      />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-foreground text-base leading-none font-semibold">
              {t('profile.title')}
            </h2>
            <CardDescription>{t('profile.desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onChange={() => setDirty(true)}
              onSubmit={(e) => {
                e.preventDefault();
                setDirty(false);
                push({ variant: 'success', title: t('toast.profileSaved') });
              }}
            >
              <div className="flex items-center gap-4">
                <Avatar size="lg" fallback="AM" alt="Alex Morgan" />
                <Button type="button" variant="outline" size="sm">
                  {t('profile.changePhoto')}
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label={t('field.firstName')} defaultValue="Alex" autoComplete="given-name" />
                <Input
                  label={t('field.lastName')}
                  defaultValue="Morgan"
                  autoComplete="family-name"
                />
              </div>
              <Input
                label={t('field.email')}
                type="email"
                defaultValue="alex@example.com"
                autoComplete="email"
              />
              <Input key={t.locale} label={t('field.bio')} defaultValue={t('profile.bio')} />
              <div className="border-border flex justify-end gap-2 border-t pt-4">
                <Button
                  type="reset"
                  variant="ghost"
                  disabled={!dirty}
                  onClick={() => setDirty(false)}
                >
                  {t('common.discard')}
                </Button>
                <Button type="submit" disabled={!dirty}>
                  {t('common.saveChanges')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-foreground text-base leading-none font-semibold">
              {t('appearance.title')}
            </h2>
            <CardDescription>{t('appearance.desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              aria-label={t('account.theme')}
              orientation="horizontal"
              value={theme}
              onValueChange={(v) => setTheme(v as Theme)}
              className="gap-6"
            >
              <RadioItem value="light" label={t('theme.light')} />
              <RadioItem value="dark" label={t('theme.dark')} />
              <RadioItem value="system" label={t('theme.system')} />
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <h2 className="text-foreground text-base leading-none font-semibold">
                {t('notifications.title')}
              </h2>
              <CardDescription>{t('notifications.desc')}</CardDescription>
            </div>
            <span className="text-foreground-subtle text-xs" aria-live="polite">
              {savedAt ? t('notifications.savedAt', { time: savedAt }) : ''}
            </span>
          </CardHeader>
          <CardContent className="divide-border divide-y">
            {NOTIFICATION_ROWS.map(([title, desc, on]) => (
              <div key={title} className="py-3 first:pt-0 last:pb-0">
                <Switch
                  label={t(title)}
                  description={t(desc)}
                  labelPosition="before"
                  defaultChecked={on}
                  onCheckedChange={() => setSavedAt(formatDate(new Date(), { pattern: 'HH:mm' }))}
                  className="w-full justify-between"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/** Demo FX rate — the MN preview prices in ₮ (suffix, 09-localization-mn). */
const USD_TO_MNT = 3500;

/** USD amount → `$240.00` (en) or `840,000₮` (mn). */
function useMoney() {
  const locale = useLocale();
  return (n: number) =>
    locale === 'mn'
      ? formatMNT(n * USD_TO_MNT)
      : `$${formatNumber(n, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function BillingPage({ onNavigate }: { onNavigate: (key: string) => void }) {
  const demo = useDemo();
  const t = useT(adminDict);
  const money = useMoney();
  const invoices = demo.state === 'empty' ? [] : INVOICES;
  if (demo.state === 'error')
    return (
      <div className="max-w-2xl">
        <PageHeader
          page="billing"
          title={t('billing.title')}
          subtitle={t('billing.subtitle')}
          onNavigate={onNavigate}
        />
        <ErrorState
          variant="500"
          title={t('billing.errorTitle')}
          description={t('billing.errorDesc')}
          onRetry={() => demo.setState('normal')}
          live
        />
      </div>
    );
  return (
    <div className="max-w-2xl">
      <PageHeader
        page="billing"
        title={t('billing.title')}
        subtitle={t('billing.subtitle')}
        onNavigate={onNavigate}
      />
      {demo.state === 'loading' ? (
        <Card>
          <CardContent className="space-y-3">
            <Skeleton variant="text" className="w-40" />
            <Skeleton variant="text" className="w-64" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-foreground text-lg font-semibold">{t('billing.plan')}</span>
                <Badge tone="accent">{t('billing.current')}</Badge>
              </div>
              <p className="text-foreground-muted mt-1 text-sm">
                {t('billing.price', { price: money(20), date: '2026-07-01' })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">{t('billing.manage')}</Button>
              <Button>{t('billing.upgrade')}</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Card padding="none" className="mt-4">
        <CardHeader className="px-4 pt-4 md:px-6 md:pt-6">
          <h2 className="text-foreground text-base leading-none font-semibold">
            {t('billing.invoices')}
          </h2>
        </CardHeader>
        {demo.state === 'loading' ? (
          <div className="space-y-3 px-4 pb-4 md:px-6 md:pb-6" aria-hidden>
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-2/3" />
          </div>
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={<Receipt />}
            title={t('billing.emptyTitle')}
            description={t('billing.emptyDesc')}
            className="rounded-t-none border-0"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('col.invoice')}</TableHead>
                <TableHead>{t('col.date')}</TableHead>
                <TableHead className="text-right">{t('col.amount')}</TableHead>
                <TableHead className="text-right">{t('col.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="text-foreground font-medium">{inv.id}</TableCell>
                  <TableCell className="tabular text-foreground-muted">{inv.date}</TableCell>
                  <TableCell className="tabular text-foreground text-right">
                    {money(inv.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge tone="success" variant="outline">
                      <StatusIcon tone="success" />
                      {t(inv.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

/**
 * In-shell 404 — an unknown page key (stale bookmark, typo in the deep link)
 * keeps the chrome so the user can simply pick another destination.
 */
export function NotFoundPage({
  page,
  onNavigate,
}: {
  page: string;
  onNavigate: (key: string) => void;
}) {
  const t = useT(adminDict);
  return (
    <div className="max-w-2xl">
      <EmptyState
        icon={<FileText />}
        title={t('notfound.title')}
        description={t('notfound.desc', { page })}
        action={<Button onClick={() => onNavigate('overview')}>{t('notfound.back')}</Button>}
        className="min-h-[320px]"
      />
    </div>
  );
}

/* ---------------------------------------------------------------------------
 *  Placeholder pages for the `dual` shell's extra modules (CRM, Finance,
 *  Content, Security) — real destinations with a breadcrumb and an empty
 *  state, driven by `STUB_PAGES`.
 * ------------------------------------------------------------------------ */

export function StubPage({
  page,
  onNavigate,
}: {
  page: string;
  onNavigate: (key: string) => void;
}) {
  const t = useT(adminDict);
  const Icon = STUB_PAGES[page];
  if (!Icon) return null;
  // Stub copy lives under `stub.<page>.*`; the page set is fixed, so the keys exist.
  const key = (suffix: 'subtitle' | 'emptyTitle' | 'emptyDesc') =>
    `stub.${page}.${suffix}` as AdminKey;
  return (
    <div className="max-w-2xl">
      <PageHeader
        page={page}
        title={t(`nav.${page}` as AdminKey)}
        subtitle={t(key('subtitle'))}
        onNavigate={onNavigate}
      />
      <EmptyState
        icon={<Icon />}
        title={t(key('emptyTitle'))}
        description={t(key('emptyDesc'))}
        action={
          <Button variant="secondary" onClick={() => onNavigate('settings')}>
            {t('stub.openSettings')}
          </Button>
        }
      />
    </div>
  );
}

/**
 * Permission denied (403). Not an error page — the route exists, this account
 * just can't see it. Say what is restricted, who can grant it, and offer the
 * request as the primary action so the user isn't left at a dead end.
 */
export function PermissionDeniedPage({ onNavigate }: { onNavigate: (key: string) => void }) {
  const { push } = useToast();
  const t = useT(adminDict);
  const [requested, setRequested] = useState(false);
  return (
    <div className="max-w-2xl">
      <PageHeader
        page="apikeys"
        title={t('nav.apikeys')}
        subtitle={t('denied.subtitle')}
        onNavigate={onNavigate}
      />
      <EmptyState
        role="status"
        icon={<Lock />}
        title={t('denied.title')}
        description={t('denied.desc')}
        action={
          <Button
            disabled={requested}
            onClick={() => {
              setRequested(true);
              push({
                variant: 'success',
                title: t('toast.accessRequested'),
                description: t('toast.accessRequestedDesc'),
              });
            }}
          >
            {requested ? t('denied.sent') : t('denied.request')}
          </Button>
        }
        secondaryAction={
          <Button variant="ghost" onClick={() => onNavigate('members')}>
            {t('denied.viewTeam')}
          </Button>
        }
      />
    </div>
  );
}
