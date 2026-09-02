import { Button, Card, CardContent, Icons } from '@gerege-systems/ui';

export function ConnectBank() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
        <span className="bg-background-muted text-foreground-subtle flex size-10 items-center justify-center rounded-md">
          <Icons.CreditCard aria-hidden className="size-5" />
        </span>
        <h3 className="text-base font-semibold">Connect a bank</h3>
        <p className="text-foreground-muted max-w-xs text-sm">
          Link a payout method to receive monthly distributions automatically.
        </p>
        <Button className="mt-1">Set up payouts</Button>
      </CardContent>
    </Card>
  );
}
