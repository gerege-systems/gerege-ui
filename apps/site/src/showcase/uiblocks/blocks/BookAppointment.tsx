import {
  Alert,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gerege-systems/ui';

const SLOTS = ['09:00', '10:30', '11:00', '13:30'] as const;

export function BookAppointment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an appointment</CardTitle>
        <p className="text-foreground-subtle text-xs">Dr. S. Chen · Cardiology</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <span className="text-sm font-medium">Available on 2026-09-18</span>
        {/* Radio semantics, not buttons: exactly one slot can be chosen. */}
        <div role="radiogroup" aria-label="Time slot" className="flex flex-wrap gap-2">
          {SLOTS.map((s, i) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={i === 0}
              className={
                i === 0
                  ? 'bg-accent text-on-accent focus-visible:ring-ring rounded-md px-3 py-1.5 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none'
                  : 'border-border-input text-foreground hover:bg-background-muted focus-visible:ring-ring rounded-md border px-3 py-1.5 text-sm focus-visible:ring-2 focus-visible:outline-none'
              }
            >
              {s}
            </button>
          ))}
        </div>
        <Alert title="First visit?">Please arrive 15 minutes early with your ID.</Alert>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Book appointment</Button>
      </CardFooter>
    </Card>
  );
}
