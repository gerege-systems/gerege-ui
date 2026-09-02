import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Stepper,
} from '@gerege-systems/ui';

export function Onboarding() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Get started</CardTitle>
      </CardHeader>
      <CardContent>
        <Stepper
          current={1}
          steps={[
            { title: 'Account', description: 'Name and email' },
            { title: 'Team', description: 'Invite members' },
            { title: 'Billing', description: 'Choose a plan' },
          ]}
        />
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Continue</Button>
        <Button size="sm" variant="ghost">
          Skip
        </Button>
      </CardFooter>
    </Card>
  );
}
