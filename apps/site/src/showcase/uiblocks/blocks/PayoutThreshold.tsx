import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Slider,
  Switch,
} from '@gerege-systems/ui';

export function PayoutThreshold() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout threshold</CardTitle>
        <p className="text-foreground-subtle text-xs">
          The minimum balance required before a payout is triggered.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Slider
          label="Threshold"
          showValue
          min={0}
          max={5_000_000}
          step={100_000}
          defaultValue={[1_000_000]}
          formatValue={(v) => `${(v / 1_000_000).toFixed(1)}сая₮`}
        />
        <Input label="Exact amount" defaultValue="1,000,000" suffix="₮" inputMode="numeric" />
        <Switch
          defaultChecked
          label="Hold payouts on weekends"
          description="Queued until the next working day"
        />
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Save threshold</Button>
        <Button size="sm" variant="ghost">
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}
