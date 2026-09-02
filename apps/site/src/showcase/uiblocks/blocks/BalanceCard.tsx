import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  Separator,
  formatMNT,
} from '@gerege-systems/ui';

export function BalanceCard() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-foreground-subtle text-xs">Claimable balance</span>
            <span className="text-3xl font-semibold tracking-tight tabular-nums">
              {formatMNT(1_284_500)}
            </span>
          </div>
          <span className="grow" />
          <Badge tone="success">Ready</Badge>
        </div>
        <Separator />
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex">
            <span className="text-foreground-muted grow">Pending settlement</span>
            <span className="tabular-nums">{formatMNT(320_000)}</span>
          </div>
          <div className="flex">
            <span className="text-foreground-muted grow">Next payout</span>
            <span>2026-09-15</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="grow">Withdraw</Button>
        <Button variant="secondary">History</Button>
      </CardFooter>
    </Card>
  );
}
