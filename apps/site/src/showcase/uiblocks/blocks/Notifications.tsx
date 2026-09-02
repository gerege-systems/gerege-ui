import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
  Separator,
  Switch,
} from '@gerege-systems/ui';

export function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Switch defaultChecked label="Email" description="One message per order" />
        <Switch label="Push" description="Browser notifications" />
        <Switch defaultChecked label="Weekly digest" description="Every Monday" />
        <Separator />
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Monthly quota</span>
            <span className="grow" />
            <span className="text-foreground-subtle text-xs">68%</span>
          </div>
          <Progress value={68} />
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
