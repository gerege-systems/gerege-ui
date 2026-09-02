import { Badge, Button, Card, CardContent, Icons } from '@gerege-systems/ui';

export function AnnouncementCard() {
  return (
    <Card padding="sm" className="overflow-hidden">
      {/* A flat tinted band, not a photo and not a gradient: the block ships as
          source, so a bundled image would be one more thing to replace, and
          gradients are out by the design rules. */}
      <div aria-hidden className="bg-accent-subtle flex h-40 w-full items-center justify-center">
        <Icons.BarChart3 className="text-accent size-10" />
      </div>
      <CardContent className="flex flex-col gap-3 pt-4">
        <h3 className="text-base font-semibold">Observability Plus replaces Monitoring</h3>
        <p className="text-foreground-muted text-sm">
          A better way to explore your data, in plain language. Monitoring leaves the Pro plan in
          November 2026.
        </p>
        <div className="flex items-center gap-2">
          <Button size="sm">
            Create a query
            <Icons.Plus aria-hidden />
          </Button>
          <span className="grow" />
          <Badge tone="warning">Warning</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
