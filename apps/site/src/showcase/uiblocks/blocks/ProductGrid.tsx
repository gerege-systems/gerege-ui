import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Icons,
  formatMNT,
} from '@gerege-systems/ui';

const PRODUCTS = [
  { name: 'Field notebook', price: 24_000, tag: 'New' },
  { name: 'Desk mat, wool', price: 89_000, tag: null },
  { name: 'Cable set', price: 36_000, tag: 'Low stock' },
  { name: 'Travel pouch', price: 52_000, tag: null },
] as const;

export function ProductGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <p className="text-foreground-subtle text-xs">4 of 128</p>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {PRODUCTS.map((p) => (
          <div key={p.name} className="flex flex-col gap-2">
            <div className="bg-background-muted text-foreground-subtle flex aspect-4/3 items-center justify-center rounded-md">
              <Icons.Package aria-hidden className="size-6" />
            </div>
            <div className="flex items-start gap-2">
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">{p.name}</span>
                <span className="text-foreground-subtle text-xs tabular-nums">
                  {formatMNT(p.price)}
                </span>
              </div>
              <span className="grow" />
              {p.tag && <Badge tone={p.tag === 'New' ? 'accent' : 'warning'}>{p.tag}</Badge>}
            </div>
            <Button size="sm" variant="secondary" className="w-full">
              Add to cart
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
