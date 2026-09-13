import { Search, Settings, Trash2, Plus } from '@/icons';
import { IconButton } from '@/components/ui/IconButton';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'icon-button',
  name: 'IconButton',
  group: 'Buttons',
  description:
    'Square icon-only action. Use in toolbars, cards, table rows — anywhere the meaning is unambiguous from the icon alone. aria-label is required.',
  exports: ['IconButton'],
  sourceFile: 'IconButton.tsx',
  examples: [
    {
      title: 'Variants',
      preview: (
        <div className="flex items-center gap-2">
          <IconButton aria-label="Search" icon={<Search />} />
          <IconButton aria-label="Settings" variant="outline" icon={<Settings />} />
          <IconButton aria-label="Delete" variant="ghost" icon={<Trash2 />} />
        </div>
      ),
      code: `<IconButton aria-label="Search" icon={<Search />} />
<IconButton aria-label="Settings" variant="outline" icon={<Settings />} />
<IconButton aria-label="Delete" variant="ghost" icon={<Trash2 />} />`,
    },
    {
      title: 'Sizes',
      preview: (
        <div className="flex items-center gap-2">
          <IconButton aria-label="Add" size="sm" icon={<Plus />} />
          <IconButton aria-label="Add" size="md" icon={<Plus />} />
          <IconButton aria-label="Add" size="lg" icon={<Plus />} />
          <IconButton aria-label="Add" size="xl" icon={<Plus />} />
        </div>
      ),
      code: `<IconButton aria-label="Add" size="sm" icon={<Plus />} />
<IconButton aria-label="Add" size="md" icon={<Plus />} />
<IconButton aria-label="Add" size="lg" icon={<Plus />} />
<IconButton aria-label="Add" size="xl" icon={<Plus />} />`,
    },
    {
      title: 'With Tooltip',
      description: 'Always pair with a Tooltip when the icon meaning is even slightly ambiguous.',
      preview: (
        <div className="text-foreground-muted text-xs">
          See <code className="bg-background-muted rounded px-1">Tooltip</code> docs for the
          pattern.
        </div>
      ),
      code: `<Tooltip label="Delete project">
  <IconButton aria-label="Delete" icon={<Trash2 />} variant="ghost" />
</Tooltip>`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'icon',
          type: 'ReactNode',
          required: true,
          description: 'The Lucide (or any) icon to render.',
        },
        {
          name: 'aria-label',
          type: 'string',
          required: true,
          description: 'Required accessible name.',
        },
        {
          name: 'variant',
          type: `'primary' | 'outline' | 'ghost'`,
          default: `'primary'`,
          description: 'Visual style.',
        },
        { name: 'size', type: `'sm' | 'md' | 'lg'`, default: `'md'`, description: 'Square size.' },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          description: 'Replace icon with a spinner.',
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
    'aria-label is enforced at the type level — TypeScript will fail compile if omitted.',
    'Pair with Tooltip for any non-universal icon.',
  ],
  keyboard: [
    { key: 'Tab / Shift+Tab', action: 'Move focus; a `loading` button stays in the tab order.' },
    { key: 'Enter / Space', action: 'Activate (`onClick`). Blocked while `loading`.' },
  ],
  states: [
    {
      name: 'Loading',
      how: '`loading` — spinner replaces the icon, aria-busy + aria-disabled, focus kept, clicks blocked.',
    },
    { name: 'Disabled', how: '`disabled` — native disabled, not focusable.' },
  ],
  guidelines: {
    do: [
      'Always pass a descriptive `aria-label` — it is the only accessible name.',
      'Pair with a Tooltip so sighted users learn the action too.',
      'Use for common, recognisable actions: close, more, edit, delete.',
    ],
    dont: [
      'Use an icon-only button for the primary action of a page — give it a text label.',
      'Mix icon styles (filled + outline) in one toolbar.',
      'Rely on the icon alone for destructive actions without a confirmation step.',
    ],
  },
  related: [
    { slug: 'button', reason: 'For labelled actions.' },
    { slug: 'tooltip', reason: 'For icon affordance hints.' },
  ],
};

export default doc;
