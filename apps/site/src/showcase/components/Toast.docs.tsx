import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import type { ComponentDoc } from '../registry/types';

function TriggerDemo() {
  const { push } = useToast();
  return (
    <Button
      onClick={() =>
        push({
          title: 'Saved',
          description: 'All changes published.',
          variant: 'success',
        })
      }
    >
      Show toast
    </Button>
  );
}

const VARIANT_COPY = {
  default: { title: 'Heads up', description: 'A new version is available.' },
  success: { title: 'Saved', description: 'All changes published.' },
  warning: { title: 'Storage almost full', description: '90% of your quota is used.' },
  danger: { title: 'Export failed', description: 'The server rejected the request.' },
  info: { title: 'Syncing', description: 'Your workspace is being synced.' },
} as const;

function VariantsDemo() {
  const { push } = useToast();
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {(Object.keys(VARIANT_COPY) as Array<keyof typeof VARIANT_COPY>).map((v) => (
        <Button
          key={v}
          variant="outline"
          size="sm"
          onClick={() => push({ variant: v, ...VARIANT_COPY[v] })}
        >
          {v}
        </Button>
      ))}
    </div>
  );
}

function ActionDemo() {
  const { push } = useToast();
  return (
    <Button
      variant="outline"
      onClick={() =>
        push({
          title: 'Conversation archived',
          description: 'You can restore it from the archive.',
          action: {
            label: 'Undo',
            altText: 'Undo archive',
            onClick: () => push({ title: 'Restored', variant: 'success' }),
          },
        })
      }
    >
      Archive with undo
    </Button>
  );
}

