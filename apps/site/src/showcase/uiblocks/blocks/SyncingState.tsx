import { Button, Card, CardContent, Spinner } from '@gerege-systems/ui';

export function SyncingState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
        <Spinner size="lg" />
        <h3 className="text-base font-semibold">Syncing your accounts</h3>
        <p className="text-foreground-muted max-w-xs text-sm">
          We are pulling in your latest transactions. This usually takes a few seconds.
        </p>
        <Button variant="secondary" size="sm" className="mt-1">
          Cancel
        </Button>
      </CardContent>
    </Card>
  );
}
