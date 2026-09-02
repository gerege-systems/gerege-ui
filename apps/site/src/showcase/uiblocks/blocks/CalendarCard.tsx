import { Calendar, Card, CardContent, CardHeader, CardTitle } from '@gerege-systems/ui';

export function CalendarCard() {
  return (
    <Card padding="sm">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar mode="single" />
      </CardContent>
    </Card>
  );
}
