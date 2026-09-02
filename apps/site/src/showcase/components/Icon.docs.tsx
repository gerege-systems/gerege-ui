import { Icon, iconNames } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import type { ComponentDoc } from '../registry/types';

const SAMPLE = [
  'rocket',
  'calendar',
  'search',
  'settings',
  'bell',
  'heart',
  'star',
  'cloud-upload',
  'credit-card',
  'shield-check',
  'chart-line',
  'message-circle',
] as const;

const doc: ComponentDoc = {
  slug: 'icon',
  name: 'Icon',
  group: 'Data Display',
  description:
    'Name-addressed lucide icon — every lucide icon by its kebab-case name, no imports. Icons are code-split and lazy-loaded on first use, so referencing the full set costs nothing up front. For hot paths rendered on first paint, statically imported icons from the Icons namespace skip the lazy hop.',
  exports: ['Icon', 'iconNames'],
  importPath: '@gerege-systems/ui/icon',
  sourceFile: 'Icon.tsx',
  examples: [
    {
      title: 'By name',
      description: `Any of the ${iconNames.length} lucide icons, addressed by kebab-case name. The name prop autocompletes.`,
      preview: (
        <div className="grid grid-cols-6 gap-3 sm:grid-cols-12">
          {SAMPLE.map((n) => (
            <div
              key={n}
              className="border-border text-foreground-muted flex items-center justify-center rounded-md border p-2.5"
              title={n}
            >
              <Icon name={n} className="size-4" />
            </div>
          ))}
        </div>
      ),
      code: `<Icon name="rocket" className="size-4" />
<Icon name="calendar" className="size-4" />
<Icon name="cloud-upload" className="size-4" />
<Icon name="shield-check" className="size-4" />`,
    },
    {
      title: 'Inside other components',
      description: 'Pass it anywhere a ReactNode icon slot is expected.',
      preview: (
        <div className="flex items-center gap-2">
          <Button leadingIcon={<Icon name="mail" />}>Send invite</Button>
          <Button variant="outline" trailingIcon={<Icon name="arrow-right" />}>
            Continue
          </Button>
        </div>
      ),
      code: `<Button leadingIcon={<Icon name="mail" />}>Send invite</Button>
<Button variant="outline" trailingIcon={<Icon name="arrow-right" />}>Continue</Button>`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'name',
          type: 'IconName',
          required: true,
          description:
            'Lucide icon name in kebab-case, e.g. "chevrons-up-down". Typed union — autocompletes.',
        },
        {
          name: 'size',
          type: 'number | string',
          default: '24',
          description: 'Pixel size; prefer Tailwind size-* via className.',
        },
        {
          name: 'strokeWidth',
          type: 'number',
          default: '2',
          description: 'Stroke width. The design system mostly uses 1.5.',
        },
        {
          name: 'fallback',
          type: 'ReactNode',
          description:
            'Shown while the icon chunk loads (first use only). Defaults to an invisible same-size square.',
        },
        {
          name: 'iconNames',
          type: 'IconName[]',
          description: 'Exported list of all names — useful for icon pickers.',
        },
      ],
    },
  ],
  accessibility: [
    'Decorative icons are aria-hidden by lucide default; pass aria-label when the icon is the only label.',
  ],
  related: [{ slug: 'icon-button', reason: 'Icon-only action button.' }],
};

export default doc;
