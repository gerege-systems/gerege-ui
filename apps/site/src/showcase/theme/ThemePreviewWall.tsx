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
  { label: 'Нийт борлуулалт', value: formatMNT(48_250_000), delta: '+12.4%', tone: 'up' },
  { label: 'Захиалга', value: '1,284', delta: '+3.1%', tone: 'up' },
  { label: 'Дундаж дүн', value: formatMNT(37_570), delta: 'Өөрчлөлтгүй', tone: 'flat' },
  { label: 'Буцаалт', value: '2.8%', delta: '+0.4%', tone: 'down' },
] as const;

function Kpis() {
  return (
    <Card padding="sm">
      <CardHeader>
        <CardTitle>Үзүүлэлт</CardTitle>
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

const MONTHS = ['1-р', '2-р', '3-р', '4-р', '5-р', '6-р', '7-р', '8-р', '9-р', '10-р'];
const SALES = [3.2, 4.4, 2.6, 5.3, 4.0, 6.0, 4.6, 3.5, 5.1, 4.2];
const TARGET = [2.3, 3.1, 1.9, 3.8, 2.8, 4.2, 3.2, 2.2, 3.6, 2.7];

function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Сарын урсгал</CardTitle>
        <p className="text-foreground-subtle text-xs">2026 · сая ₮ · UTC+8</p>
      </CardHeader>
      <CardContent>
        <BarChart
          height={180}
          showTableToggle
          aria-label="Сарын борлуулалт ба зорилт"
          series={[
            { name: 'Борлуулалт', data: MONTHS.map((m, i) => ({ x: m, y: SALES[i] })) },
            { name: 'Зорилт', data: MONTHS.map((m, i) => ({ x: m, y: TARGET[i] })) },
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
        <CardTitle>Нэвтрэх</CardTitle>
        <p className="text-foreground-subtle text-xs">Байгууллагын и-мэйлээрээ орно уу.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input label="И-мэйл" type="email" placeholder="ner@gerege.mn" autoComplete="off" />
        <Input label="Нууц үг" type="password" autoComplete="off" />
        <Button className="w-full">Нэвтрэх</Button>
        {/* Separator ships `w-full shrink-0`; both must be overridden or the
            row pushes past the card. */}
        <div className="flex items-center gap-3">
          <Separator className="w-auto shrink grow" />
          <span className="text-foreground-subtle shrink-0 text-xs">эсвэл</span>
          <Separator className="w-auto shrink grow" />
        </div>
        <Button variant="secondary" className="w-full">
          <Github aria-hidden />
          GitHub-ээр
        </Button>
        <Button variant="secondary" className="w-full">
          <Mail aria-hidden />
          Нэг удаагийн холбоос
        </Button>
      </CardContent>
    </Card>
  );
}

const INVOICES = [
  {
    id: 'INV-1042',
    customer: 'Гэрэгэ Системс',
    amount: 8_900_000,
    tone: 'warning',
    label: 'Хүлээгдэж буй',
  },
  {
    id: 'INV-1041',
    customer: 'М. Оюунчимэг',
    amount: 1_240_000,
    tone: 'success',
    label: 'Төлөгдсөн',
  },
  { id: 'INV-1040', customer: 'Үүрсайхан ХХК', amount: 460_000, tone: 'neutral', label: 'Ноорог' },
  {
    id: 'INV-1039',
    customer: 'Дэлгэрэх Трейд',
    amount: 2_150_000,
    tone: 'danger',
    label: 'Хэтэрсэн',
  },
] as const;

function Invoices() {
  return (
    <Card padding="sm">
      <CardHeader>
        <CardTitle>Нэхэмжлэх</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дугаар</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead className="text-right">Дүн</TableHead>
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
        <CardTitle>Мэдэгдэл</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Switch defaultChecked label="И-мэйл" description="Захиалга бүрт нэг мэдэгдэл" />
        <Switch label="Түлхэлт" description="Хөтчийн мэдэгдэл" />
        <Switch defaultChecked label="Долоо хоногийн тайлан" description="Даваа гараг бүр" />
        <Separator />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Сарын багц</span>
            <span className="grow" />
            <span className="text-foreground-subtle text-xs">68%</span>
          </div>
          <Progress value={68} />
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary">
          Хадгалах
        </Button>
      </CardFooter>
    </Card>
  );
}

function CalendarCard() {
  return (
    <Card padding="sm">
      <CardHeader>
        <CardTitle>Хуанли</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar mode="single" />
      </CardContent>
    </Card>
  );
}

const TEAM = [
  { name: 'Оюунчимэг', initials: 'ОЧ', role: 'Owner', status: 'online' },
  { name: 'Батсайхан', initials: 'БС', role: 'Admin', status: 'busy' },
  { name: 'Нарантуяа', initials: 'НТ', role: 'Member', status: 'offline' },
] as const;

function Team() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Баг</CardTitle>
        <p className="text-foreground-subtle text-xs">3 гишүүн</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {TEAM.map((m) => (
          <div key={m.name} className="flex items-center gap-3">
            <Avatar fallback={m.initials} status={m.status} />
            <span className="min-w-0 grow truncate text-sm">{m.name}</span>
            <Select defaultValue={m.role}>
              <SelectTrigger size="sm" aria-label={`${m.name}-ийн эрх`} className="w-28" />
              <SelectContent>
                <SelectItem value="Owner">Эзэн</SelectItem>
                <SelectItem value="Admin">Админ</SelectItem>
                <SelectItem value="Member">Гишүүн</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary" className="w-full">
          Гишүүн урих
        </Button>
      </CardFooter>
    </Card>
  );
}

function Controls() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Элементүүд</CardTitle>
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
            Устгах
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Идэвхтэй</Badge>
          <Badge tone="success">Баталгаажсан</Badge>
          <Badge tone="warning">Хугацаа дуусах</Badge>
          <Badge tone="neutral">Архив</Badge>
        </div>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Тойм</TabsTrigger>
            <TabsTrigger value="history">Түүх</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-foreground-muted pt-3 text-sm">
            Токен солиход энэ картын бүх элемент нэг дор өөрчлөгдөнө.
          </TabsContent>
          <TabsContent value="history" className="text-foreground-muted pt-3 text-sm">
            Сүүлийн 30 хоногийн өөрчлөлт.
          </TabsContent>
        </Tabs>
        <Alert variant="info" title="Шинэ тайлан бэлэн">
          8-р сарын нэгтгэл татахад бэлэн боллоо.
        </Alert>
      </CardContent>
    </Card>
  );
}

function Pricing() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Багц</CardTitle>
        <p className="text-foreground-subtle text-xs">Жилээр төлбөл 2 сар үнэгүй.</p>
      </CardHeader>
      <CardContent>
        <RadioGroup defaultValue="business" className="flex flex-col gap-3">
          <RadioItem value="start" label="Эхлэл — 0₮" description="1 хэрэглэгч, 1 орчин" />
          <RadioItem
            value="business"
            label="Бизнес — 89,000₮ / сар"
            description="10 хэрэглэгч, SSO, аудит"
          />
          <RadioItem
            value="enterprise"
            label="Байгууллага — тохиролцоно"
            description="SLA, тусдаа орчин"
          />
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Багц сонгох</Button>
      </CardFooter>
    </Card>
  );
}

