import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'select',
  name: 'Select',
  group: 'Inputs',
  description:
    'Single-choice menu for 5–20 fixed options. Radix-backed: keyboard navigation, type-ahead, and screen-reader announcements are built in. For free-text + filter use Combobox.',
  exports: ['Select', 'SelectTrigger', 'SelectContent', 'SelectItem', 'SelectGroup', 'SelectValue'],
  sourceFile: 'Select.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <Select defaultValue="usd">
          <SelectTrigger className="w-full max-w-xs" placeholder="Currency" />
          <SelectContent>
            <SelectItem value="usd">US Dollar (USD)</SelectItem>
            <SelectItem value="eur">Euro (EUR)</SelectItem>
            <SelectItem value="mnt">Mongolian Tögrög (MNT)</SelectItem>
            <SelectItem value="jpy">Japanese Yen (JPY)</SelectItem>
          </SelectContent>
        </Select>
      ),
      code: `<Select defaultValue="usd">
  <SelectTrigger placeholder="Currency" />
  <SelectContent>
    <SelectItem value="usd">US Dollar (USD)</SelectItem>
    <SelectItem value="eur">Euro (EUR)</SelectItem>
    <SelectItem value="mnt">Mongolian Tögrög (MNT)</SelectItem>
    <SelectItem value="jpy">Japanese Yen (JPY)</SelectItem>
  </SelectContent>
</Select>`,
    },
    {
      title: 'Disabled options',
      preview: (
        <Select defaultValue="free">
          <SelectTrigger className="w-full max-w-xs" placeholder="Plan" />
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise" disabled>
              Enterprise — contact sales
            </SelectItem>
          </SelectContent>
        </Select>
      ),
      code: `<SelectItem value="enterprise" disabled>
  Enterprise — contact sales
</SelectItem>`,
    },
    {
      title: 'States',
      description:
        'Error via `tone="error"` on the trigger (pair with a visible message), and disabled.',
      preview: (
        <div className="grid w-full max-w-xs gap-4">
          <div className="flex flex-col gap-1.5">
            <Select>
              <SelectTrigger
                tone="error"
                placeholder="Currency"
                aria-describedby="currency-error"
              />
              <SelectContent>
                <SelectItem value="usd">US Dollar (USD)</SelectItem>
                <SelectItem value="eur">Euro (EUR)</SelectItem>
              </SelectContent>
            </Select>
            <p id="currency-error" className="text-danger-text text-xs">
              Choose a currency.
            </p>
          </div>
          <Select defaultValue="usd" disabled>
            <SelectTrigger placeholder="Currency" />
            <SelectContent>
              <SelectItem value="usd">US Dollar (USD)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
      code: `<Select>
  <SelectTrigger tone="error" placeholder="Currency" aria-describedby="currency-error" />
  …
</Select>
<p id="currency-error" className="text-xs text-danger-text">Choose a currency.</p>

<Select defaultValue="usd" disabled>…</Select>`,
    },
  ],
  api: [
    {
      title: 'Select (root)',
      rows: [
        { name: 'value', type: 'string', description: 'Controlled value.' },
        { name: 'defaultValue', type: 'string', description: 'Uncontrolled initial value.' },
        {
          name: 'onValueChange',
          type: '(value: string) => void',
          description: 'Fires on selection.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the trigger.',
        },
      ],
    },
    {
      title: 'SelectTrigger',
      rows: [
        { name: 'placeholder', type: 'string', description: 'Shown when nothing is selected.' },
        { name: 'className', type: 'string', description: 'Width / spacing overrides.' },
      ],
    },
    {
      title: 'SelectItem',
      rows: [
        {
          name: 'value',
          type: 'string',
          required: true,
          description: 'Unique value reported to onValueChange.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Skip in keyboard navigation.',
        },
      ],
    },
  ],
  accessibility: [
    'Backed by @radix-ui/react-select — full keyboard nav, type-ahead, focus return, and ARIA.',
    'Renders inside a portal — overflow:hidden on ancestors does not clip the menu.',
  ],
  keyboard: [
    { key: 'Enter / Space / ArrowDown / ArrowUp', action: 'Open the listbox from the trigger.' },
    { key: 'ArrowDown / ArrowUp', action: 'Highlight the next / previous item.' },
    { key: 'Home / End', action: 'Highlight the first / last item.' },
    { key: 'A–Z', action: 'Typeahead — jump to the next item starting with that letter.' },
    { key: 'Enter / Space', action: 'Choose the highlighted item and close.' },
    { key: 'Esc', action: 'Close without changing the value.' },
  ],
  states: [
    {
      name: 'Disabled',
      how: '`disabled` on Select (Radix root) disables the trigger; `disabled` on a SelectItem skips that item.',
    },
    { name: 'Error', how: '`tone="error"` on SelectTrigger swaps the border and ring to danger.' },
  ],
  guidelines: {
    do: [
      'Use for 5–15 known options; fewer than 5 suits a RadioGroup, more suits a Combobox with search.',
      'Provide a `placeholder` that names the thing being chosen ("Currency"), not "Select…".',
      'Group long lists with `SelectGroup` labels.',
      'Mark invalid state with `tone="error"` plus a visible message next to the field.',
    ],
    dont: [
      'Use a Select for yes / no — that is a Switch or Checkbox.',
      'Pre-select an arbitrary default just to avoid the empty state.',
      'Put actions ("Create new…") inside the option list.',
      'Rely on the trigger width to truncate long labels silently — widen it or shorten labels.',
    ],
  },
  related: [
    { slug: 'combobox', reason: 'Searchable single-select.' },
    { slug: 'multi-select', reason: 'When users need multiple choices.' },
    { slug: 'radio-group', reason: 'For 2–4 visible options.' },
  ],
};

export default doc;
