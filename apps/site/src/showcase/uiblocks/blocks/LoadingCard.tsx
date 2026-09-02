import { Card, CardContent, Skeleton } from '@gerege-systems/ui';

/** The shape a card holds while its data is in flight. */
export function LoadingCard() {
  return (
    <Card aria-busy="true" aria-live="polite">
      <CardContent className="flex flex-col gap-4">
        <span className="sr-only">Loading</span>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-9" />
          <Skeleton className="h-9" />
        </div>
      </CardContent>
    </Card>
  );
}
