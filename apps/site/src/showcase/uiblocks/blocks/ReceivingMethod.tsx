import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  RadioGroup,
  RadioItem,
} from '@gerege-systems/ui';

export function ReceivingMethod() {
  return (
    <Card>
      <CardHeader>
        <p className="text-foreground-subtle text-xs">Payout preferences</p>
        <CardTitle>Receiving method</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input label="Account holder" defaultValue="Gerege Systems LLC" autoComplete="off" />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Method</span>
          <RadioGroup defaultValue="bank" className="grid gap-2 sm:grid-cols-2">
            <RadioItem value="bank" label="Bank transfer" description="SWIFT / IBAN" />
            <RadioItem value="wallet" label="Wallet" description="Instant payout" />
          </RadioGroup>
        </div>
        <Input
          label="IBAN / account number"
          placeholder="MN12 0005 0000 ····"
          spellCheck={false}
          autoComplete="off"
        />
      </CardContent>
      <CardFooter>
        {/* Disabled until something changes — the state a settings form opens in. */}
        <Button className="w-full" disabled>
          Save payout settings
        </Button>
      </CardFooter>
    </Card>
  );
}
