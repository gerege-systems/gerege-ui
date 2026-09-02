import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  formatMNT,
} from '@gerege-systems/ui';

const LINES = [
  { item: 'Design system licence', qty: 1, rate: 1_400_000 },
  { item: 'Priority support', qty: 12, rate: 280_000 },
  { item: 'Custom components', qty: 3, rate: 700_000 },
] as const;

export function InvoiceDetail() {
  const subtotal = LINES.reduce((n, l) => n + l.qty * l.rate, 0);
  const vat = Math.round(subtotal * 0.1);

  return (
    <Card padding="sm">
      <CardHeader>
        <div className="flex items-start gap-2">
          <div className="flex flex-col gap-0.5">
            <CardTitle>Invoice INV-2847</CardTitle>
            <p className="text-foreground-subtle text-xs">Due 2026-09-30</p>
          </div>
          <span className="grow" />
          <Badge tone="warning">Pending</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LINES.map((l) => (
              <TableRow key={l.item}>
                <TableCell className="font-medium">{l.item}</TableCell>
                <TableCell className="text-right tabular-nums">{l.qty}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatMNT(l.qty * l.rate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Separator />
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex">
            <span className="text-foreground-muted grow">Subtotal</span>
            <span className="tabular-nums">{formatMNT(subtotal)}</span>
          </div>
          <div className="flex">
            <span className="text-foreground-muted grow">VAT 10%</span>
            <span className="tabular-nums">{formatMNT(vat)}</span>
          </div>
          <div className="flex font-medium">
            <span className="grow">Total due</span>
            <span className="tabular-nums">{formatMNT(subtotal + vat)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="secondary" className="grow">
          Download PDF
        </Button>
        <Button className="grow">Pay now</Button>
      </CardFooter>
    </Card>
  );
}
