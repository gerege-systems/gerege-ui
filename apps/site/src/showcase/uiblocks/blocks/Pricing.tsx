import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  RadioGroup,
  RadioItem,
} from '@gerege-systems/ui';

export function Pricing() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plans</CardTitle>
        <p className="text-foreground-subtle text-xs">Pay yearly and get two months free.</p>
      </CardHeader>
      <CardContent>
        <RadioGroup defaultValue="business" className="flex flex-col gap-3">
          <RadioItem value="start" label="Starter — free" description="1 user, 1 environment" />
          <RadioItem
            value="business"
            label="Business — 89,000₮ / month"
            description="10 users, SSO, audit log"
          />
          <RadioItem
            value="enterprise"
            label="Enterprise — talk to us"
            description="SLA, dedicated environment"
          />
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Choose plan</Button>
      </CardFooter>
    </Card>
  );
}
