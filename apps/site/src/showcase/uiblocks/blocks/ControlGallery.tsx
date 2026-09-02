import {
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  Icons,
  Input,
  RadioGroup,
  RadioItem,
  Slider,
  Switch,
  Textarea,
} from '@gerege-systems/ui';

/** Every control at once — the fastest way to judge a style or a palette. */
export function ControlGallery() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Button</Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
          <Button size="sm" variant="ghost">
            Ghost
          </Button>
        </div>

        <div className="border-border flex items-center gap-3 rounded-lg border p-3">
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-medium">Two-factor authentication</span>
            <span className="text-foreground-subtle text-xs">Verify by email or phone.</span>
          </div>
          <span className="grow" />
          <Button size="sm" variant="secondary">
            Enable
          </Button>
        </div>

        <Slider aria-label="Volume" defaultValue={[45]} />
        <Input placeholder="Name" prefix={<Icons.Search />} />
        <Textarea placeholder="Message" rows={2} />

        <div className="flex flex-wrap items-center gap-3">
          <Badge>Badge</Badge>
          <Badge tone="neutral">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <RadioGroup defaultValue="a" className="flex items-center gap-3">
            <RadioItem value="a" label="One" />
            <RadioItem value="b" label="Two" />
          </RadioGroup>
          <Checkbox defaultChecked label="Checked" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" variant="secondary">
            Alert dialog
          </Button>
          <Button size="sm" variant="secondary">
            Button group
            <Icons.ChevronUp aria-hidden />
          </Button>
          <span className="grow" />
          <Switch defaultChecked aria-label="Enabled" hideLabel label="Enabled" />
        </div>
      </CardContent>
    </Card>
  );
}
