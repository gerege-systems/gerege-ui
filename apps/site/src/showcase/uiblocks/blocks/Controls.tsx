import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gerege-systems/ui';

export function Controls() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Elements</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="ghost">
            Ghost
          </Button>
          <Button size="sm" variant="destructive">
            Delete
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Active</Badge>
          <Badge tone="success">Verified</Badge>
          <Badge tone="warning">Expiring</Badge>
          <Badge tone="neutral">Archived</Badge>
        </div>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-foreground-muted pt-3 text-sm">
            Change a token and every element in this card moves at once.
          </TabsContent>
          <TabsContent value="history" className="text-foreground-muted pt-3 text-sm">
            Changes over the last 30 days.
          </TabsContent>
        </Tabs>
        <Alert variant="info" title="New report ready">
          The August summary is ready to download.
        </Alert>
      </CardContent>
    </Card>
  );
}
