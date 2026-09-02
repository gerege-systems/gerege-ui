import { useMemo, type ReactNode } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { Alert } from '@/components/ui/Alert';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart } from '@/components/ui/Chart';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import { Kbd } from '@/components/ui/Kbd';
import { Progress } from '@/components/ui/Progress';
import { RadioGroup, RadioItem } from '@/components/ui/RadioGroup';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import { Stepper } from '@/components/ui/Stepper';
import { Switch } from '@/components/ui/Switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Textarea } from '@/components/ui/Textarea';
import { formatMNT } from '@/lib/format';
import { Github, Mail, Plus, Search } from '@/icons';

/**
 * The wall the theme is judged on: sixteen blocks, every one composed from
 * library components only — no local colours, radii or font sizes — so a token
 * change lands everywhere at once, which is the whole point of the page.
 *
 * The order is shuffled from a seed. A fixed order teaches you the page rather
 * than the theme: you learn where to look and stop seeing the rest. Reshuffling
 * puts a different pair of blocks side by side, which is where mismatched
 * spacing and contrast actually show up.
 */
export function ThemePreviewWall({ seed }: { seed: number }) {
  const blocks = useMemo(() => shuffle(BLOCKS, seed), [seed]);
  return (
    <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
      {blocks.map((b) => (
        <div key={b.key}>{b.node}</div>
      ))}
    </div>
  );
}

