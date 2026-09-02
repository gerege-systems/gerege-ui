import {
  Alert,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Switch,
} from '@gerege-systems/ui';

export function AccountAccess() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account access</CardTitle>
        <p className="text-foreground-subtle text-xs">
          Update your credentials or re-authenticate this device.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input label="Current password" type="password" autoComplete="off" />
        <Input
          label="New password"
          type="password"
          helperText="At least 12 characters."
          autoComplete="off"
        />
        <Switch
          defaultChecked
          label="Sign out other devices"
          description="Ends every session except this one"
        />
        <Alert variant="warning" title="Last changed 14 months ago">
          Long-lived passwords are the most common way an account is taken over.
        </Alert>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Update password</Button>
        <Button size="sm" variant="ghost">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
