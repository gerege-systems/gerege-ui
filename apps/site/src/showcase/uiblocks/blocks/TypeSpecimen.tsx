import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@gerege-systems/ui';

export function TypeSpecimen() {
  return (
    <Card>
      <CardHeader>
        <span className="text-foreground-subtle font-mono text-[0.625rem] tracking-wider uppercase">
          Body · Geist
        </span>
        <CardTitle className="text-2xl leading-tight tracking-tight">
          Designing with rhythm and hierarchy.
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-foreground-muted text-sm">
          A settled body style keeps long-form content readable and balances the visual weight of
          headings against everything around them.
        </p>
        <p className="text-foreground-muted text-sm">
          Spacing and cadence let a paragraph be scanned without feeling dense — Өө Үү Ий included,
          which is where most type choices fall over.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full">
          Share feedback
        </Button>
      </CardFooter>
    </Card>
  );
}
