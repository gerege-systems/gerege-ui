import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { DatePicker, DateRangePicker } from '@/components/ui/DatePicker';
import type { ComponentDoc } from '../registry/types';

function SingleDemo() {
  const [d, setD] = useState<Date | undefined>(new Date());
  return (
    <DatePicker className="w-full max-w-xs" value={d} onChange={setD} placeholder="Pick a date" />
  );
}

function RangeDemo() {
  const [range, setRange] = useState<DateRange | undefined>(() => ({
    from: new Date(),
    to: new Date(Date.now() + 7 * 86400000),
  }));
  return (
    <DateRangePicker
      className="w-full max-w-xs"
      value={range}
      onChange={setRange}
      placeholder="Pick a range"
    />
  );
}

const doc: ComponentDoc = {
  slug: 'date-picker',
  name: 'DatePicker',
  group: 'Inputs',
  description:
    'Calendar dropdown for selecting a single date (DatePicker) or a date range (DateRangePicker). Built on react-day-picker v9.',
  i18n: 'Reads `datePicker.pickDate` / `datePicker.pickRange` (trigger placeholders) plus the `calendar.*` keys.',
  exports: ['DatePicker', 'DateRangePicker'],
  sourceFile: 'DatePicker.tsx',
  examples: [
    {
      title: 'Single date',
      preview: <SingleDemo />,
      code: `<DatePicker className="w-full max-w-xs" value={d} onChange={setD} placeholder="Pick a date" />`,
    },
    {
      title: 'Range',
      preview: <RangeDemo />,
      code: `<DateRangePicker className="w-full max-w-xs" value={range} onChange={setRange} placeholder="Pick a range" />`,
    },
  ],
  api: [
    {
      title: 'DatePicker',
      rows: [
        { name: 'value', type: 'Date | undefined', description: 'Selected date.' },
        {
          name: 'onChange',
          type: '(date: Date | undefined) => void',
          required: true,
          description: 'Fires on selection.',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: `'Pick a date'`,
          description: 'Shown when nothing is picked.',
        },
        { name: 'fromDate / toDate', type: 'Date', description: 'Bounds of the selectable range.' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
      ],
    },
    {
      title: 'DateRangePicker',
      rows: [
        {
          name: 'value',
          type: '{ from?: Date; to?: Date } | undefined',
          description: 'Selected range.',
        },
        {
          name: 'onChange',
          type: '(range: { from?: Date; to?: Date } | undefined) => void',
          required: true,
          description: 'Fires on selection.',
        },
      ],
    },
  ],
  accessibility: [
    'Calendar uses react-day-picker — full ARIA grid semantics.',
    'Arrow keys move between days; PgUp/PgDn move months; Shift+PgUp/PgDn move years.',
  ],
  keyboard: [
    { key: 'Enter / Space', action: 'Open the calendar popover from the trigger.' },
    { key: 'ArrowLeft / ArrowRight', action: 'Move focus one day back / forward.' },
    { key: 'ArrowUp / ArrowDown', action: 'Move focus one week back / forward.' },
    { key: 'PageUp / PageDown', action: 'Previous / next month (with Shift: year).' },
    { key: 'Enter / Space', action: 'Select the focused day (range picker: start, then end).' },
    { key: 'Esc', action: 'Close the popover without changing the value.' },
  ],
  related: [{ slug: 'calendar', reason: 'For inline calendar without trigger.' }],
};

export default doc;
