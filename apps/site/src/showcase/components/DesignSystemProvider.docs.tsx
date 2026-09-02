import { useState } from 'react';
import { DesignSystemProvider, brandPresets } from '@/components/ui/DesignSystemProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { Switch } from '@/components/ui/Switch';
import { mnStrings } from '@/lib/strings.mn';
import { useStrings } from '@/hooks/use-strings';
import type { ComponentDoc } from '../registry/types';

function StringsDemo() {
  const [mn, setMn] = useState(true);
  const [page, setPage] = useState(2);
  return (
    <div className="w-full max-w-lg space-y-4">
      <Switch checked={mn} onCheckedChange={setMn} label="Монгол" />
      <DesignSystemProvider strings={mn ? mnStrings : undefined}>
        <div className="flex flex-wrap items-center gap-4">
          <Pagination
            page={page}
            pageCount={5}
            pageSize={10}
            totalItems={48}
            onPageChange={setPage}
          />
          <Spinner />
          <CurrentStrings />
        </div>
      </DesignSystemProvider>
    </div>
  );
}

function CurrentStrings() {
  const s = useStrings();
  return (
    <Badge tone="neutral" variant="outline">
      spinner.loading = “{s.spinner.loading}”
    </Badge>
  );
}

const doc: ComponentDoc = {
  slug: 'design-system-provider',
  name: 'DesignSystemProvider',
  group: 'Utilities',
  description:
    'Scopes brand tokens and UI strings to a subtree. Optional — every component works without it; add one at the app root to change the accent, or to translate the library’s built-in labels (Mongolian ships as `mnStrings`).',
  exports: ['DesignSystemProvider', 'brandPresets', 'mnStrings', 'defaultStrings', 'useStrings'],
  sourceFile: 'DesignSystemProvider.tsx',
  examples: [
    {
      title: 'Brand tokens',
      description:
        'Pass a flat record to override CSS variables in both modes, or a `{ light, dark }` pair (the built-in presets) so dark mode gets its own values. Tokens nest — an inner provider overrides only what it sets.',
      preview: (
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <DesignSystemProvider tokens={brandPresets.violet}>
            <Button>Violet</Button>
          </DesignSystemProvider>
          <DesignSystemProvider tokens={brandPresets.emerald}>
            <Button>Emerald</Button>
          </DesignSystemProvider>
          <DesignSystemProvider tokens={{ 'radius-md': '999px' }}>
            <Button variant="outline">Pill radius</Button>
          </DesignSystemProvider>
        </div>
      ),
      code: `import { DesignSystemProvider, brandPresets } from '@gerege-systems/ui';

<DesignSystemProvider tokens={brandPresets.violet}>
  <App />
</DesignSystemProvider>

// Ad-hoc overrides — any token from theme.css, with or without the "--" prefix
<DesignSystemProvider tokens={{ 'radius-md': '999px' }}>…</DesignSystemProvider>`,
    },
    {
      title: 'i18n: strings',
      description:
        'Every label the library renders on its own (close buttons, placeholders, pagination copy, chart summaries, relative time) comes from `UiStrings`. `strings` is a deep partial merged over the parent provider and the English defaults; pass `mnStrings` for Mongolian. Per-component props still win.',
      preview: <StringsDemo />,
      code: `import { DesignSystemProvider, mnStrings } from '@gerege-systems/ui';

// Whole app in Mongolian
<DesignSystemProvider strings={mnStrings}>
  <App />
</DesignSystemProvider>

// Override a few keys only (deep-merged over the defaults)
<DesignSystemProvider
  strings={{
    pagination: { showing: '{total}-с {from}–{to}' },
    spinner: { loading: 'Ачаалж байна' },
  }}
>
  <Table />
</DesignSystemProvider>`,
    },
    {
      title: 'useStrings',
      description:
        'Read the resolved strings from your own components so custom UI stays in the same language as the library. Returns `defaultStrings` without a provider.',
      preview: <CurrentStrings />,
      code: `import { useStrings } from '@gerege-systems/ui';

function EmptyRow() {
  const s = useStrings();
  return <td>{s.dataGrid.empty}</td>;
}`,
    },
  ],
  api: [
    {
      title: 'Strings helpers',
      rows: [
        {
          name: 'mnStrings',
          type: 'UiStrings',
          description: 'Complete Mongolian (Cyrillic) translation.',
        },
        {
          name: 'defaultStrings',
          type: 'UiStrings',
          description: 'The English defaults — useful as a reference for every key.',
        },
        {
          name: 'formatString',
          type: '(template: string, vars: Record<string, unknown>) => string',
          description: 'Expands `{name}` placeholders; use it when rendering your own overrides.',
        },
      ],
    },
  ],
  accessibility: [
    'Renders a `display: contents` wrapper, so it adds no box to the layout and does not interfere with landmark or heading structure.',
    'Translating strings is what makes aria-labels (close, dismiss, pagination) match the page language — set `<html lang>` to match.',
  ],
  guidelines: {
    do: [
      'Mount one provider at the root; nest another only to scope a different brand (embedded widget, tenant preview).',
      'Override the semantic tokens (`accent`, `accent-subtle`, `ring`) as a light/dark pair — see `brandPresets` for the full set.',
    ],
    dont: [
      'Pass hex colours for individual components; change the token once.',
      'Re-create the provider object each render (`strings={{…}}` inline is fine, but hoist large tables).',
    ],
  },
  related: [
    { slug: 'relative-time', reason: 'Reads `relativeTime.*` from the provider.' },
    { slug: 'format', reason: 'Locale-fixed number / date helpers.' },
  ],
};

export default doc;
