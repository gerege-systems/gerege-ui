import { Textarea } from '@/components/ui/Textarea';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'textarea',
  name: 'Textarea',
  group: 'Inputs',
  description:
    'Multi-line text field with optional auto-resize, label, helper, and error states. Same Form integration story as Input.',
  exports: ['Textarea'],
  sourceFile: 'Textarea.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <Textarea
          label="Description"
          placeholder="What is this project about?"
          rows={3}
          className="w-full max-w-md"
        />
      ),
      code: `<Textarea
  label="Description"
  placeholder="What is this project about?"
  rows={3}
/>`,
    },
    {
      title: 'Auto-resize',
      description: 'autoResize grows the field as content is typed; collapses on delete.',
      preview: (
        <Textarea
          label="Notes"
          autoResize
          defaultValue="Try typing several lines.\nThe field grows to fit."
          className="w-full max-w-md"
        />
      ),
      code: `<Textarea label="Notes" autoResize defaultValue="…" />`,
    },
    {
      title: 'Error',
      preview: (
        <Textarea
          label="Description"
          defaultValue=""
          error="Description is required."
          className="w-full max-w-md"
        />
      ),
      code: `<Textarea
  label="Description"
  error="Description is required."
/>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'label', type: 'ReactNode', description: 'Field label.' },
        { name: 'helperText', type: 'ReactNode', description: 'Hint below the field.' },
        { name: 'error', type: 'ReactNode', description: 'Error message; auto-sets tone="error".' },
        {
          name: 'autoResize',
          type: 'boolean',
          default: 'false',
          description: 'Grow height with content.',
        },
        { name: 'rows', type: 'number', default: '3', description: 'Initial visible rows.' },
        {
          name: 'hideLabel',
          type: 'boolean',
          default: 'false',
          description: 'Visually hide the label.',
        },
        { name: '…rest', type: 'TextareaHTMLAttributes', description: 'Standard textarea props.' },
      ],
    },
  ],
  accessibility: [
    'Same aria-describedby pattern as Input — helperText and error are announced.',
    'autoResize uses requestAnimationFrame to avoid layout thrash while typing.',
  ],
  keyboard: [
    { key: 'Tab / Shift+Tab', action: 'Move focus in / out of the field.' },
    { key: 'Enter', action: 'Insert a line break — there is no built-in submit shortcut.' },
  ],
  states: [
    { name: 'Disabled', how: '`disabled` — native textarea disabled state.' },
    {
      name: 'Error',
      how: '`error` renders the message in place of `helperText` and sets aria-invalid.',
    },
  ],
  related: [
    { slug: 'input', reason: 'For single-line text.' },
    { slug: 'form', reason: 'react-hook-form integration.' },
  ],
};

export default doc;
