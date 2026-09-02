import { Card, CardContent, CardHeader, CardTitle, FileUpload, Progress } from '@gerege-systems/ui';

export function Upload() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attachments</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <FileUpload multiple accept="image/*" hint="PNG or JPG, up to 5MB" />
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-foreground-muted grow truncate">report-2026-08.pdf</span>
            <span className="text-foreground-subtle tabular-nums">42%</span>
          </div>
          <Progress value={42} size="sm" />
        </div>
      </CardContent>
    </Card>
  );
}
