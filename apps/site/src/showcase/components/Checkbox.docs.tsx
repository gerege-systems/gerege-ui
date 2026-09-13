import { Checkbox } from '@/components/ui/Checkbox';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'checkbox',
  name: 'Checkbox',
  group: 'Inputs',
  description:
    'Tri-state checkbox: checked / unchecked / indeterminate. Use indeterminate for "select all" headers in tables.',
  exports: ['Checkbox'],
  sourceFile: 'Checkbox.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <div className="flex flex-col gap-2">
          <Checkbox label="I agree to the terms" defaultChecked />
          <Checkbox label="Subscribe to product updates" />
          <Checkbox label="Disabled option" disabled />
        </div>
      ),
      code: `<Checkbox label="I agree to the terms" defaultChecked />
<Checkbox label="Subscribe to product updates" />
<Checkbox label="Disabled option" disabled />`,
    },
    {
      title: 'Indeterminate',
      description:
        'Common in table "select all" headers when some — but not all — rows are selected.',
      preview: <Checkbox label="Select 3 of 12" checked="indeterminate" />,
      code: `<Checkbox label="Select 3 of 12" checked="indeterminate" />`,
    },
    {
      title: 'With description',
      preview: (
        <Checkbox
          label="Marketing emails"
          description="Get product news once a month. No more than that."
        />
      ),
      code: `<Checkbox
  label="Marketing emails"
  description="Get product news once a month. No more than that."
/>`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'checked',
          type: `boolean | 'indeterminate'`,
          description: 'Controlled checked state.',
        },
        { name: 'defaultChecked', type: 'boolean', description: 'Uncontrolled initial state.' },
        {
          name: 'onCheckedChange',
          type: '(checked: boolean) => void',
          description: 'Fires on toggle.',
        },
        { name: 'label', type: 'ReactNode', description: 'Primary label, clickable.' },
        { name: 'description', type: 'ReactNode', description: 'Secondary descriptive text.' },
        { name: 'error', type: 'ReactNode', description: 'Error message below the field.' },
        {
          name: 'hideLabel',
          type: 'boolean',
          default: 'false',
          description: 'Visually hide label.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables interaction.',
        },
      ],
    },
  ],
  accessibility: [
    'Backed by @radix-ui/react-checkbox — Space toggles, Tab moves focus.',
    'Indeterminate state announces as "mixed" to screen readers.',
  ],
  keyboard: [
    { key: 'Tab', action: 'Move focus to the checkbox.' },
    { key: 'Space', action: 'Toggle checked / unchecked (also clears indeterminate).' },
    { key: 'Enter', action: 'No effect — Space is the toggle key per WAI-ARIA.' },
  ],
  states: [
    { name: 'Disabled', how: '`disabled` — greyed out and removed from the tab order.' },
    { name: 'Error', how: '`error` renders the message below the label and sets aria-invalid.' },
    {
      name: 'Indeterminate',
      how: '`checked="indeterminate"` — a Minus icon, announced as "mixed".',
    },
  ],
  related: [
    { slug: 'switch', reason: 'For instant-apply boolean settings.' },
    { slug: 'radio-group', reason: 'For mutually-exclusive choices.' },
  ],
};

export default doc;