const doc: ComponentDoc = {
  slug: 'toast',
  name: 'Toast',
  group: 'Feedback',
  description:
    'Transient, non-blocking feedback. Toasts queue and auto-dismiss. Use the useToast hook imperatively — do not render <Toast> directly outside the ToastProvider.',
  i18n: 'Reads `toast.close` (close button) and `toast.region` (viewport aria-label).',
  exports: [
    'Toast',
    'ToastProvider',
    'ToastViewport',
    'ToastTitle',
    'ToastDescription',
    'Toaster',
    'useToast',
  ],
  sourceFile: 'Toast.tsx',
  examples: [
    {
      title: 'Imperative (useToast)',
      description:
        'Mount <ToastProvider> + <ToastViewport /> once at your app root, then call push() from anywhere.',
      preview: <TriggerDemo />,
      code: `// app.tsx
<ToastProvider>
  <App />
  <ToastViewport />
</ToastProvider>

// anywhere inside
const { push } = useToast();
push({ title: 'Saved', description: 'All changes published.', variant: 'success' });`,
    },
    {
      title: 'Variants',
      description:
        'One tone per outcome: default for neutral notices, success / warning / danger for results, info for ongoing state. Each variant has its own auto-dismiss time (`TOAST_DURATIONS`): default / success / info 4 s, warning 6 s, danger persists until dismissed. Pass `duration` to override per toast. Click to preview each.',
      preview: <VariantsDemo />,
      code: `const { push } = useToast();

push({ variant: 'default', title: 'Heads up', description: 'A new version is available.' });
push({ variant: 'success', title: 'Saved', description: 'All changes published.' });
push({ variant: 'warning', title: 'Storage almost full', description: '90% of your quota is used.' });
push({ variant: 'danger',  title: 'Export failed', description: 'The server rejected the request.' });
push({ variant: 'info',    title: 'Syncing', description: 'Your workspace is being synced.' });`,
    },
    {
      title: 'With action',
      description:
        'An optional action button — use for one-step recovery like Undo. altText is what screen readers announce.',
      preview: <ActionDemo />,
      code: `const { push } = useToast();

push({
  title: 'Conversation archived',
  description: 'You can restore it from the archive.',
  action: { label: 'Undo', altText: 'Undo archive', onClick: undo },
});`,
    },
    {
      title: 'Static (preview)',
      description: 'Stationary toasts for documentation / screenshots — all five variants.',
      preview: (
        <ToastProvider duration={Infinity}>
          <ToastViewport className="!static !w-full !max-w-sm !p-0">
            <Toast open variant="default">
              <div>
                <ToastTitle>Heads up</ToastTitle>
                <ToastDescription>A new version is available.</ToastDescription>
              </div>
            </Toast>
            <Toast open variant="success">
              <div>
                <ToastTitle>Saved</ToastTitle>
                <ToastDescription>All changes published.</ToastDescription>
              </div>
            </Toast>
            <Toast open variant="warning">
              <div>
                <ToastTitle>Storage almost full</ToastTitle>
                <ToastDescription>90% of your quota is used.</ToastDescription>
              </div>
            </Toast>
            <Toast open variant="danger">
              <div>
                <ToastTitle>Export failed</ToastTitle>
                <ToastDescription>The server rejected the request.</ToastDescription>
              </div>
            </Toast>
            <Toast open variant="info">
              <div>
                <ToastTitle>Syncing</ToastTitle>
                <ToastDescription>Your workspace is being synced.</ToastDescription>
              </div>
            </Toast>
          </ToastViewport>
        </ToastProvider>
      ),
      code: `<ToastProvider duration={Infinity}>
  <ToastViewport>
    <Toast open variant="default">…</Toast>
    <Toast open variant="success">…</Toast>
    <Toast open variant="warning">…</Toast>
    <Toast open variant="danger">…</Toast>
    <Toast open variant="info">…</Toast>
  </ToastViewport>
</ToastProvider>`,
    },
  ],
  api: [
    {
      title: 'useToast()',
      rows: [
        {
          name: 'push',
          type: '(t: ToastDescriptor) => string',
          description: 'Show a toast. Returns the toast id.',
        },
        {
          name: 'dismiss',
          type: '(id: string) => void',
          description: 'Hide a toast by id (allowing exit animation).',
        },
        {
          name: 'remove',
          type: '(id: string) => void',
          description: 'Immediately remove a toast from state.',
        },
        {
          name: 'toasts',
          type: 'InternalToast[]',
          description: 'Live toast list (mostly for ToastViewport internals).',
        },
      ],
    },
    {
      title: 'ToastDescriptor',
      rows: [
        { name: 'title', type: 'ReactNode', description: 'Bold leading text.' },
        { name: 'description', type: 'ReactNode', description: 'Body text.' },
        {
          name: 'variant',
          type: `'default' | 'success' | 'warning' | 'danger' | 'info'`,
          default: `'default'`,
          description: 'Tone.',
        },
        {
          name: 'duration',
          type: 'number',
          default: '5000',
          description: 'Milliseconds before auto-dismiss; Infinity to require manual close.',
        },
        {
          name: 'action',
          type: 'ReactNode',
          description: 'Optional action button rendered on the right.',
        },
      ],
    },
  ],
  accessibility: [
    'Backed by @radix-ui/react-toast — toasts are announced via aria-live polite/assertive based on variant.',
    'Focus is preserved — toasts do not steal focus from the page.',
    'Esc dismisses the focused toast; F8 moves focus into the toast region.',
  ],
  keyboard: [
    { key: 'F8', action: 'Focus the toast viewport (Radix default hotkey).' },
    {
      key: 'Tab / Shift+Tab',
      action: 'Move between the action and close buttons of the open toasts.',
    },
    {
      key: 'Enter / Space',
      action: 'Activate the focused action or × button — both dismiss the toast.',
    },
    { key: 'Esc', action: 'Dismiss the focused toast.' },
  ],
  guidelines: {
    do: [
      'Use for transient confirmation of a completed action ("Project archived").',
      'Offer an `action` like Undo for reversible operations, with a 5 s window.',
      'Keep the title ≤ 5 words and the description to one line.',
      'Match `variant` to outcome: success, danger, warning, info.',
    ],
    dont: [
      'Use a toast for errors that need a decision — show them inline or in a dialog.',
      'Stack several toasts for one action; combine into a single message.',
      'Put essential information only in a toast — it disappears and may be missed.',
      'Auto-dismiss a toast that carries an action in under 5 seconds.',
    ],
  },
  related: [
    { slug: 'alert', reason: 'For persistent in-page messages.' },
    { slug: 'snackbar', reason: 'For inline, section-level feedback.' },
  ],
};

export default doc;