/** mulberry32 — small, seedable, and stable across reloads for a given seed. */
function shuffle<T>(items: readonly T[], seed: number): T[] {
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* ------------------------------------------------------------------ blocks -- */

const KPIS = [
  { label: 'Total revenue', value: formatMNT(48_250_000), delta: '+12.4%', tone: 'up' },
  { label: 'Orders', value: '1,284', delta: '+3.1%', tone: 'up' },
  { label: 'Average order', value: formatMNT(37_570), delta: 'No change', tone: 'flat' },
  { label: 'Refunds', value: '2.8%', delta: '+0.4%', tone: 'down' },
] as const;

function Kpis() {
  return (
    <Card padding="sm">
      <CardHeader>
        <CardTitle>Metrics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {KPIS.map((k) => (
          <div key={k.label} className="flex flex-col gap-0.5">
            <span className="text-foreground-subtle text-xs">{k.label}</span>
            {/* 28px overflows a half-width card once formatMNT adds the ₮. */}
            <span className="text-2xl font-semibold tracking-tight tabular-nums">{k.value}</span>
            <span
              className={
                k.tone === 'up'
                  ? 'text-success-foreground text-xs'
                  : k.tone === 'down'
                    ? 'text-danger-foreground text-xs'
                    : 'text-foreground-subtle text-xs'
              }
            >
              {k.delta}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const SALES = [3.2, 4.4, 2.6, 5.3, 4.0, 6.0, 4.6, 3.5, 5.1, 4.2];
const TARGET = [2.3, 3.1, 1.9, 3.8, 2.8, 4.2, 3.2, 2.2, 3.6, 2.7];

function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly revenue</CardTitle>
        <p className="text-foreground-subtle text-xs">2026 · millions of ₮ · UTC+8</p>
      </CardHeader>
      <CardContent>
        <BarChart
          height={180}
          showTableToggle
          aria-label="Monthly revenue against target"
          series={[
            { name: 'Revenue', data: MONTHS.map((m, i) => ({ x: m, y: SALES[i] })) },
            { name: 'Target', data: MONTHS.map((m, i) => ({ x: m, y: TARGET[i] })) },
          ]}
        />
      </CardContent>
    </Card>
  );
}

function SignIn() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <p className="text-foreground-subtle text-xs">Use your work email address.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input label="Email" type="email" placeholder="name@gerege.mn" autoComplete="off" />
        <Input label="Password" type="password" autoComplete="off" />
        <Button className="w-full">Sign in</Button>
        {/* Separator ships `w-full shrink-0`; both must be overridden or the
            row pushes past the card. */}
        <div className="flex items-center gap-3">
          <Separator className="w-auto shrink grow" />
          <span className="text-foreground-subtle shrink-0 text-xs">or</span>
          <Separator className="w-auto shrink grow" />
        </div>
        <Button variant="secondary" className="w-full">
          <Github aria-hidden />
          Continue with GitHub
        </Button>
        <Button variant="secondary" className="w-full">
          <Mail aria-hidden />
          Email me a link
        </Button>
      </CardContent>
    </Card>
  );
}

const INVOICES = [
  {
    id: 'INV-1042',
    customer: 'Gerege Systems',
    amount: 8_900_000,
    tone: 'warning',
    label: 'Pending',
  },
  {
    id: 'INV-1041',
    customer: 'Oyunchimeg M.',
    amount: 1_240_000,
    tone: 'success',
    label: 'Paid',
  },
  { id: 'INV-1040', customer: 'Uursaikhan LLC', amount: 460_000, tone: 'neutral', label: 'Draft' },
  {
    id: 'INV-1039',
    customer: 'Delgerekh Trade',
    amount: 2_150_000,
    tone: 'danger',
    label: 'Overdue',
  },
] as const;

function Invoices() {
  return (
    <Card padding="sm">
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.id}</TableCell>
                <TableCell>
                  <Badge tone={inv.tone} dot>
                    {inv.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatMNT(inv.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Switch defaultChecked label="Email" description="One message per order" />
        <Switch label="Push" description="Browser notifications" />
        <Switch defaultChecked label="Weekly digest" description="Every Monday" />
        <Separator />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Monthly quota</span>
            <span className="grow" />
            <span className="text-foreground-subtle text-xs">68%</span>
          </div>
          <Progress value={68} />
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}

function CalendarCard() {
  return (
    <Card padding="sm">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar mode="single" />
      </CardContent>
    </Card>
  );
}

const TEAM = [
  { name: 'Oyunchimeg', initials: 'OC', role: 'Owner', status: 'online' },
  { name: 'Batsaikhan', initials: 'BS', role: 'Admin', status: 'busy' },
  { name: 'Narantuya', initials: 'NT', role: 'Member', status: 'offline' },
] as const;

function Team() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team</CardTitle>
        <p className="text-foreground-subtle text-xs">3 members</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {TEAM.map((m) => (
          <div key={m.name} className="flex items-center gap-3">
            <Avatar fallback={m.initials} status={m.status} />
            <span className="min-w-0 grow truncate text-sm">{m.name}</span>
            <Select defaultValue={m.role}>
              <SelectTrigger size="sm" aria-label={`Role for ${m.name}`} className="w-28" />
              <SelectContent>
                <SelectItem value="Owner">Owner</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary" className="w-full">
          Invite member
        </Button>
      </CardFooter>
    </Card>
  );
}

function Controls() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Elements</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="ghost">
            Ghost
          </Button>
          <Button size="sm" variant="destructive">
            Delete
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Active</Badge>
          <Badge tone="success">Verified</Badge>
          <Badge tone="warning">Expiring</Badge>
          <Badge tone="neutral">Archived</Badge>
        </div>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-foreground-muted pt-3 text-sm">
            Change a token and every element in this card moves at once.
          </TabsContent>
          <TabsContent value="history" className="text-foreground-muted pt-3 text-sm">
            Changes over the last 30 days.
          </TabsContent>
        </Tabs>
        <Alert variant="info" title="New report ready">
          The August summary is ready to download.
        </Alert>
      </CardContent>
    </Card>
  );
}

function Pricing() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plans</CardTitle>
        <p className="text-foreground-subtle text-xs">Pay yearly and get two months free.</p>
      </CardHeader>
      <CardContent>
        <RadioGroup defaultValue="business" className="flex flex-col gap-3">
          <RadioItem value="start" label="Starter — free" description="1 user, 1 environment" />
          <RadioItem
            value="business"
            label="Business — 89,000₮ / month"
            description="10 users, SSO, audit log"
          />
          <RadioItem
            value="enterprise"
            label="Enterprise — talk to us"
            description="SLA, dedicated environment"
          />
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Choose plan</Button>
      </CardFooter>
    </Card>
  );
}

function ReportIssue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an issue</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Area</span>
          <Select defaultValue="billing">
            <SelectTrigger aria-label="Area" />
            <SelectContent>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="auth">Sign-in</SelectItem>
              <SelectItem value="reports">Reports</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input label="Subject" placeholder="Short summary" />
        <Textarea label="Details" rows={3} placeholder="What happened?" />
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Send</Button>
        <Button size="sm" variant="ghost">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}

