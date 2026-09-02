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
  Separator,
  formatMNT,
} from '@gerege-systems/ui';

export function TransferFunds() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer funds</CardTitle>
        <p className="text-foreground-subtle text-xs">Move money between your accounts.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">From</span>
          <Select defaultValue="main">
            <SelectTrigger aria-label="From account" />
            <SelectContent>
              <SelectItem value="main">Current · ····4821</SelectItem>
              <SelectItem value="savings">Savings · ····1190</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">To</span>
          <Select defaultValue="savings">
            <SelectTrigger aria-label="To account" />
            <SelectContent>
              <SelectItem value="savings">Savings · ····1190</SelectItem>
              <SelectItem value="card">Card · ····7702</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input label="Amount" defaultValue="250,000" suffix="₮" inputMode="numeric" />
        <Separator />
        <div className="flex text-sm">
          <span className="text-foreground-muted grow">Fee</span>
          <span className="tabular-nums">{formatMNT(0)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Transfer</Button>
      </CardFooter>
    </Card>
  );
}
