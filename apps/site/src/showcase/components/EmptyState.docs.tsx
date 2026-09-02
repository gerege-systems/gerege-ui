import { Folder, Plus, Search } from '@/icons';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import * as Illustrations from '@/illustrations';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'empty-state',
  name: 'EmptyState',
  group: 'Feedback',
  description:
    'Friendly "nothing here yet" panel. Defaults to the built-in InboxEmpty line illustration; pass `icon` for a compact look or `illustration` to swap in another one. Always pair with at least one next-step action.',
  exports: ['EmptyState'],
  sourceFile: 'EmptyState.tsx',
  examples: [
    {
      title: 'Default (built-in illustration)',
      description: 'No icon or illustration prop — falls back to the InboxEmpty line illustration.',
      preview: (
        <EmptyState
          title="No projects yet"
          description="Create your first project to get started."
          action={
            <Button size="sm" leadingIcon={<Plus />}>
              New project
            </Button>
          }
        />
      ),
      code: `<EmptyState
  title="No projects yet"
  description="Create your first project to get started."
  action={<Button size="sm" leadingIcon={<Plus />}>New project</Button>}
/>`,
    },
    {
      title: 'Compact (icon)',
      description:
        'Pass `icon` for a small Lucide glyph in a 48 px circular container. Use for table cells and sidebar panes.',
      preview: (
        <EmptyState
          icon={<Folder className="size-6" />}
          title="No items"
          description="Drag a file in or create one."
        />
      ),
      code: `<EmptyState
  icon={<Folder className="size-6" />}
  title="No items"
  description="Drag a file in or create one."
/>`,
    },
    {
      title: 'Heading level',
      description:
        'The title is an `<h3>` by default. Match the surrounding outline with `headingLevel` — `2` when the empty state *is* the page, `4` inside a card.',
      preview: (
        <EmptyState
          icon={<Search className="size-6" />}
          title="No results"
          description="Try a different search term."
          headingLevel={4}
        />
      ),
      code: `<EmptyState icon={<Search />} title="No results" headingLevel={4} />`,
    },
    {
      title: 'Custom illustration',
      description: 'Use any of the built-in line illustrations via the `Illustrations` namespace.',
      preview: (
        <EmptyState
          illustration={<Illustrations.NoSearchResults className="size-32" />}
          title="No results"
          description="Try a different search term or clear your filters."
        />
      ),
      code: `import { Illustrations } from '@gerege/ui';

<EmptyState
  illustration={<Illustrations.NoSearchResults className="size-32" />}
  title="No results"
  description="Try a different search term or clear your filters."
/>`,
    },
    {
      title: 'States',
      description:
        'First-run vs. filtered. First-run explains the value and offers the create action; a filtered-empty result keeps it compact and offers to clear the filter.',
      preview: (
        <div className="grid w-full gap-4 lg:grid-cols-2">
          <EmptyState
            title="No projects yet"
            description="Projects group your work and your team's access. Create one to start tracking."
            action={
              <Button size="sm" leadingIcon={<Plus />}>
                New project
              </Button>
            }
            secondaryAction={
              <Button size="sm" variant="ghost">
                Import
              </Button>
            }
          />
          <EmptyState
            icon={<Search className="size-6" />}
            title="No results for “billing”"
            description="Try a different term or clear the search."
            action={
              <Button size="sm" variant="outline">
                Clear search
              </Button>
            }
          />
        </div>
      ),
      code: `{/* First-run */}
<EmptyState
  title="No projects yet"
  description="Projects group your work and your team's access. Create one to start tracking."
  action={<Button size="sm" leadingIcon={<Plus />}>New project</Button>}
  secondaryAction={<Button size="sm" variant="ghost">Import</Button>}
/>

{/* Filtered — compact, secondary action clears the filter */}
<EmptyState
  icon={<Search className="size-6" />}
  title="No results for “billing”"
  description="Try a different term or clear the search."
  action={<Button size="sm" variant="outline">Clear search</Button>}
/>`,
    },
  ],
  api: [
    {
      rows: [
        { name: 'title', type: 'ReactNode', required: true, description: 'Primary line.' },
        { name: 'description', type: 'ReactNode', description: 'Body copy.' },
        {
          name: 'illustration',
          type: 'ReactNode',
          description:
            'Full-size illustration. Takes precedence over `icon`. If neither is set, the default InboxEmpty illustration is used.',
        },
        {
          name: 'icon',
          type: 'ReactNode',
          description: 'Small Lucide-sized icon in a 48 px circular container.',
        },
        { name: 'action', type: 'ReactNode', description: 'Primary CTA — usually a Button.' },
        {
          name: 'secondaryAction',
          type: 'ReactNode',
          description: 'Optional secondary action next to the primary.',
        },
      ],
    },
  ],
  guidelines: {
    do: [
      'Say what is missing and why it matters in one or two sentences.',
      'Provide a primary next step (`action`) — usually the create button.',
      'Use a different message for a filtered-empty result ("No results for “x”") with a Clear-filters action.',
      'Use the compact `icon` form inside tables, cards and side panes.',
    ],
    dont: [
      'Apologise or blame the user ("Oops, nothing here!").',
      'Use the large illustration inside a table cell or narrow panel.',
      'Hide the filters or table header when a filtered list is empty — the user cannot clear them.',
      'Leave the empty state without any action at all.',
    ],
  },
  accessibility: [
    'The title renders as an <h3>; place it inside a section whose heading level precedes it.',
    'Illustrations are decorative (aria-hidden) — all meaning lives in the title, description and action.',
    'Keep the primary action a real Button so it is keyboard-reachable and announced.',
  ],
  related: [{ slug: 'error-state', reason: 'For error / 404 / 500 scenarios.' }],
};

export default doc;
