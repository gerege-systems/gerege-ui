import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Textarea,
} from '@gerege-systems/ui';

export function ProfileSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <p className="text-foreground-subtle text-xs">Manage your profile information.</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input
          label="Name"
          defaultValue="Oyunchimeg"
          helperText="Shown wherever you are mentioned. You can remove it at any time."
          autoComplete="off"
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Public email</span>
          <Select defaultValue="work">
            <SelectTrigger aria-label="Public email" />
            <SelectContent>
              <SelectItem value="work">oyunchimeg@gerege.mn</SelectItem>
              <SelectItem value="none">Do not show an email</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-foreground-subtle text-xs">
            Verified addresses are managed in email settings.
          </p>
        </div>
        <Textarea
          label="Bio"
          rows={3}
          placeholder="Tell people a little about yourself"
          helperText="You can @mention other people and teams."
        />
      </CardContent>
      <CardFooter>
        <Button>Save profile</Button>
      </CardFooter>
    </Card>
  );
}
