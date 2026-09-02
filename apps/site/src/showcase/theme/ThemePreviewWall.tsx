import { Alert } from '@/components/ui/Alert';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart } from '@/components/ui/Chart';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
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
import { formatMNT } from '@/lib/format';
import { Github, Mail } from '@/icons';

/**
 * The wall the theme is judged on. Every block here is composed from library
 * components only — no local colours, no local radii — so a token change shows
 * up everywhere at once, which is the whole point of the page.
 */
export function ThemePreviewWall() {
  return (
    <div className="flex flex-col gap-4">
      <KpiRow />
      <div className="grid gap-4 lg:grid-cols-3">
        <RevenueChart />
        <SignIn />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Invoices />
        <Notifications />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <CalendarCard />
        <Team />
        <Controls />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ blocks -- */

const KPIS = [
  { label: 'Нийт борлуулалт', value: formatMNT(48_250_000), delta: '+12.4%', tone: 'up' },
  { label: 'Захиалга', value: '1,284', delta: '+3.1%', tone: 'up' },
  { label: 'Дундаж дүн', value: formatMNT(37_570), delta: 'Өөрчлөлтгүй', tone: 'flat' },
  { label: 'Буцаалт', value: '2.8%', delta: '+0.4%', tone: 'down' },
] as const;

function KpiRow() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {KPIS.map((k) => (
        <Card key={k.label} padding="sm" className="flex flex-col gap-1">
          <span className="text-foreground-subtle text-xs">{k.label}</span>
          {/* 28px would overflow a 375px-wide card once the ₮ suffix is on. */}
          <span className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
            {k.value}
          </span>
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
        </Card>
      ))}
    </div>
  );
}

const MONTHS = ['1-р', '2-р', '3-р', '4-р', '5-р', '6-р', '7-р', '8-р', '9-р', '10-р'];
const SALES = [3.2, 4.4, 2.6, 5.3, 4.0, 6.0, 4.6, 3.5, 5.1, 4.2];
const TARGET = [2.3, 3.1, 1.9, 3.8, 2.8, 4.2, 3.2, 2.2, 3.6, 2.7];

function RevenueChart() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Сарын урсгал</CardTitle>
        <p className="text-foreground-subtle text-xs">2026 · сая ₮ · UTC+8</p>
      </CardHeader>
      <CardContent>
        <BarChart
          height={200}
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
        {/* Separator defaults to `w-full shrink-0`; both must be overridden or
            the two rules push the row past the card. */}
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
    customer: 'Гэрэгэ Системс ХХК',
    amount: 8_900_000,
    tone: 'warning',
    label: 'Хүлээгдэж буй',
  },
  {
    id: 'INV-1041',
    customer: 'Мөнхбаярын Оюунчимэг',
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
    label: 'Хугацаа хэтэрсэн',
  },
] as const;

function Invoices() {
  return (
    <Card className="lg:col-span-2" padding="sm">
      <CardHeader>
        <CardTitle>Нэхэмжлэх</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дугаар</TableHead>
              <TableHead>Харилцагч</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead className="text-right">Дүн</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.id}</TableCell>
                <TableCell>{inv.customer}</TableCell>
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
          Бүгдийг хадгалах
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
