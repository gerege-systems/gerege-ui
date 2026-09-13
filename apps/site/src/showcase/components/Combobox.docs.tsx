import { useState } from 'react';
import { Combobox } from '@/components/ui/Combobox';
import type { ComponentDoc } from '../registry/types';

const LANGS = [
  { value: 'go', label: 'Go' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'rs', label: 'Rust' },
];

function Demo() {
  const [v, setV] = useState<string | null>('ts');
  return (
    <Combobox
      className="w-full max-w-xs"
      value={v}
      onChange={setV}
      options={[
        { value: 'go', label: 'Go' },
        { value: 'ts', label: 'TypeScript' },
        { value: 'rs', label: 'Rust' },
        { value: 'py', label: 'Python' },
        { value: 'java', label: 'Java' },
      ]}
      placeholder="Language"
    />
  );
}

const doc: ComponentDoc = {
  slug: 'combobox',
  name: 'Combobox',
  group: 'Inputs',
  description:
    'Searchable single-select. Use when option count is large (20+) or when filter-as-you-type is faster than scanning a menu. Supports async option loading.',
  i18n: 'Reads `combobox.placeholder`, `combobox.searchPlaceholder`, `combobox.empty`, `combobox.clear`, `combobox.loadError` — props override per instance.',
  exports: ['Combobox'],
  sourceFile: 'Combobox.tsx',
  examples: [
    {
      title: 'Default',
      preview: <Demo />,
      code: `const [v, setV] = useState<string | null>('ts');

<Combobox
  className="w-full max-w-xs"
  value={v}
  onChange={setV}
  options={[
    { value: 'go', label: 'Go' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'rs', label: 'Rust' },
  ]}
  placeholder="Language"
/>`,
    },
    {
      title: 'States',
      description: 'Error (with message), disabled, and an empty result list via `emptyText`.',
      preview: (
        <div className="grid w-full max-w-xs gap-4">
          <Combobox
            value={null}
            onChange={() => {}}
            options={LANGS}
            label="Language"
            error="Pick a language to continue."
            placeholder="Language"
          />
          <Combobox
            value="ts"
            onChange={() => {}}
            options={LANGS}
            label="Language"
            disabled
            placeholder="Language"
          />
          <Combobox
            value={null}
            onChange={() => {}}
            options={[]}
            label="Language"
            emptyText="No languages configured yet."
            placeholder="Language"
          />
        </div>
      ),
      code: `<Combobox label="Language" error="Pick a language to continue." … />
<Combobox label="Language" disabled … />
<Combobox label="Language" options={[]} emptyText="No languages configured yet." … />`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'value',
          type: 'string | null',
          required: true,
          description: 'Controlled selection.',
        },
        {
          name: 'onChange',
          type: '(v: string | null) => void',
          required: true,
          description: 'Fires on select / clear.',
        },
        {
          name: 'options',
          type: 'Array<{ value: string; label: string; disabled?: boolean }>',
          required: true,
          description: 'Choices to render.',
        },
        { name: 'placeholder', type: 'string', description: 'Shown when value is null.' },
        {
          name: 'onSearch',
          type: '(q: string) => void',
          description: 'Use for async option fetching.',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: 'Show spinner in dropdown while options load.',
        },
        {
          name: 'emptyText',
          type: 'string',
          default: `'No results'`,
          description: 'Empty-state message.',
        },
      ],
    },
  ],
  accessibility: [
    'Type-ahead filters as you type; arrow keys navigate filtered results.',
    'Esc closes; Enter selects highlighted option.',
  ],
  keyboard: [
    {
      key: 'Enter / Space / ArrowDown',
      action: 'On the trigger: open the list and focus the search input.',
    },
    { key: 'Type', action: 'Filter options as you type (or call `loadOptions` when async).' },
    { key: 'ArrowDown / ArrowUp', action: 'Highlight the next / previous option.' },
    { key: 'Enter', action: 'Select the highlighted option and close.' },
    { key: 'Esc', action: 'Close the list without changing the value.' },
    { key: 'Tab', action: 'Move focus out (closes the list).' },
  ],
  states: [
    { name: 'Loading', how: 'Automatic — a spinner shows while `loadOptions` is pending.' },
    {
      name: 'Error',
      how: '`loadErrorText` shows when `loadOptions` rejects (default from strings).',
    },
    { name: 'Empty', how: '`emptyText` when nothing matches the query.' },
    { name: 'Disabled', how: '`disabled` on the field, or per option.' },
    { name: 'Invalid', how: '`error` renders the message and sets aria-invalid.' },
  ],
  related: [
    { slug: 'select', reason: 'For fixed 5–20 options without search.' },
    { slug: 'multi-select', reason: 'For multiple selections.' },
  ],
};

export default doc;
