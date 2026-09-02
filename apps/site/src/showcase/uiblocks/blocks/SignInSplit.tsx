import { Button, Card, CardContent, Icons, Input, Separator } from '@gerege-systems/ui';

export function SignInSplit() {
  return (
    <Card padding="sm" className="overflow-hidden">
      <CardContent className="grid gap-0 md:grid-cols-2">
        <div className="flex flex-col gap-3 p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Welcome back</h2>
            <p className="text-foreground-subtle text-xs">Sign in to continue to Atlas.</p>
          </div>
          <Input label="Email" type="email" placeholder="name@gerege.mn" autoComplete="off" />
          <Input label="Password" type="password" autoComplete="off" />
          <div className="flex items-center justify-between">
            <a href="/forgot-password" className="text-accent text-xs">
              Forgot password?
            </a>
          </div>
          <Button className="w-full">Sign in</Button>
          <div className="flex items-center gap-3">
            <Separator className="w-auto shrink grow" />
            <span className="text-foreground-subtle shrink-0 text-xs">or</span>
            <Separator className="w-auto shrink grow" />
          </div>
          <Button variant="secondary" className="w-full">
            <Icons.Github aria-hidden />
            Continue with GitHub
          </Button>
        </div>
        <div className="bg-background-muted hidden flex-col justify-between gap-6 p-6 md:flex">
          <Icons.Sparkles aria-hidden className="text-accent size-5" />
          <blockquote className="flex flex-col gap-3">
            <p className="text-sm">
              “We moved eleven internal tools onto one design system and stopped arguing about
              button colours.”
            </p>
            <footer className="text-foreground-subtle text-xs">
              Head of Platform, [CUSTOMER NAME]
            </footer>
          </blockquote>
        </div>
      </CardContent>
    </Card>
  );
}
