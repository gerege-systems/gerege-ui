import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Separator,
  Icons,
} from '@gerege-systems/ui';

export function SignIn() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <p className="text-foreground-subtle text-xs">Use your work email address.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input label="Email" type="email" placeholder="name@gerege.mn" autoComplete="off" />
        <Input label="Password" type="password" autoComplete="off" />
        <Button className="w-full">Sign in</Button>
        {/* Separator ships `w-full shrink-0`; both must be overridden or the
            row pushes past the card. */}
        <div className="flex items-center gap-3">
          <Separator className="w-auto shrink grow" />
          <span className="text-foreground-subtle shrink-0 text-xs">or</span>
          <Separator className="w-auto shrink grow" />
        </div>
        <Button variant="secondary" className="w-full">
          <Icons.Github aria-hidden />
          Continue with GitHub
        </Button>
        <Button variant="secondary" className="w-full">
          <Icons.Mail aria-hidden />
          Email me a link
        </Button>
      </CardContent>
    </Card>
  );
}
