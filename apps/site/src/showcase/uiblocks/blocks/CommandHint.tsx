import { Card, CardContent, CardHeader, CardTitle, Input, Kbd, Icons } from '@gerege-systems/ui';

export function CommandHint() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input
          type="search"
          placeholder="Orders, customers, invoice numbers…"
          prefix={<Icons.Search />}
        />
        <div className="text-foreground-muted flex items-center gap-2 text-sm">
          Open anywhere: <Kbd>⌘</Kbd>
          <span className="text-foreground-subtle">+</span>
          <Kbd>K</Kbd>
        </div>
      </CardContent>
    </Card>
  );
}
