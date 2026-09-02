import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  formatMNT,
} from '@gerege-systems/ui';

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

export function Invoices() {
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
