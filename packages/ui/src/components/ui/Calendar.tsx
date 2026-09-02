'use client';

import { useMemo, type ChangeEvent } from 'react';
import {
  DayPicker,
  getDefaultClassNames,
  type DayPickerProps,
  type DropdownProps,
} from 'react-day-picker';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, ChevronLeft, ChevronRight } from '@/icons';
import { Select, SelectContent, SelectItem } from './Select';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';

// RDP's structural class names (`rdp-*`). Its stylesheet is intentionally NOT
// imported — every visual rule below is ours, so there is no cascade to fight
// and no CSS side effect for tree-shaken consumers.
const rdp = getDefaultClassNames();

export type CalendarProps = DayPickerProps & { className?: string };

/**
 * Month / year dropdown rendered with the design-system Select instead of a
 * native `<select>` — the native popup is unbounded (a century of years fills
 * the screen on macOS) and can't be styled. Radix gives us a max-height,
 * internal scrolling, and auto-scroll to the selected year.
 */
function CalendarDropdown({
  options = [],
  value,
  onChange,
  disabled,
  'aria-label': ariaLabel,
}: DropdownProps) {
  const selected = options.find((opt) => opt.value === Number(value));

  return (
    <Select
      value={value === undefined ? undefined : String(value)}
      onValueChange={(v) => {
        // RDP's handler expects a native select change event — fake the shape.
        onChange?.({ target: { value: v } } as unknown as ChangeEvent<HTMLSelectElement>);
      }}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        className={cn(
          'border-border bg-card text-foreground inline-flex h-7 items-center gap-1 rounded-md border px-2 text-sm font-medium',
          'hover:bg-background-muted focus-visible:ring-ring focus-visible:ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
        )}
      >
        <SelectPrimitive.Value>{selected?.label}</SelectPrimitive.Value>
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="size-3.5 opacity-60" aria-hidden />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectContent className="max-h-64">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={String(opt.value)} disabled={opt.disabled}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const navButton = cn(
  'pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-background-muted',
  'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  'disabled:opacity-40 disabled:pointer-events-none',
);

/**
 * Standalone calendar surface. Used by DatePicker, but can also be embedded
 * directly in popovers, sheets, or inline forms. Wraps `react-day-picker` v9.
 *
 * Not a forwardRef: RDP v9's `DayPicker` is a plain function component and
 * exposes no root ref, so a forwarded ref would silently be dropped.
 */
export function Calendar({
  className,
  classNames,
  captionLayout = 'dropdown',
  startMonth,
  endMonth,
  labels,
  weekStartsOn = 1,
  ...props
}: CalendarProps) {
  const strings = useStrings();
  // Bound the month/year dropdowns. Consumers can narrow this with
  // startMonth / endMonth; the default spans a century back to a decade ahead
  // so the year dropdown is useful for both birthdays and future scheduling.
  // Memoised — fresh Date identities every render defeat RDP's internal
  // memoisation and re-derive the navigable range on each paint.
  const { start, end } = useMemo(() => {
    const now = new Date();
    return {
      start: startMonth ?? new Date(now.getFullYear() - 100, 0, 1),
      end: endMonth ?? new Date(now.getFullYear() + 10, 11, 31),
    };
  }, [startMonth, endMonth]);

  return (
    <DayPicker
      data-slot="calendar"
      showOutsideDays
      weekStartsOn={weekStartsOn}
      captionLayout={captionLayout}
      startMonth={start}
      endMonth={end}
      className={cn('border-border bg-card inline-block rounded-lg border p-3', className)}
      labels={{
        labelPrevious: () => strings.calendar.previous,
        labelNext: () => strings.calendar.next,
        labelMonthDropdown: () => strings.calendar.chooseMonth,
        labelYearDropdown: () => strings.calendar.chooseYear,
        labelNav: () => strings.calendar.nav,
        ...labels,
      }}
      classNames={{
        ...rdp,
        root: cn(rdp.root, 'relative'),
        months: 'relative flex flex-col gap-4 sm:flex-row sm:gap-6',
        month: 'flex flex-col gap-3',
        month_caption: 'relative flex h-8 items-center justify-center px-8',
        dropdowns: 'flex items-center justify-center gap-2',
        caption_label: 'flex items-center gap-1 text-sm font-medium',
        // The caption is positioned and painted after the nav, so the nav must
        // sit above it (z-10) for its buttons to receive clicks. The container
        // itself ignores pointer events so the centred dropdowns underneath
        // stay clickable — only the buttons opt back in.
        nav: 'pointer-events-none absolute inset-x-0 top-0 z-10 flex h-8 items-center justify-between',
        button_previous: navButton,
        button_next: navButton,
        month_grid: 'w-full border-collapse',
        weekdays: 'grid grid-cols-7',
        weekday:
          'h-8 w-9 text-center text-xs font-medium uppercase tracking-wide text-foreground-subtle',
        week: 'mt-0.5 grid grid-cols-7',
        day: 'relative h-9 w-9 p-0 text-center',
        day_button: cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm hover:bg-background-muted',
          'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        ),
        // RDP 9 puts aria-selected / the modifier classes on the <td>, so the
        // button is styled through its cell. `[&_button:hover]` outranks the
        // button's own `hover:` rule so selected days keep the accent on hover.
        selected: cn(
          '[&_button]:bg-accent [&_button]:text-on-accent [&_button:hover]:bg-accent-hover',
          '[&_button]:focus-visible:ring-offset-accent-soft',
        ),
        today: '[&_button]:border [&_button]:border-border',
        outside: 'text-foreground-subtle',
        disabled: 'opacity-40 pointer-events-none',
        range_start: '[&_button]:rounded-r-none',
        range_end: '[&_button]:rounded-l-none',
        range_middle:
          '[&_button]:bg-accent-soft [&_button]:text-foreground [&_button:hover]:bg-accent-soft [&_button]:rounded-none',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Dropdown: CalendarDropdown,
        Chevron: ({ orientation }) => {
          if (orientation === 'left') return <ChevronLeft className="size-4" />;
          if (orientation === 'right') return <ChevronRight className="size-4" />;
          // up/down — used for the month/year dropdown carets
          return <ChevronDown className="size-3.5 opacity-60" />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';
