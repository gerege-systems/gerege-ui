'use client';

/**
 * Every user-facing string the library renders on its own (aria-labels,
 * placeholders, empty states, …). Consumers override any subset through
 * `<DesignSystemProvider strings={…}>`; per-component props still win.
 *
 * Placeholders use `{name}` and are expanded with `formatString`.
 */
export interface UiStrings {
  alert: { dismiss: string };
  snackbar: { dismiss: string };
  dialog: { close: string };
  sheet: { close: string };
  toast: { close: string; region: string };
  drawer: { close: string };
  command: { suggestions: string };
  calendar: {
    previous: string;
    next: string;
    chooseMonth: string;
    chooseYear: string;
    nav: string;
  };
  confirmationDialog: { confirm: string; cancel: string };
  commandDialog: { title: string };
  carousel: { label: string; previous: string; next: string; slide: string };
  pagination: {
    showing: string;
    rowsPerPage: string;
    first: string;
    last: string;
    prev: string;
    next: string;
    page: string;
    perPage: string;
    nav: string;
  };
  breadcrumbs: { label: string; collapsed: string };
  stepper: { label: string; complete: string; current: string; upcoming: string };
  topNav: { label: string };
  sidebar: { label: string; collapse: string; expand: string; collapseShort: string };
  select: { placeholder: string };
  combobox: {
    placeholder: string;
    searchPlaceholder: string;
    empty: string;
    clear: string;
    loadError: string;
  };
  multiSelect: { placeholder: string; empty: string; clearAll: string; remove: string };
  tagInput: { placeholder: string; remove: string };
  dataGrid: {
    filterPlaceholder: string;
    empty: string;
    /** Screen-reader label for an empty cell rendered as an em dash. */
    emptyCell: string;
    columns: string;
    columnVisibility: string;
    filterRows: string;
  };
  datePicker: { pickDate: string; pickRange: string };
  fileUpload: {
    drop: string;
    remove: string;
    bytes: string;
    kilobytes: string;
    megabytes: string;
    /** Shown under the drop zone when a file exceeds `maxSize`; `{max}` is the formatted limit. */
    tooLarge: string;
    /** Shown under the drop zone when a file does not match `accept`. */
    wrongType: string;
  };
  input: { clear: string; showPassword: string; hidePassword: string };
  slider: { minimum: string; maximum: string; value: string };
  spinner: { loading: string };
  errorState: {
    notFoundTitle: string;
    notFoundDescription: string;
    serverTitle: string;
    serverDescription: string;
    genericTitle: string;
    genericDescription: string;
    forbiddenTitle: string;
    forbiddenDescription: string;
    tryAgain: string;
  };
  avatar: { status: string; more: string };
  tree: { label: string };
  /** Accessible name of the focusable scroll wrapper around the table. */
  table: { scrollRegion: string };
  /** Accessible name of the focusable scroll viewport. */
  scrollArea: { region: string };
  chart: {
    series: string;
    noData: string;
    loading: string;
    empty: string;
    error: string;
    viewAsTable: string;
    hideTable: string;
    tableCaption: string;
    summary: string;
    point: string;
    seriesNav: string;
  };
  relativeTime: {
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
    inMinutes: string;
    inHours: string;
    inDays: string;
  };
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

export const defaultStrings: UiStrings = {
  alert: { dismiss: 'Dismiss' },
  snackbar: { dismiss: 'Dismiss' },
  dialog: { close: 'Close' },
  sheet: { close: 'Close' },
  toast: { close: 'Close', region: 'Notifications' },
  drawer: { close: 'Close' },
  command: { suggestions: 'Suggestions' },
  calendar: {
    previous: 'Previous month',
    next: 'Next month',
    chooseMonth: 'Choose the month',
    chooseYear: 'Choose the year',
    nav: 'Calendar navigation',
  },
  confirmationDialog: { confirm: 'Confirm', cancel: 'Cancel' },
  commandDialog: { title: 'Command palette' },
  carousel: { label: 'Carousel', previous: 'Previous', next: 'Next', slide: '{index} of {count}' },
  pagination: {
    showing: 'Showing {from}–{to} of {total}',
    rowsPerPage: 'Rows per page',
    first: 'Go to first page',
    last: 'Go to last page',
    prev: 'Previous page',
    next: 'Next page',
    page: 'Page {n}',
    perPage: '{n} / page',
    nav: 'Pagination',
  },
  breadcrumbs: { label: 'Breadcrumb', collapsed: 'Hidden items' },
  stepper: { label: 'Progress', complete: 'Completed', current: 'Current', upcoming: 'Upcoming' },
  topNav: { label: 'Primary' },
  sidebar: {
    label: 'Primary',
    collapse: 'Collapse sidebar',
    expand: 'Expand sidebar',
    collapseShort: 'Collapse',
  },
  select: { placeholder: 'Select…' },
  combobox: {
    placeholder: 'Select…',
    searchPlaceholder: 'Search…',
    empty: 'No results.',
    clear: 'Clear selection',
    loadError: "Couldn't load options.",
  },
  multiSelect: {
    placeholder: 'Select…',
    empty: 'No results.',
    clearAll: 'Clear all',
    remove: 'Remove {label}',
  },
  tagInput: { placeholder: 'Add and press Enter', remove: 'Remove {tag}' },
  dataGrid: {
    filterPlaceholder: 'Filter…',
    empty: 'No results.',
    emptyCell: 'Empty',
    columns: 'Columns',
    columnVisibility: 'Column visibility',
    filterRows: 'Filter rows',
  },
  datePicker: { pickDate: 'Pick a date', pickRange: 'Pick a range' },
  fileUpload: {
    drop: 'Drop files here, or click to browse',
    remove: 'Remove {name}',
    bytes: '{n} B',
    kilobytes: '{n} KB',
    megabytes: '{n} MB',
    tooLarge: 'File is larger than {max}.',
    wrongType: 'That file type is not accepted.',
  },
  input: { clear: 'Clear input', showPassword: 'Show password', hidePassword: 'Hide password' },
  slider: { minimum: 'Minimum', maximum: 'Maximum', value: 'Value' },
  spinner: { loading: 'Loading' },
  errorState: {
    notFoundTitle: 'Page not found',
    notFoundDescription: "We couldn't find what you were looking for.",
    serverTitle: 'Something went wrong',
    serverDescription: "We're looking into it. Please try again in a moment.",
    genericTitle: 'Unexpected error',
    genericDescription: 'Something interrupted this action.',
    forbiddenTitle: "You don't have access",
    forbiddenDescription: 'Ask an admin to grant the permission.',
    tryAgain: 'Try again',
  },
  avatar: { status: 'Status: {status}', more: '{n} more' },
  tree: { label: 'Tree' },
  table: { scrollRegion: 'Scrollable table' },
  scrollArea: { region: 'Scrollable content' },
  chart: {
    series: 'Series {n}',
    noData: 'no data',
    loading: 'Loading chart…',
    empty: 'No data to display.',
    error: "Couldn't load this chart.",
    viewAsTable: 'View as table',
    hideTable: 'Hide table',
    tableCaption: 'Data table for {name}',
    summary: '{name}: {count} points, min {min}, max {max}, last {x}: {y}',
    point: '{x}: {y}',
    seriesNav: '{name}, {count} points. Use arrow keys to move between points.',
  },
  relativeTime: {
    justNow: 'just now',
    minutesAgo: '{n} min ago',
    hoursAgo: '{n} h ago',
    daysAgo: '{n} d ago',
    inMinutes: 'in {n} min',
    inHours: 'in {n} h',
    inDays: 'in {n} d',
  },
};

/** Expand `{name}` placeholders. Unknown placeholders are left as-is. */
export function formatString(
  template: string,
  vars: Record<string, string | number | undefined>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const v = vars[key];
    return v === undefined ? match : String(v);
  });
}

/** Deep-merge a partial override on top of a complete strings object. `undefined` leaves are ignored. */
export function mergeStrings(base: UiStrings, override?: DeepPartial<UiStrings>): UiStrings {
  if (!override) return base;
  return deepMerge(
    base as unknown as Record<string, unknown>,
    override as Record<string, unknown>,
  ) as unknown as UiStrings;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    const current = out[key];
    out[key] = isPlainObject(value) && isPlainObject(current) ? deepMerge(current, value) : value;
  }
  return out;
}
