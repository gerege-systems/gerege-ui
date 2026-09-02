import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  formatMNT,
} from '@gerege-systems/ui';

export function TransferConfirm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer funds</CardTitle>
        <p className="text-foreground-subtle text-xs">
          Move money between your connected accounts.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input label="Amount to transfer" defaultValue="1,200,000" suffix="₮" inputMode="numeric" />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">From account</span>
          <Select defaultValue="main">
            <SelectTrigger aria-label="From account" />
            <SelectContent>
              <SelectItem value="main">Current ····8402 — {formatMNT(12_450_000)}</SelectItem>
              <SelectItem value="biz">Business ····3310 — {formatMNT(4_120_000)}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">To account</span>
          <Select defaultValue="savings">
            <SelectTrigger aria-label="To account" />
            <SelectContent>
              <SelectItem value="savings">Savings ····1192 — {formatMNT(42_100_000)}</SelectItem>
              <SelectItem value="card">Card ····7702 — {formatMNT(412_940)}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="bg-background-subtle flex flex-col gap-1.5 rounded-md p-3 text-sm">
          <div className="flex">
            <span className="text-foreground-muted grow">Estimated arrival</span>
            <span>Today</span>
          </div>
          <div className="flex">
            <span className="text-foreground-muted grow">Transaction fee</span>
            <span className="tabular-nums">{formatMNT(0)}</span>
          </div>
          <div className="flex font-medium">
            <span className="grow">Total</span>
            <span className="tabular-nums">{formatMNT(1_200_000)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Confirm transfer</Button>
      </CardFooter>
    </Card>
  );
}
