import { useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ConfirmationDialog,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import type { ComponentDoc } from '../registry/types';

const TERM =
  'The service is provided as is. You keep ownership of the content you upload and grant us the rights needed to store and show it to the people you share it with.';

function ConfirmDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete your account?"
        description="This permanently removes all data. This cannot be undone."
        confirmLabel="Delete account"
        confirmVariant="destructive"
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

const doc: ComponentDoc = {
  slug: 'dialog',
  name: 'Dialog',
  group: 'Overlays',
  description:
    'Modal that interrupts the user. Reserve for actions that demand focus — confirmations, dense forms, important choices. For side panels prefer Sheet; for transient messages, Toast.',
  i18n: 'Reads `dialog.close` (close button aria-label), `scrollArea.region` (DialogBody label) and `confirmationDialog.confirm` / `confirmationDialog.cancel`.',
  exports: [
    'Dialog',
    'DialogTrigger',
    'DialogContent',
    'DialogHeader',
    'DialogTitle',
    'DialogDescription',
    'DialogBody',
    'DialogFooter',
    'DialogClose',
    'ConfirmationDialog',
  ],
  sourceFile: 'Dialog.tsx',
  examples: [
    {
      title: 'Basic',
      preview: (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite collaborators</DialogTitle>
              <DialogDescription>They'll get an email invitation right away.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button>Send invites</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
      code: `<Dialog>
  <DialogTrigger asChild>
    <Button>Open dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Invite collaborators</DialogTitle>
      <DialogDescription>They'll get an email invitation right away.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>Send invites</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
    },
    {
      title: 'Sizes',
      preview: (
        <div className="flex flex-wrap gap-2">
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <Dialog key={s}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  Open {s}
                </Button>
              </DialogTrigger>
              <DialogContent size={s}>
                <DialogHeader>
                  <DialogTitle>Size: {s}</DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ),
      code: `<DialogContent size="sm">…</DialogContent>
<DialogContent size="md">…</DialogContent>
<DialogContent size="lg">…</DialogContent>`,
    },
    {
      title: 'Long content',
      description:
        'Wrap the middle in `DialogBody`: the panel is capped at the viewport height, the header (with ×) and the footer stay visible, and only the body scrolls. Without `DialogBody` a dialog grows with its content, as before.',
      preview: (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open long dialog</Button>
          </DialogTrigger>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>Terms of service</DialogTitle>
              <DialogDescription>Read the terms before you accept them.</DialogDescription>
            </DialogHeader>
            <DialogBody className="space-y-3">
              {Array.from({ length: 24 }, (_, i) => (
                <p key={i} className="text-sm">{`${i + 1}. ${TERM}`}</p>
              ))}
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Decline</Button>
              </DialogClose>
              <Button>Accept</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
      code: `<DialogContent size="lg">
  <DialogHeader>
    <DialogTitle>Terms of service</DialogTitle>
    <DialogDescription>Read the terms before you accept them.</DialogDescription>
  </DialogHeader>
  <DialogBody>…long content…</DialogBody>
  <DialogFooter>
    <DialogClose asChild>
      <Button variant="outline">Decline</Button>
    </DialogClose>
    <Button>Accept</Button>
  </DialogFooter>
</DialogContent>`,
    },
    {
      title: 'ConfirmationDialog',
      description:
        'Pre-composed pattern for "are you sure?" flows. Controlled via open / onOpenChange; renders title + description + Cancel / Confirm.',
      preview: <ConfirmDemo />,
      code: `const [open, setOpen] = useState(false);

<Button variant="destructive" onClick={() => setOpen(true)}>
  Delete account
</Button>

<ConfirmationDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete your account?"
  description="This permanently removes all data. This cannot be undone."
  confirmLabel="Delete account"
  confirmVariant="destructive"
  onConfirm={async () => {
    await api.deleteAccount();
    setOpen(false);
  }}
/>`,
    },
  ],
  api: [
    {
      title: 'Dialog (root) — Radix props',
      rows: [
        { name: 'open', type: 'boolean', description: 'Controlled open state.' },
        { name: 'defaultOpen', type: 'boolean', description: 'Uncontrolled initial state.' },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          description: 'Fires when open changes.',
        },
      ],
    },
    {
      title: 'DialogContent',
      rows: [
        { name: 'size', type: `'sm' | 'md' | 'lg'`, default: `'md'`, description: 'Max width.' },
        {
          name: 'showClose',
          type: 'boolean',
          default: 'true',
          description: 'Render the top-right close X.',
        },
      ],
    },
    {
      title: 'ConfirmationDialog',
      rows: [
        { name: 'open', type: 'boolean', required: true, description: 'Controlled open state.' },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          required: true,
          description: 'Fires when open changes.',
        },
        { name: 'title', type: 'ReactNode', required: true, description: 'Question.' },
        { name: 'description', type: 'ReactNode', description: 'Explainer body.' },
        {
          name: 'confirmLabel',
          type: 'string',
          default: `'Confirm'`,
          description: 'Primary button label.',
        },
        {
          name: 'cancelLabel',
          type: 'string',
          default: `'Cancel'`,
          description: 'Secondary button label.',
        },
        {
          name: 'confirmVariant',
          type: `ButtonProps['variant']`,
          default: `'primary'`,
          description: 'Style of the confirm button.',
        },
        {
          name: 'onConfirm',
          type: '() => void | Promise<void>',
          required: true,
          description: 'Called on confirm. Awaited — spinner shows while pending.',
        },
        { name: 'loading', type: 'boolean', description: 'Override the spinner state.' },
      ],
    },
  ],
  accessibility: [
    'Backed by @radix-ui/react-dialog — focus is trapped while open, returned to trigger on close.',
    'Esc closes; click-outside closes (configurable per Radix).',
    'DialogTitle is required for screen readers — Radix will warn if omitted.',
    'DialogBody is a focusable group named by `scrollArea.region`, so the keyboard can scroll it (override with `aria-label`). With nothing tabbable before it, it takes the initial focus, keeping the start of long content in view.',
  ],
  keyboard: [
    {
      key: 'Tab / Shift+Tab',
      action: 'Cycle focus inside the dialog — focus is trapped while open.',
    },
    { key: 'Esc', action: 'Close the dialog and return focus to the trigger.' },
    { key: 'Enter / Space', action: 'Activate the focused button (trigger, Cancel, Confirm, ×).' },
  ],
  guidelines: {
    do: [
      'Lead the title with the action or question: "Delete project?" rather than "Are you sure?".',
      'State the consequence in one sentence in `DialogDescription`.',
      'Put the primary action on the right, Cancel on its left; use `destructive` for irreversible actions.',
      'Use `ConfirmationDialog` for single-sentence confirms — it wires focus, Esc and buttons for you.',
    ],
    dont: [
      'Open a dialog for reversible, low-risk actions — an Undo toast is lighter.',
      'Stack a dialog on a dialog; use a Sheet or a new page for deeper flows.',
      'Put more than ~3 fields in a dialog; use a Sheet (4–8 fields) or a full page.',
      'Hide the close affordance without providing Cancel.',
    ],
  },
  related: [
    { slug: 'sheet', reason: 'Side panel alternative.' },
    { slug: 'drawer', reason: 'Bottom sheet on mobile.' },
    { slug: 'popover', reason: 'For non-modal overlays.' },
  ],
};

export default doc;