function Upload() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attachments</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <FileUpload multiple accept="image/*" hint="PNG or JPG, up to 5MB" />
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-foreground-muted grow truncate">report-2026-08.pdf</span>
            <span className="text-foreground-subtle tabular-nums">42%</span>
          </div>
          <Progress value={42} size="sm" />
        </div>
      </CardContent>
    </Card>
  );
}

function Onboarding() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Get started</CardTitle>
      </CardHeader>
      <CardContent>
        <Stepper
          current={1}
          steps={[
            { title: 'Account', description: 'Name and email' },
            { title: 'Team', description: 'Invite members' },
            { title: 'Billing', description: 'Choose a plan' },
          ]}
        />
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Continue</Button>
        <Button size="sm" variant="ghost">
          Skip
        </Button>
      </CardFooter>
    </Card>
  );
}

function Faq() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FAQ</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="a">
            <AccordionTrigger>What is the refund policy?</AccordionTrigger>
            <AccordionContent>14 days, no questions asked.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Do you support SSO?</AccordionTrigger>
            <AccordionContent>OIDC and SAML on Business and above.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="c">
            <AccordionTrigger>Can I export my data?</AccordionTrigger>
            <AccordionContent>CSV and JSON — Settings → Export.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

function Empty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          title="No projects yet"
          description="Create your first project, then invite the team."
          action={
            <Button size="sm" leadingIcon={<Plus />}>
              New project
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}

function Forbidden() {
  return (
    <Card>
      <CardContent>
        <ErrorState
          variant="403"
          headingLevel={3}
          action={<Button variant="secondary">Back to dashboard</Button>}
        />
      </CardContent>
    </Card>
  );
}

function CommandHint() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input
          type="search"
          placeholder="Orders, customers, invoice numbers…"
          prefix={<Search />}
        />
        <div className="text-foreground-muted flex items-center gap-2 text-sm">
          Open anywhere: <Kbd>⌘</Kbd>
          <span className="text-foreground-subtle">+</span>
          <Kbd>K</Kbd>
        </div>
      </CardContent>
    </Card>
  );
}

const ACTIVITY = [
  { who: 'Oyunchimeg', initials: 'OC', what: 'sent INV-1042', when: '10 minutes ago' },
  { who: 'Batsaikhan', initials: 'BS', what: 'moved the plan to Business', when: '2 hours ago' },
  {
    who: 'Narantuya',
    initials: 'NT',
    what: 'downloaded the August report',
    when: 'Yesterday 17:40',
  },
] as const;

function Activity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {ACTIVITY.map((a) => (
          <div key={a.what} className="flex gap-3">
            <Avatar fallback={a.initials} size="sm" />
            <div className="flex min-w-0 flex-col">
              <span className="text-sm">
                <strong className="font-medium">{a.who}</strong> {a.what}
              </span>
              <span className="text-foreground-subtle text-xs">{a.when}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Usage() {
  const rows = [
    { label: 'API calls', used: 82, note: '410k / 500k' },
    { label: 'Storage', used: 47, note: '9.4GB / 20GB' },
    { label: 'Seats', used: 30, note: '3 / 10' },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <p className="text-foreground-subtle text-xs">September cycle</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-sm">
              <span className="grow">{r.label}</span>
              <span className="text-foreground-subtle text-xs tabular-nums">{r.note}</span>
            </div>
            <Progress value={r.used} tone={r.used > 80 ? 'warning' : 'accent'} size="sm" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const BLOCKS: { key: string; node: ReactNode }[] = [
  { key: 'kpis', node: <Kpis /> },
  { key: 'chart', node: <RevenueChart /> },
  { key: 'signin', node: <SignIn /> },
  { key: 'invoices', node: <Invoices /> },
  { key: 'notifications', node: <Notifications /> },
  { key: 'calendar', node: <CalendarCard /> },
  { key: 'team', node: <Team /> },
  { key: 'controls', node: <Controls /> },
  { key: 'pricing', node: <Pricing /> },
  { key: 'report', node: <ReportIssue /> },
  { key: 'upload', node: <Upload /> },
  { key: 'onboarding', node: <Onboarding /> },
  { key: 'faq', node: <Faq /> },
  { key: 'empty', node: <Empty /> },
  { key: 'forbidden', node: <Forbidden /> },
  { key: 'search', node: <CommandHint /> },
  { key: 'activity', node: <Activity /> },
  { key: 'usage', node: <Usage /> },
];

/** Block count, for the page header. */
export const BLOCK_COUNT = BLOCKS.length;
