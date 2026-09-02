import {
  Alert,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from '@gerege-systems/ui';

export function TwoFactor() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-factor code</CardTitle>
        <p className="text-foreground-subtle text-xs">
          Enter the six digits from your authenticator app.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input
          label="Code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          className="font-mono tracking-[0.4em]"
        />
        <Alert variant="warning" title="Lost your device?">
          Use a recovery code, or ask an admin to reset the second factor.
        </Alert>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>Verify</Button>
        <Button variant="ghost">Resend code</Button>
      </CardFooter>
    </Card>
  );
}
