import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Separator,
  Switch,
} from '@gerege-systems/ui';

export function PreferencesPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <p className="text-foreground-subtle text-xs">
          Manage your account settings and notifications.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Default currency</span>
          <Select defaultValue="mnt">
            <SelectTrigger aria-label="Default currency" />
            <SelectContent>
              <SelectItem value="mnt">MNT — Mongolian tögrög</SelectItem>
              <SelectItem value="usd">USD — United States dollar</SelectItem>
              <SelectItem value="eur">EUR — Euro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator />
        <Switch
          defaultChecked
          label="Public statistics"
          description="Let others see your totals and activity"
        />
        <Separator />
        <Switch
          defaultChecked
          label="Email notifications"
          description="Monthly reports and distribution updates"
        />
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="ghost">Reset</Button>
        <span className="grow" />
        <Button>Save preferences</Button>
      </CardFooter>
    </Card>
  );
}
