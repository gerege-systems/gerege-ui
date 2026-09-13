import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import * as Illustrations from '@/illustrations';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'error-state',
  name: 'ErrorState',
  group: 'Feedback',
  description:
    'Full-page error scaffolding for 404, 500, and generic crash screens. Each variant ships with its own line illustration; override `title`, `description`, `illustration`, or `action` as needed.',
  i18n: 'Reads `errorState.*` — the default title / description per variant and `errorState.tryAgain`.',
  exports: ['ErrorState'],
  sourceFile: 'ErrorState.tsx',
  examples: [
    {
      title: '404',
      preview: <ErrorState variant="404" />,
      code: `<ErrorState variant="404" />`,
      surfaceClassName: 'min-h-[340px]',
    },
    {
      title: '500 with retry',
      preview: <ErrorState variant="500" onRetry={() => {}} />,
      code: `<ErrorState variant="500" onRetry={() => refetch()} />`,
      surfaceClassName: 'min-h-[340px]',
    },
    {
      title: '403 permission denied',
      description:
        'Use when the route exists but the signed-in user lacks access — say so plainly and offer a way back rather than pretending the page is missing.',
      preview: (
        <ErrorState
          variant="403"
          headingLevel={2}
          action={<Button variant="outline">Back to dashboard</Button>}
        />
      ),
      code: `<ErrorState variant="403" headingLevel={2} action={<Button variant="outline">Back to dashboard</Button>} />`,
      surfaceClassName: 'min-h-[340px]',
    },
    {
      title: 'Custom title + illustration',
      preview: (
        <ErrorState
          illustration={<Illustrations.Construction className="size-32" />}
          title="We're under construction"
          description="This page is being rebuilt. Check back soon."
          action={<Button variant="outline">Go home</Button>}
        />
      ),
      code: `<ErrorState
  illustration={<Illustrations.Construction className="size-32" />}
  title="We're under construction"
  description="This page is being rebuilt. Check back soon."
  action={<Button variant="outline">Go home</Button>}
/>`,
      surfaceClassName: 'min-h-[340px]',
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'variant',
          type: `'404' | '500' | 'generic'`,
          default: `'generic'`,
          description: 'Preset illustration + default copy.',
        },
        { name: 'title', type: 'ReactNode', description: 'Override the default title.' },
        { name: 'description', type: 'ReactNode', description: 'Override the default body.' },
        {
          name: 'illustration',
          type: 'ReactNode',
          description: "Override the variant's default illustration.",
        },
        {
          name: 'action',
          type: 'ReactNode',
          description: 'Primary action. Replaces the default retry button.',
        },
        {
          name: 'onRetry',
          type: '() => void',
          description: 'Renders a default "Try again" button calling this handler.',
        },
      ],
    },
  ],
  accessibility: [
    'Renders without a live-region role — it is static page content, not an interruption. Wrap it in role="alert" yourself only when the error appears asynchronously and must be announced.',
  ],
  states: [
    {
      name: 'Permission denied',
      how: '`variant="403"` — default title, description and illustration.',
    },
    { name: 'Not found', how: '`variant="404"`.' },
    { name: 'Server error', how: '`variant="500"`.' },
    {
      name: 'Generic',
      how: '`variant="generic"` (default) — pass `onRetry` for the built-in "Try again" button.',
    },
    { name: 'Live', how: '`live` wraps it in role="alert" so an in-place failure is announced.' },
  ],
  related: [{ slug: 'empty-state', reason: 'For non-error "nothing here yet" cases.' }],
};

export default doc;
