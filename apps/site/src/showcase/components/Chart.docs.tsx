import { AreaChart, BarChart, LineChart } from '@/components/ui/Chart';
import type { ComponentDoc } from '../registry/types';

const data = [22, 18, 26, 30, 35, 41, 38, 45, 50, 48, 56, 60].map((y, i) => ({ x: i, y }));

const doc: ComponentDoc = {
  slug: 'chart',
  name: 'Chart',
  group: 'Data Display',
  description:
    'Minimal SVG charts — LineChart, AreaChart and BarChart. Light axis + gridlines, keyboard-navigable points, and a hidden data table for screen readers: purpose-built for inline trend illustration. For data-dense analytics, integrate a charting library.',
  exports: ['LineChart', 'AreaChart', 'BarChart'],
  i18n: 'Reads `chart.*` (loading / empty / error copy, table toggle, summary, point and series-navigation sentences).',
  sourceFile: 'Chart.tsx',
  examples: [
    {
      title: 'LineChart',
      preview: <LineChart data={data} caption="MRR over time" className="w-full max-w-md" />,
      code: `const data = [22, 18, 26, 30, 35, 41].map((y, i) => ({ x: i, y }));

<LineChart data={data} caption="MRR over time" />`,
    },
    {
      title: 'BarChart',
      preview: (
        <BarChart
          data={data.slice(0, 6)}
          caption="Weekly signups"
          height={80}
          className="w-full max-w-md"
        />
      ),
      code: `<BarChart data={data.slice(0, 6)} caption="Weekly signups" height={80} />`,
    },
    {
      title: 'AreaChart',
      description: 'LineChart with the area under each series filled — same props.',
      preview: <AreaChart data={data} caption="Active users" className="w-full max-w-md" />,
      code: `<AreaChart data={data} caption="Active users" />`,
    },
    {
      title: 'States',
      description:
        'Pass `state` and the chart keeps its height: `loading` draws a skeleton, `empty` and `error` replace the plot with a short message (error is announced via role="alert") — never draw bare axes.',
      preview: (
        <div className="grid w-full gap-4 lg:grid-cols-3">
          <LineChart data={[]} caption="Loading" state="loading" height={120} />
          <LineChart data={[]} caption="Empty" state="empty" height={120} />
          <LineChart data={[]} caption="Error" state="error" height={120} />
        </div>
      ),
      code: `<LineChart data={data} caption="MRR" state={isLoading ? 'loading' : error ? 'error' : data.length === 0 ? 'empty' : undefined} />`,
    },
    {
      title: 'Custom labels',
      description:
        'Override the generated accessible text per chart with `labels` — the `<desc>` summary, the live-region point label and the series tab-stop name. For app-wide copy use `DesignSystemProvider strings.chart` instead.',
      preview: (
        <LineChart
          data={data}
          caption="Орлого"
          className="w-full max-w-md"
          labels={{
            point: (_name, x, y) => `${x}-р сар: ${y}₮`,
            series: (name, count) => `${name}, ${count} цэг. Сумаар шилжинэ.`,
          }}
        />
      ),
      code: `<LineChart
  data={data}
  caption="Орлого"
  labels={{
    point: (name, x, y) => \`\${x}-р сар: \${y}₮\`,
    series: (name, count) => \`\${name}, \${count} цэг. Сумаар шилжинэ.\`,
  }}
/>`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'data',
          type: 'Array<{ x: number | string; y: number }>',
          required: true,
          description: 'Data points.',
        },
        {
          name: 'caption',
          type: 'string',
          description: 'Accessible caption — required for non-decorative charts.',
        },
        { name: 'height', type: 'number', default: '160', description: 'SVG height in px.' },
        {
          name: 'state',
          type: "'loading' | 'empty' | 'error'",
          description:
            'Replace the drawing with a skeleton / empty / error message at the same height.',
        },
        { name: 'className', type: 'string', description: 'Width / spacing overrides.' },
      ],
    },
  ],
  accessibility: [
    'Renders <figure> with <figcaption> for the caption — screen readers announce it.',
    'For data-dense analytics, prefer a dedicated library (Recharts / Visx) with proper interactive tables.',
  ],
  states: [
    { name: 'Loading', how: '`state="loading"` replaces the drawing with a skeleton.' },
    {
      name: 'Empty',
      how: '`state="empty"` — a role="status" message ("No data to display.") at the same height.',
    },
    {
      name: 'Error',
      how: '`state="error"` — a role="alert" message; add a retry button outside the chart.',
    },
  ],
  guidelines: {
    do: [
      'Theming: series colours default to the six categorical tokens var(--chart-1) … var(--chart-6) (DEFAULT_CHART_COLORS). Override them per brand in globals.css rather than passing hex values via `colors`.',
    ],
    dont: ['Rely on colour alone to distinguish series — pair with a caption or legend.'],
  },
};

export default doc;