function ReportIssue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Асуудал мэдэгдэх</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Хэсэг</span>
          <Select defaultValue="billing">
            <SelectTrigger aria-label="Хэсэг" />
            <SelectContent>
              <SelectItem value="billing">Төлбөр</SelectItem>
              <SelectItem value="auth">Нэвтрэлт</SelectItem>
              <SelectItem value="reports">Тайлан</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input label="Гарчиг" placeholder="Товч тайлбар" />
        <Textarea label="Дэлгэрэнгүй" rows={3} placeholder="Юу болсныг бичнэ үү" />
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Илгээх</Button>
        <Button size="sm" variant="ghost">
          Болих
        </Button>
      </CardFooter>
    </Card>
  );
}

function Upload() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Файл хавсаргах</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <FileUpload multiple accept="image/*" hint="PNG эсвэл JPG, 5MB хүртэл" />
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-foreground-muted grow truncate">tailan-2026-08.pdf</span>
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
        <CardTitle>Эхлэх</CardTitle>
      </CardHeader>
      <CardContent>
        <Stepper
          current={1}
          steps={[
            { title: 'Бүртгэл', description: 'Нэр, и-мэйл' },
            { title: 'Баг', description: 'Гишүүд урих' },
            { title: 'Төлбөр', description: 'Багц сонгох' },
          ]}
        />
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Үргэлжлүүлэх</Button>
        <Button size="sm" variant="ghost">
          Алгасах
        </Button>
      </CardFooter>
    </Card>
  );
}

function Faq() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Түгээмэл асуулт</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="a">
            <AccordionTrigger>Төлбөрөө буцаах боломжтой юу?</AccordionTrigger>
            <AccordionContent>14 хоногийн дотор, тайлбаргүйгээр.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>SSO дэмждэг үү?</AccordionTrigger>
            <AccordionContent>Бизнес багцаас дээш OIDC болон SAML.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="c">
            <AccordionTrigger>Өгөгдлөө экспортлож болох уу?</AccordionTrigger>
            <AccordionContent>CSV, JSON — Тохиргоо → Экспорт.</AccordionContent>
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
        <CardTitle>Төсөл</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          title="Төсөл алга"
          description="Эхний төслөө үүсгээд багаа урина уу."
          action={
            <Button size="sm" leadingIcon={<Plus />}>
              Шинэ төсөл
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
          action={<Button variant="secondary">Хяналтын самбар руу</Button>}
        />
      </CardContent>
    </Card>
  );
}

function CommandHint() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Хайлт</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input type="search" placeholder="Захиалга, харилцагч, дугаар…" prefix={<Search />} />
        <div className="text-foreground-muted flex items-center gap-2 text-sm">
          Хаанаас ч нээх: <Kbd>⌘</Kbd>
          <span className="text-foreground-subtle">+</span>
          <Kbd>K</Kbd>
        </div>
      </CardContent>
    </Card>
  );
}

const ACTIVITY = [
  { who: 'Оюунчимэг', initials: 'ОЧ', what: 'INV-1042-ыг илгээв', when: '10 минутын өмнө' },
  { who: 'Батсайхан', initials: 'БС', what: 'Багцыг Бизнес болгов', when: '2 цагийн өмнө' },
  { who: 'Нарантуяа', initials: 'НТ', what: '8-р сарын тайлан татав', when: 'Өчигдөр 17:40' },
] as const;

function Activity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Сүүлийн үйлдэл</CardTitle>
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
    { label: 'API дуудалт', used: 82, note: '410к / 500к' },
    { label: 'Хадгалалт', used: 47, note: '9.4GB / 20GB' },
    { label: 'Гишүүд', used: 30, note: '3 / 10' },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ашиглалт</CardTitle>
        <p className="text-foreground-subtle text-xs">9-р сарын мөчлөг</p>
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
