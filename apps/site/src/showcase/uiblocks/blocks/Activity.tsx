import { Avatar, Card, CardContent, CardHeader, CardTitle } from '@gerege-systems/ui';

const ACTIVITY = [
  { who: 'Oyunchimeg', initials: 'OC', what: 'sent INV-1042', when: '10 minutes ago' },
  { who: 'Batsaikhan', initials: 'BS', what: 'moved the plan to Business', when: '2 hours ago' },
  {
    who: 'Narantuya',
    initials: 'NT',
    what: 'downloaded the August report',
    when: 'Yesterday 17:40',
  },
] as const;

export function Activity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {ACTIVITY.map((a) => (
          <div key={a.what} className="flex gap-3">
            <Avatar fallback={a.initials} size="sm" />
            <div className="flex min-w-0 flex-col">
              <span className="text-sm">
                <strong className="font-medium">{a.who}</strong> {a.what}
              </span>
              <span className="text-foreground-subtle text-xs">{a.when}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
