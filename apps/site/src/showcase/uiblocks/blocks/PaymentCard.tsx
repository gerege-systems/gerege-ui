import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  Icons,
  Progress,
  Separator,
  formatMNT,
} from '@gerege-systems/ui';

export function PaymentCard() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Icons.CreditCard aria-hidden className="text-foreground-subtle mt-0.5 size-5" />
          <div className="flex flex-col">
            <span className="text-foreground-subtle text-xs">Card balance</span>
            <span className="text-2xl font-semibold tracking-tight tabular-nums">
              {formatMNT(412_940)}
            </span>
          </div>
          <span className="grow" />
          <Badge tone="warning">Due 1 Apr</Badge>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-foreground-muted grow">Credit used</span>
            <span className="text-foreground-subtle tabular-nums">41%</span>
          </div>
          <Progress value={41} size="sm" />
        </div>
        <Separator />
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex">
            <span className="text-foreground-muted grow">Minimum payment</span>
            <span className="tabular-nums">{formatMNT(41_300)}</span>
          </div>
          <div className="flex">
            <span className="text-foreground-muted grow">Card</span>
            <span className="font-mono">···· 7702</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="grow">Pay now</Button>
        <Button variant="secondary">Statements</Button>
      </CardFooter>
    </Card>
  );
}
