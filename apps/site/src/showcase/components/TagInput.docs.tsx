import { TagInput } from '@/components/ui/TagInput';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'tag-input',
  name: 'TagInput',
  group: 'Inputs',
  description:
    'Free-text chip input. Type a tag, press Enter or comma to add. Backspace removes the last tag when the input is empty. Use MultiSelect when tags must come from a fixed list.',
  i18n: 'Reads `tagInput.placeholder` and `tagInput.remove` ("Remove {tag}").',
  exports: ['TagInput'],
  sourceFile: 'TagInput.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <TagInput defaultValue={['frontend', 'react', 'typescript']} className="w-full max-w-md" />
      ),
      code: `<TagInput defaultValue={['frontend', 'react', 'typescript']} />`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'value', type: 'string[]', description: 'Controlled tags.' },
        { name: 'defaultValue', type: 'string[]', description: 'Uncontrolled initial tags.' },
        {
          name: 'onChange',
          type: '(tags: string[]) => void',
          description: 'Fires on add / remove.',
        },
        { name: 'placeholder', type: 'string', description: 'Empty-state placeholder.' },
        { name: 'max', type: 'number', description: 'Maximum number of tags.' },
        {
          name: 'allowDuplicates',
          type: 'boolean',
          default: 'false',
          description: 'Allow the same tag twice.',
        },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
      ],
    },
  ],
  accessibility: [
    'Backspace in an empty input removes the last chip; each chip also has a labelled remove button.',
    "Tab moves from the input to each chip's remove button in order.",
  ],
  keyboard: [
    {
      key: 'Enter / ,',
      action: 'Add the typed text as a tag (change the keys with `separators`).',
    },
    { key: 'Backspace', action: 'On an empty input: remove the last tag.' },
    {
      key: 'Tab / Shift+Tab',
      action: "Move between each chip's remove button and the text input.",
    },
    { key: 'Enter / Space', action: "On a chip's × button: remove that tag." },
  ],
  states: [
    { name: 'Disabled', how: '`disabled` — the input and every chip button are disabled.' },
    {
      name: 'Error',
      how: '`error` — `true` paints the danger border; a node also renders the message and wires aria-describedby.',
    },
    {
      name: 'Full',
      how: '`max` reached — further entries are ignored silently; show the limit in `description`.',
    },
  ],
  related: [{ slug: 'multi-select', reason: 'When tags come from a known set.' }],
};

export default doc;
