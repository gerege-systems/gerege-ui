import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Button } from '@/components/ui/Button';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'popover',
  name: 'Popover',
  group: 'Overlays',
  description:
    'Non-modal floating panel. Use for inline filters, quick edits, color pickers — anything the user might dismiss by clicking away.',
  exports: ['Popover', 'PopoverTrigger', 'PopoverContent'],
  sourceFile: 'Popover.tsx',
  examples: [
    {
      title: 'Basic',
      preview: (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="text-sm">Hi from a popover.</div>
          </PopoverContent>
        </Popover>
      ),
      code: `<Popover>
  <PopoverTrigger asChild>
    <Button>Open popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="text-sm">Hi from a popover.</div>
  </PopoverContent>
</Popover>`,
    },
  ],
  api: [
    {
      title: 'PopoverContent',
      rows: [
        {
          name: 'side',
          type: `'top' | 'right' | 'bottom' | 'left'`,
          default: `'bottom'`,
          description: 'Anchor side.',
        },
        {
          name: 'align',
          type: `'start' | 'center' | 'end'`,
          default: `'center'`,
          description: 'Alignment along the side.',
        },
        { name: 'sideOffset', type: 'number', default: '8', description: 'Gap from the trigger.' },
        {
          name: 'collisionPadding',
          type: 'number',
          default: '8',
          description: 'Min distance from viewport edges.',
        },
      ],
    },
  ],
  accessibility: [
    'Backed by @radix-ui/react-popover — focus moves into content on open.',
    'Esc closes; click-outside closes; trigger receives focus back on close.',
  ],
  keyboard: [
    { key: 'Enter / Space', action: 'On the trigger: open or close the popover.' },
    {
      key: 'Tab / Shift+Tab',
      action:
        'Move through the content (focus lands inside on open; not trapped — the popover is non-modal).',
    },
    { key: 'Esc', action: 'Close and return focus to the trigger.' },
  ],
  related: [
    { slug: 'tooltip', reason: 'For passive hover/focus hints, not actions.' },
    { slug: 'dropdown-menu', reason: 'For action menus.' },
  ],
};

export default doc;
