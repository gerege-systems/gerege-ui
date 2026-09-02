import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Icons,
} from '@gerege-systems/ui';

export function Empty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <EmptyState
          title="No projects yet"
          description="Create your first project, then invite the team."
          action={
            <Button size="sm" leadingIcon={<Icons.Plus />}>
              New project
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}
