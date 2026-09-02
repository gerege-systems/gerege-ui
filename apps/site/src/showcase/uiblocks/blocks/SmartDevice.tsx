import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Icons,
  Slider,
  Switch,
} from '@gerege-systems/ui';

export function SmartDevice() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icons.Zap aria-hidden className="text-accent size-4" />
          <CardTitle>Kitchen island</CardTitle>
          <span className="grow" />
          <Badge tone="success" dot>
            On
          </Badge>
        </div>
        <p className="text-foreground-subtle text-xs">Ambient light · 3 bulbs</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Slider label="Brightness" showValue defaultValue={[72]} formatValue={(v) => `${v}%`} />
        <Slider
          label="Warmth"
          showValue
          min={2200}
          max={6500}
          step={100}
          defaultValue={[3200]}
          formatValue={(v) => `${v}K`}
        />
        <Switch defaultChecked label="Sunset schedule" description="On at dusk, off at 23:30" />
      </CardContent>
    </Card>
  );
}
