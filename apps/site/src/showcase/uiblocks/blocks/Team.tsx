import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@gerege-systems/ui';

const TEAM = [
  { name: 'Oyunchimeg', initials: 'OC', role: 'Owner', status: 'online' },
  { name: 'Batsaikhan', initials: 'BS', role: 'Admin', status: 'busy' },
  { name: 'Narantuya', initials: 'NT', role: 'Member', status: 'offline' },
] as const;

export function Team() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team</CardTitle>
        <p className="text-foreground-subtle text-xs">3 members</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {TEAM.map((m) => (
          <div key={m.name} className="flex items-center gap-3">
            <Avatar fallback={m.initials} status={m.status} />
            <span className="min-w-0 grow truncate text-sm">{m.name}</span>
            <Select defaultValue={m.role}>
              <SelectTrigger size="sm" aria-label={`Role for ${m.name}`} className="w-28" />
              <SelectContent>
                <SelectItem value="Owner">Owner</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary" className="w-full">
          Invite member
        </Button>
      </CardFooter>
    </Card>
  );
}
