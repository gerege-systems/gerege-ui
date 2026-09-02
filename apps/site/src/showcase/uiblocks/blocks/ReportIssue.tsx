import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Textarea,
} from '@gerege-systems/ui';

export function ReportIssue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an issue</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Area</span>
          <Select defaultValue="billing">
            <SelectTrigger aria-label="Area" />
            <SelectContent>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="auth">Sign-in</SelectItem>
              <SelectItem value="reports">Reports</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input label="Subject" placeholder="Short summary" />
        <Textarea label="Details" rows={3} placeholder="What happened?" />
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Send</Button>
        <Button size="sm" variant="ghost">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
