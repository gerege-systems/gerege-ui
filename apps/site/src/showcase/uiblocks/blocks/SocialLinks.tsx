import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Icons,
  Input,
} from '@gerege-systems/ui';

export function SocialLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social links</CardTitle>
        <p className="text-foreground-subtle text-xs">Shown on your public profile.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input
          aria-label="Website"
          prefix={<Icons.Link2 />}
          defaultValue="gerege.mn"
          spellCheck={false}
        />
        <Input
          aria-label="GitHub"
          prefix={<Icons.Github />}
          placeholder="username"
          spellCheck={false}
        />
        <Input
          aria-label="Email"
          prefix={<Icons.Mail />}
          placeholder="name@gerege.mn"
          spellCheck={false}
        />
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Save</Button>
        <Button size="sm" variant="ghost">
          <Icons.Plus aria-hidden />
          Add link
        </Button>
      </CardFooter>
    </Card>
  );
}
