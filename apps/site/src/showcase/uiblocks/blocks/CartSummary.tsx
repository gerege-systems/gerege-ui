import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  IconButton,
  Icons,
  Input,
  Separator,
  formatMNT,
} from '@gerege-systems/ui';

const LINES = [
  { name: 'Field notebook', qty: 2, price: 24_000 },
  { name: 'Desk mat, wool', qty: 1, price: 89_000 },
] as const;

export function CartSummary() {
  const subtotal = LINES.reduce((sum, l) => sum + l.qty * l.price, 0);
  const shipping = 8_000;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cart</CardTitle>
        <p className="text-foreground-subtle text-xs">3 items</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {LINES.map((l) => (
          <div key={l.name} className="flex items-center gap-3">
            <div className="bg-background-muted text-foreground-subtle flex size-12 shrink-0 items-center justify-center rounded-md">
              <Icons.Package aria-hidden className="size-4" />
            </div>
            <div className="flex min-w-0 grow flex-col">
              <span className="truncate text-sm">{l.name}</span>
              <span className="text-foreground-subtle text-xs tabular-nums">
                {formatMNT(l.price)} each
              </span>
            </div>
            <Input
              aria-label={`Quantity for ${l.name}`}
              inputMode="numeric"
              defaultValue={String(l.qty)}
              className="w-14 text-center"
            />
            <IconButton
              aria-label={`Remove ${l.name}`}
              icon={<Icons.Trash2 />}
              size="sm"
              variant="ghost"
            />
          </div>
        ))}
        <Separator />
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex">
            <span className="text-foreground-muted grow">Subtotal</span>
            <span className="tabular-nums">{formatMNT(subtotal)}</span>
          </div>
          <div className="flex">
            <span className="text-foreground-muted grow">Shipping</span>
            <span className="tabular-nums">{formatMNT(shipping)}</span>
          </div>
          <div className="flex font-medium">
            <span className="grow">Total</span>
            <span className="tabular-nums">{formatMNT(subtotal + shipping)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Checkout</Button>
      </CardFooter>
    </Card>
  );
}
