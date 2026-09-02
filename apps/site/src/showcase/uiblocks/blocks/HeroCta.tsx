import { Badge, Button, Card, CardContent, Icons } from '@gerege-systems/ui';

export function HeroCta() {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-4 py-8">
        <Badge tone="accent">v0.11 is out</Badge>
        <h2 className="max-w-md text-3xl font-semibold tracking-tight text-balance">
          One UI foundation for every internal tool you ship
        </h2>
        <p className="text-foreground-muted max-w-md text-sm">
          Fifty accessible components, Cyrillic-ready type, and a theme you set once in a single
          stylesheet.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button size="lg">
            Get started
            <Icons.ArrowRight aria-hidden />
          </Button>
          <Button size="lg" variant="secondary">
            <Icons.Github aria-hidden />
            View source
          </Button>
        </div>
        <p className="text-foreground-subtle text-xs">MIT licensed · no runtime dependencies</p>
      </CardContent>
    </Card>
  );
}
