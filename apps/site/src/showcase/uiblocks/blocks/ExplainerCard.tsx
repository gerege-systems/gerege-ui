import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Icons,
} from '@gerege-systems/ui';

const POINTS = [
  'Buy a fixed amount on a fixed day, whatever the price.',
  'You stop trying to time the market, because you cannot.',
  'Volatility works for you: the same money buys more when prices fall.',
] as const;

export function ExplainerCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dollar-cost averaging</CardTitle>
        <p className="text-foreground-subtle text-xs">A way to build a position over time.</p>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2.5">
          {POINTS.map((p) => (
            <li key={p} className="text-foreground-muted flex items-start gap-2 text-sm">
              <Icons.Check aria-hidden className="text-success-foreground mt-0.5 size-4 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm" variant="secondary">
          Set up a schedule
        </Button>
        <Button size="sm" variant="ghost">
          Read more
        </Button>
      </CardFooter>
    </Card>
  );
}
