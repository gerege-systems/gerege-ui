import { RadioGroup, RadioItem } from '@/components/ui/RadioGroup';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'radio-group',
  name: 'RadioGroup',
  group: 'Inputs',
  description:
    'Mutually-exclusive choice between 2–5 visible options. For more options, use Select. Always exactly one is selected.',
  exports: ['RadioGroup', 'RadioItem'],
  sourceFile: 'RadioGroup.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <RadioGroup defaultValue="monthly" className="flex flex-col gap-2">
          <RadioItem value="monthly" label="Monthly — $12 / month" />
          <RadioItem value="yearly" label="Yearly — $100 / year" description="Save 30%" />
          <RadioItem value="lifetime" label="Lifetime — $499" />
        </RadioGroup>
      ),
      code: `<RadioGroup defaultValue="monthly">
  <RadioItem value="monthly" label="Monthly — $12 / month" />
  <RadioItem value="yearly" label="Yearly — $100 / year" description="Save 30%" />
  <RadioItem value="lifetime" label="Lifetime — $499" />
</RadioGroup>`,
    },
  ],
  api: [
    {
      title: 'RadioGroup',
      rows: [
        { name: 'value', type: 'string', description: 'Controlled selection.' },
        { name: 'defaultValue', type: 'string', description: 'Uncontrolled initial.' },
        {
          name: 'onValueChange',
          type: '(value: string) => void',
          description: 'Fires on selection.',
        },
        {
          name: 'orientation',
          type: `'horizontal' | 'vertical'`,
          default: `'vertical'`,
          description: 'Layout direction.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the whole group.',
        },
      ],
    },
    {
      title: 'RadioItem',
      rows: [
        { name: 'value', type: 'string', required: true, description: 'Reported when selected.' },
        { name: 'label', type: 'ReactNode', description: 'Primary label.' },
        { name: 'description', type: 'ReactNode', description: 'Optional secondary text.' },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Skip in keyboard nav.',
        },
      ],
    },
  ],
  accessibility: [
    'Arrow keys cycle between items (Radix behavior).',
    'Tab focuses the group; arrow keys make the selection.',
  ],
  keyboard: [
    {
      key: 'Tab / Shift+Tab',
      action:
        'Move focus into the group (the checked item, or the first item when none is checked) and out again.',
    },
    {
      key: 'ArrowDown / ArrowUp',
      action: 'Vertical group: focus and select the next / previous item; wraps at the ends.',
    },
    {
      key: 'ArrowRight / ArrowLeft',
      action:
        'Horizontal group (`orientation="horizontal"`): focus and select the next / previous item.',
    },
    { key: 'Space', action: 'Select the focused item when nothing is selected yet.' },
    { key: 'Enter', action: 'No effect — prevented so the enclosing form is not submitted.' },
  ],
  states: [
    {
      name: 'Disabled',
      how: '`disabled` on RadioGroup disables every item; on a RadioItem, only that item.',
    },
    {
      name: 'Error',
      how: '`aria-invalid` on a RadioItem paints the danger border; render the message with FormMessage.',
    },
  ],
  related: [
    { slug: 'select', reason: 'For 5+ options.' },
    { slug: 'switch', reason: 'For binary on/off.' },
  ],
};

export default doc;
