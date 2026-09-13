import { useState } from 'react';
import { MultiSelect } from '@/components/ui/MultiSelect';
import type { ComponentDoc } from '../registry/types';

const TEAMS = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'design', label: 'Design' },
];

function Demo() {
  const [v, setV] = useState<string[]>(['frontend', 'design']);
  return (
    <MultiSelect
      value={v}
      onChange={setV}
      options={[
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
        { value: 'design', label: 'Design' },
        { value: 'data', label: 'Data' },
        { value: 'devops', label: 'DevOps' },
      ]}
      placeholder="Pick teams"
      className="w-full max-w-xs"
    />
  );
}

const doc: ComponentDoc = {
  slug: 'multi-select',
  name: 'MultiSelect',
  group: 'Inputs',
  description:
    'Chip-based multi-choice picker. Selected items show inline as removable chips. Backspace clears the last chip when the input is empty.',
  i18n: 'Reads `multiSelect.placeholder`, `multiSelect.empty`, `multiSelect.clearAll`, `multiSelect.remove` ("Remove {label}").',
  exports: ['MultiSelect'],
  sourceFile: 'MultiSelect.tsx',
  examples: [
    {
      title: 'Default',
      preview: <Demo />,
      code: `const [v, setV] = useState<string[]>([]);

<MultiSelect
  value={v}
  onChange={setV}
  options={[
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'design', label: 'Design' },
  ]}
  placeholder="Pick teams"
/>`,
    },
    {
      title: 'States',
      description: 'Error (with message), disabled, and an empty option list via `emptyText`.',
      preview: (
        <div className="grid w-full max-w-xs gap-4">
          <MultiSelect
            value={[]}
            onChange={() => {}}
            options={TEAMS}
            label="Teams"
            error="Choose at least one team."
            placeholder="Pick teams"
          />
          <MultiSelect
            value={['design']}
            onChange={() => {}}
            options={TEAMS}
            label="Teams"
            disabled
            placeholder="Pick teams"
          />
          <MultiSelect
            value={[]}
            onChange={() => {}}
            options={[]}
            label="Teams"
            emptyText="No teams in this workspace."
            placeholder="Pick teams"
          />
        </div>
      ),
      code: `<MultiSelect label="Teams" error="Choose at least one team." … />
<MultiSelect label="Teams" disabled … />
<MultiSelect label="Teams" options={[]} emptyText="No teams in this workspace." … />`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'value',
          type: 'string[]',
          required: true,
          description: 'Controlled list of selected values.',
        },
        {
          name: 'onChange',
          type: '(v: string[]) => void',
          required: true,
          description: 'Fires on add / remove.',
        },
        {
          name: 'options',
          type: 'Array<{ value: string; label: string }>',
          required: true,
          description: 'Choices.',
        },
        { name: 'placeholder', type: 'string', description: 'Empty-state placeholder.' },
        {
          name: 'maxVisibleChips',
          type: 'number',
          default: '3',
          description: 'How many chips render inline before "+N".',
        },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
      ],
    },
  ],
  accessibility: [
    'Each chip has aria-label="Remove <label>" and is keyboard-removable with Backspace from the input.',
    'Type-ahead filters the dropdown. Enter adds the highlighted option.',
  ],
  keyboard: [
    { key: 'Type', action: 'Open the list and filter options.' },
    { key: 'ArrowDown / ArrowUp', action: 'Highlight the next / previous option.' },
    {
      key: 'Enter',
      action: 'Toggle the highlighted option — the field stays open for more picks.',
    },
    { key: 'Backspace', action: 'With an empty query: remove the last chip.' },
    { key: 'Esc', action: 'Close the list.' },
    { key: 'Tab', action: 'Move focus out (closes the list).' },
  ],
  states: [
    { name: 'Empty', how: '`emptyText` when no option matches the search.' },
    { name: 'Disabled', how: '`disabled` on the field, or per option.' },
    { name: 'Error', how: '`error` renders the message and sets aria-invalid.' },
  ],
  related: [
    { slug: 'tag-input', reason: 'For free-text tags (no fixed options).' },
    { slug: 'combobox', reason: 'For single selection.' },
  ],
};

export default doc;
