import { BarChart, Card, CardContent, CardHeader, CardTitle } from '@gerege-systems/ui';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

const SALES = [3.2, 4.4, 2.6, 5.3, 4.0, 6.0, 4.6, 3.5, 5.1, 4.2];

const TARGET = [2.3, 3.1, 1.9, 3.8, 2.8, 4.2, 3.2, 2.2, 3.6, 2.7];

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly revenue</CardTitle>
        <p className="text-foreground-subtle text-xs">2026 · millions of ₮ · UTC+8</p>
      </CardHeader>
      <CardContent>
        <BarChart
          height={180}
          showTableToggle
          aria-label="Monthly revenue against target"
          series={[
            { name: 'Revenue', data: MONTHS.map((m, i) => ({ x: m, y: SALES[i] })) },
            { name: 'Target', data: MONTHS.map((m, i) => ({ x: m, y: TARGET[i] })) },
          ]}
        />
      </CardContent>
    </Card>
  );
}
