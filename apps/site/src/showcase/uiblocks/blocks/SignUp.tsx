import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
} from '@gerege-systems/ui';

export function SignUp() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <p className="text-foreground-subtle text-xs">Free for one workspace, no card needed.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="First name" autoComplete="off" />
          <Input label="Last name" autoComplete="off" />
        </div>
        <Input label="Work email" type="email" placeholder="name@gerege.mn" autoComplete="off" />
        <Input
          label="Password"
          type="password"
          helperText="At least 12 characters."
          autoComplete="off"
        />
        <Checkbox label="I agree to the terms and the privacy policy" />
        <Button className="w-full">Create account</Button>
        <p className="text-foreground-subtle text-center text-xs">
          Already have an account? <a href="/sign-in">Sign in</a>
        </p>
      </CardContent>
    </Card>
  );
}
