import { useState } from 'react';
import { AtSign, Search, Lock } from '@/icons';
import { Input } from '@/components/ui/Input';
import type { ComponentDoc } from '../registry/types';

function SearchDemo() {
  const [q, setQ] = useState('design system');
  return (
    <Input
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder="Search…"
      prefix={<Search className="size-4" />}
      clearable
      onClear={() => setQ('')}
      hideLabel
      label="Search"
      className="w-full max-w-xs"
    />
  );
}

const doc: ComponentDoc = {
  slug: 'input',
  name: 'Input',
  group: 'Inputs',
  description:
    'Text-style field with label, helper / error, prefix / suffix, clear button, and built-in password toggle. Works inside Form (RHF) without extra wiring.',
  i18n: 'Reads `input.clear`, `input.showPassword`, `input.hidePassword` (built-in affordance buttons).',
  exports: ['Input'],
  sourceFile: 'Input.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <Input
          label="Work email"
          placeholder="you@company.com"
          helperText="We never share this."
          className="w-full max-w-xs"
        />
      ),
      code: `<Input
  label="Work email"
  placeholder="you@company.com"
  helperText="We never share this."
/>`,
    },
    {
      title: 'Error state',
      preview: (
        <Input
          label="Work email"
          defaultValue="not-an-email"
          error="Please enter a valid email."
          className="w-full max-w-xs"
        />
      ),
      code: `<Input
  label="Work email"
  defaultValue="not-an-email"
  error="Please enter a valid email."
/>`,
    },
    {
      title: 'Prefix + suffix',
      description: 'Use to inline non-interactive affordances like icons, units, or domain hints.',
      preview: (
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Input label="Handle" prefix={<AtSign className="size-4" />} placeholder="gerege" />
          <Input
            label="Domain"
            placeholder="acme"
            suffix={<span className="text-foreground-subtle">.com</span>}
          />
        </div>
      ),
      code: `<Input
  label="Handle"
  prefix={<AtSign className="size-4" />}
  placeholder="gerege"
/>

<Input
  label="Domain"
  placeholder="acme"
  suffix={<span className="text-foreground-subtle">.com</span>}
/>`,
    },
    {
      title: 'Password',
      description: 'When type="password" a show/hide toggle is rendered automatically.',
      preview: (
        <Input
          type="password"
          label="Password"
          defaultValue="super-secret"
          prefix={<Lock className="size-4" />}
          className="w-full max-w-xs"
        />
      ),
      code: `<Input
  type="password"
  label="Password"
  defaultValue="super-secret"
  prefix={<Lock className="size-4" />}
/>`,
    },
    {
      title: 'Searchable',
      description: 'clearable + onClear gives type-to-search inputs a one-click reset.',
      preview: <SearchDemo />,
      code: `const [q, setQ] = useState('');

<Input
  value={q}
  onChange={(e) => setQ(e.target.value)}
  placeholder="Search…"
  prefix={<Search className="size-4" />}
  clearable
  onClear={() => setQ('')}
  hideLabel
  label="Search"
/>`,
    },
    {
      title: 'Sizes',
      preview: (
        <div className="flex w-full max-w-xs flex-col gap-2">
          <Input label="Small" size="sm" placeholder="sm" hideLabel />
          <Input label="Medium" size="md" placeholder="md (default)" hideLabel />
          <Input label="Large" size="lg" placeholder="lg" hideLabel />
        </div>
      ),
      code: `<Input size="sm" placeholder="sm" />
<Input size="md" placeholder="md" />
<Input size="lg" placeholder="lg" />`,
    },
    {
      title: 'Disabled',
      preview: (
        <Input
          label="Read-only"
          defaultValue="locked@company.com"
          disabled
          className="w-full max-w-xs"
        />
      ),
      code: `<Input
  label="Read-only"
  defaultValue="locked@company.com"
  disabled
/>`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'label',
          type: 'ReactNode',
          description:
            'Field label. Required for a11y; set hideLabel to render visually-hidden only.',
        },
        {
          name: 'hideLabel',
          type: 'boolean',
          default: 'false',
          description: 'Visually hide the label but keep it in the accessibility tree.',
        },
        {
          name: 'helperText',
          type: 'ReactNode',
          description: 'Hint shown below the input. Hidden while error is set.',
        },
        {
          name: 'error',
          type: 'ReactNode',
          description: 'Error message. Auto-sets tone="error" and aria-invalid.',
        },
        {
          name: 'prefix',
          type: 'ReactNode',
          description: 'Inline left affordance (icon, currency symbol, …).',
        },
        { name: 'suffix', type: 'ReactNode', description: 'Inline right affordance.' },
        {
          name: 'clearable',
          type: 'boolean',
          default: 'false',
          description: 'Shows a clear button when value is non-empty.',
        },
        {
          name: 'onClear',
          type: '() => void',
          description: 'Called when the clear button is clicked.',
        },
        {
          name: 'tone',
          type: `'default' | 'error'`,
          default: `'default'`,
          description: 'Visual tone. Auto-set by `error`.',
        },
        {
          name: 'size',
          type: `'sm' | 'md' | 'lg'`,
          default: `'md'`,
          description: 'Height + padding.',
        },
        {
          name: 'type',
          type: `'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'`,
          default: `'text'`,
          description: 'Native input type. password auto-shows a toggle.',
        },
        {
          name: '…rest',
          type: 'InputHTMLAttributes',
          description: 'Standard input props (value, onChange, onBlur, name, …).',
        },
      ],
    },
  ],
  accessibility: [
    'label + input pair generates aria-describedby for helperText and error so screen readers announce them.',
    'error sets aria-invalid="true" automatically.',
    'Password toggle button has its own aria-label that updates between "Show password" and "Hide password".',
    'Use Form + FormField from react-hook-form for form-level validation; Input slots in unchanged.',
  ],
  guidelines: {
    do: [
      'Put a visible `label` above every field; use `hideLabel` only when layout truly forbids it.',
      'Show validation errors below the field via `error` — it is linked with aria-describedby.',
      'Use the right `type` (email, tel, url, search) so mobile keyboards and autofill work.',
      'Keep `helperText` to one sentence and show it before the user makes a mistake.',
    ],
    dont: [
      'Use `placeholder` as the label — it disappears as soon as the user types.',
      'Validate on every keystroke for formats that are only valid when complete; validate on blur.',
      'Put units or currency in the placeholder — use `prefix` / `suffix`.',
      'Make required fields discoverable only by an asterisk in the placeholder.',
    ],
  },
  related: [
    { slug: 'textarea', reason: 'For multi-line text.' },
    { slug: 'form', reason: 'react-hook-form integration.' },
    { slug: 'combobox', reason: 'For searchable choice inputs.' },
  ],
};

export default doc;
