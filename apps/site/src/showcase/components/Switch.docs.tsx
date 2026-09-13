import { Switch } from '@/components/ui/Switch';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'switch',
  name: 'Switch',
  group: 'Inputs',
  description:
    'Instant-apply binary toggle. Use for settings that take effect immediately (no Save button). For form fields that submit later, use Checkbox.',
  exports: ['Switch'],
  sourceFile: 'Switch.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <div className="flex flex-col gap-3">
          <Switch label="Email notifications" defaultChecked />
          <Switch label="SMS notifications" />
          <Switch
            label="In-app notifications"
            defaultChecked
            description="Show toast banners in the bottom-right."
          />
        </div>
      ),
      code: `<Switch label="Email notifications" defaultChecked />
<Switch label="SMS notifications" />
<Switch
  label="In-app notifications"
  description="Show toast banners in the bottom-right."
  defaultChecked
/>`,
    },
    {
      title: 'Disabled',
      preview: <Switch label="Two-factor (admin-locked)" defaultChecked disabled />,
      code: `<Switch label="Two-factor (admin-locked)" defaultChecked disabled />`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'checked', type: 'boolean', description: 'Controlled.' },
        { name: 'defaultChecked', type: 'boolean', description: 'Uncontrolled initial.' },
        {
          name: 'onCheckedChange',
          type: '(checked: boolean) => void',
          description: 'Fires immediately on toggle.',
        },
        { name: 'label', type: 'ReactNode', description: 'Primary label.' },
        { name: 'description', type: 'ReactNode', description: 'Secondary text below label.' },
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
    'Backed by @radix-ui/react-switch — Space toggles, label is clickable.',
    'aria-checked reflects state; respects prefers-reduced-motion for the slide.',
  ],
  keyboard: [
    { key: 'Tab', action: 'Move focus to the switch.' },
    { key: 'Space / Enter', action: 'Toggle on / off.' },
  ],
  states: [{ name: 'Disabled', how: '`disabled` — greyed out and removed from the tab order.' }],
  related: [{ slug: 'checkbox', reason: 'For deferred-apply boolean fields.' }],
};

export default doc;
