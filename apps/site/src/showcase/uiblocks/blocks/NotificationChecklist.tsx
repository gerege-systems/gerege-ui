import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Separator,
} from '@gerege-systems/ui';

const ITEMS = [
  { name: 'Transaction alerts', desc: 'Deposits, withdrawals and transfers.', on: true },
  { name: 'Security alerts', desc: 'Sign-in attempts and account changes.', on: true },
  { name: 'Goal milestones', desc: 'Updates at 25%, 50%, 75% and 100%.', on: false },
  { name: 'Market updates', desc: 'Daily summary and price alerts.', on: false },
] as const;

export function NotificationChecklist() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <p className="text-foreground-subtle text-xs">Choose what you want to be notified about.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* Indeterminate is the honest state for "select all" when some are on. */}
        <Checkbox checked="indeterminate" label="Select all" />
        <Separator />
        {ITEMS.map((it) => (
          <Checkbox key={it.name} defaultChecked={it.on} label={it.name} description={it.desc} />
        ))}
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save preferences</Button>
      </CardFooter>
    </Card>
  );
}
