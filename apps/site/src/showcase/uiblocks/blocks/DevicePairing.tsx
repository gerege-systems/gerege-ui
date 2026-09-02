import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Icons,
  Kbd,
} from '@gerege-systems/ui';

export function DevicePairing() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan to link your phone</CardTitle>
        <p className="text-foreground-subtle text-xs">
          Open the mobile app and scan this code to pair the device.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {/* Placeholder mark, not a real code — a scannable QR would imply a
            working pairing endpoint behind it. */}
        <div
          role="img"
          aria-label="Pairing code placeholder"
          className="bg-background-muted grid size-40 grid-cols-6 gap-1 rounded-md p-3"
        >
          {Array.from({ length: 36 }, (_, i) => (
            <span
              key={i}
              className={i % 3 === 0 || i % 7 === 0 ? 'bg-foreground rounded-[2px]' : ''}
            />
          ))}
        </div>
        <div className="text-foreground-muted flex items-center gap-2 text-sm">
          Or enter <Kbd>7F2K</Kbd> <Kbd>9QD1</Kbd>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm" variant="secondary">
          <Icons.Copy aria-hidden />
          Copy code
        </Button>
        <Button size="sm" variant="ghost">
          Send by email
        </Button>
      </CardFooter>
    </Card>
  );
}
