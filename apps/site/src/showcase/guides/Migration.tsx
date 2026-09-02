import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { CodeBlock } from '../widgets/CodeBlock';

export function MigrationBody() {
  return (
    <div className="prose-block">
      <Alert variant="info" title="Backwards-compatible by default">
        Every prop introduced in 0.5 and 0.6 is optional with a default that matches the pre-0.5
        demo content. Existing call sites continue to render unchanged — you only need to act when
        you want the new flexibility.
      </Alert>

      <h2>
        <Badge tone="accent" variant="outline">
          0.4 → 0.5
        </Badge>
      </h2>
      <p>
        0.5.0 turned 6 hard-coded patterns into props-driven templates. The exports stay the same;
        the prop surface expanded.
      </p>

      <h3>SettingsPage</h3>
      <p>Old: hard-coded Profile / Security / Notifications / Billing / Team sections.</p>
      <p>New: pass your own:</p>
      <CodeBlock
        code={`<SettingsPage
  sections={[
    { id: 'profile', label: 'Profile', icon: <User />, render: () => <ProfileForm /> },
    { id: 'team',    label: 'Team',    icon: <Users />, render: () => <TeamForm /> },
  ]}
  defaultSection="profile"
/>`}
      />

      <h3>RecordDetail</h3>
      <CodeBlock
        code={`<RecordDetail
  header={{ title, subtitle, status, actions, breadcrumbs }}
  tabs={[
    { id: 'overview', label: 'Overview', render: () => <Overview /> },
    { id: 'activity', label: 'Activity', render: () => <Activity /> },
  ]}
  sidePanel={<RelatedItems />}
/>`}
      />

      <h3>Pricing</h3>
      <CodeBlock
        code={`<Pricing
  title="Plans"
  tiers={[
    { name: 'Free', price: '$0', features: [...], cta: 'Start' },
    { name: 'Pro',  price: '$12', features: [...], cta: 'Upgrade', highlighted: true },
  ]}
/>`}
      />

      <h3>Onboarding</h3>
      <CodeBlock
        code={`<Onboarding<{ workspace: string; email: string }>
  initialData={{ workspace: '', email: '' }}
  steps={[
    {
      id: 'workspace',
      title: 'Workspace',
      heading: 'Name your workspace',
      render: ({ data, setData }) => <Input value={data.workspace} onChange={(e) => setData({ workspace: e.target.value })} />,
    },
    /* ...more steps */
  ]}
  onComplete={async (data) => api.complete(data)}
/>`}
      />

      <h3>FirstRunEmpty</h3>
      <CodeBlock
        code={`<FirstRunEmpty
  heroIcon={<Illustrations.InboxEmpty className="size-16" />}
  title="Welcome to Atlas"
  steps={[
    { icon: <Plus />,   title: 'Create',  description: '…', cta: 'New', onSelect: handleNew },
    { icon: <Github />, title: 'Import',  description: '…', cta: 'Connect' },
  ]}
/>`}
      />

      <h3>DataTablePage</h3>
      <p>
        Now generic over the row type. Hard-coded demo data is gone — pass your own rows + columns +
        filters.
      </p>
      <CodeBlock
        code={`<DataTablePage<User>
  title="Members"
  rows={users}
  columns={[
    { key: 'name',   header: 'Name',   sortable: true },
    { key: 'role',   header: 'Role' },
    { key: 'status', header: 'Status', cell: (r) => <Badge>{r.status}</Badge> },
  ]}
  filters={[{ key: 'status', label: 'Status', options: [{ value: 'all', label: 'All' }, ...] }]}
  bulkActions={[{ label: 'Remove', variant: 'destructive', onAction: (rows) => api.remove(rows) }]}
/>`}
      />

      <h3>Form: FormMessage renamed</h3>
      <p>
        <code>FormMessage</code> never existed publicly — the error renderer is{' '}
        <code>FormError</code>. If you imported <code>FormMessage</code>, rename it:
      </p>
      <CodeBlock
        code={`// Before
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@gerege-systems/ui';

// After
import { Form, FormField, FormItem, FormLabel, FormControl, FormError } from '@gerege-systems/ui';`}
      />

      <h2>
        <Badge tone="accent" variant="outline">
          0.5 → 0.6
        </Badge>
      </h2>

      <h3>AppShell — sidebar is now data-driven</h3>
      <p>
        The internal hard-coded nav still renders by default. Pass <code>navSections</code> or{' '}
        <code>sidebar</code> to customise.
      </p>
      <CodeBlock
        code={`<AppShell
  brand={<Logo />}
  active="projects"
  user={{ name: 'Avery', email: 'avery@acme.com', initials: 'AL', status: 'online' }}
  navSections={[
    { label: 'Workspace', items: [
      { key: 'home',     label: 'Home',     icon: <Home />,   href: '/' },
      { key: 'projects', label: 'Projects', icon: <Folder />, href: '/projects', trailing: <Badge>{count}</Badge> },
    ]},
  ]}
  notifications={[]}     /* empty hides the bell */
  topbarActions={<NewProjectButton />}
>
  <ProjectsPage />
</AppShell>`}
      />
      <p>
        <code>active</code> widened from a closed union to <code>string</code>. The legacy
        <code>AppShellNavKey</code> alias is still exported for typed callers.
      </p>

      <h3>Dashboard — accepts stats / chart / activity</h3>
      <CodeBlock
        code={`<Dashboard
  stats={[{ label: 'Active users', value: count, delta: { value: '+12%', positive: true } }]}
  chart={<LineChart data={mrr} />}
  activity={activityRows}
  headerActions={<DateRangePicker value={range} onChange={setRange} />}
/>`}
      />

      <h3>EmptyState / ErrorState — illustrations by default</h3>
      <p>
        <code>EmptyState</code> with no <code>icon</code> or <code>illustration</code> now renders
        the built-in <code>InboxEmpty</code> line illustration. To keep the old "icon-only" look
        explicitly pass an icon. <code>ErrorState</code> swaps in
        <code>NotFound</code> / <code>ServerError</code> / <code>ConnectionLost</code> per variant;
        opt out via the new <code>illustration</code> prop.
      </p>
      <CodeBlock
        code={`{/* New default look (large illustration) */}
<EmptyState title="No projects" description="Create one to get started." />

{/* Old default look (small icon in circle) */}
<EmptyState icon={<Folder className="size-6" />} title="No projects" />

{/* Custom illustration */}
<EmptyState
  illustration={<Illustrations.NoSearchResults className="size-32" />}
  title="No results"
/>`}
      />

      <h2>
        <Badge tone="neutral" variant="outline">
          No breaking changes
        </Badge>
      </h2>
      <p>
        All exports from 0.4 are still exported. All previously-required props remain required. New
        props are additive. Aside from the FormMessage → FormError rename (which was never publicly
        exported), no consumer code needs changes to take 0.6.x.
      </p>
    </div>
  );
}
