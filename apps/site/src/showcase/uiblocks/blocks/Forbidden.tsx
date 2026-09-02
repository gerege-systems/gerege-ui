import { Button, Card, CardContent, ErrorState } from '@gerege-systems/ui';

export function Forbidden() {
  return (
    <Card>
      <CardContent>
        <ErrorState
          variant="403"
          headingLevel={3}
          action={<Button variant="secondary">Back to dashboard</Button>}
        />
      </CardContent>
    </Card>
  );
}
