import { describe, expect, it, vi } from 'vitest';
import { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import {
  ConfirmationDialog,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

const axeBody = () => axe(document.body, { rules: { region: { enabled: false } } });

function Demo(props: { size?: 'sm' | 'md' | 'lg'; showClose?: boolean; defaultOpen?: boolean }) {
  const { size, showClose, defaultOpen } = props;
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent size={size} showClose={showClose} className="extra">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Change your details.</DialogDescription>
        </DialogHeader>
        <input aria-label="Name" />
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <button type="button">Save</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('is closed by default; trigger carries aria-expanded/haspopup', () => {
    render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens on click with title/description wiring and a close button; merges className', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog', { name: 'Edit profile' });
    expect(dialog).toHaveAccessibleDescription('Change your details.');
    expect(dialog).toHaveClass('extra', 'max-w-[520px]');
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    // trigger is outside the modal layer (aria-hidden while open)
    expect(screen.getByRole('button', { name: 'Open', hidden: true })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('size and showClose props', async () => {
    const user = userEvent.setup();
    render(<Demo size="lg" showClose={false} />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveClass('max-w-[720px]');
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('uncontrolled defaultOpen; Escape closes and focus returns to the trigger', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it('DialogClose and the × button close the dialog', async () => {
    const user = userEvent.setup();
    render(<Demo />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(await screen.findByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(await screen.findByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('traps focus inside the content while open', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Demo />
        <button type="button">Outside</button>
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog');
    const focusables = ['Name', 'Cancel', 'Save', 'Close'];
    for (let i = 0; i < focusables.length + 2; i++) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    await user.tab({ shift: true });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    expect(screen.getByRole('button', { name: 'Outside', hidden: true })).not.toHaveFocus();
  });

  it('controlled: open prop drives visibility and onOpenChange reports close requests', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>T</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    rerender(
      <Dialog open={false} onOpenChange={onOpenChange}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>T</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('returnFocusTo moves focus to the given element on close', async () => {
    const user = userEvent.setup();
    const target = createRef<HTMLButtonElement>();
    render(
      <>
        <button ref={target} type="button">
          Target
        </button>
        <Dialog defaultOpen>
          <DialogContent aria-describedby={undefined} returnFocusTo={target}>
            <DialogTitle>T</DialogTitle>
          </DialogContent>
        </Dialog>
      </>,
    );
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(target.current).toHaveFocus();
  });

  it('forwards refs to content and title', () => {
    const contentRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    render(
      <Dialog open>
        <DialogContent ref={contentRef} aria-describedby={undefined}>
          <DialogTitle ref={titleRef} className="t-x">
            T
          </DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(contentRef.current).toBe(screen.getByRole('dialog'));
    expect(titleRef.current).toHaveTextContent('T');
    expect(titleRef.current).toHaveClass('t-x', 'font-semibold');
  });

  it('localises the close label', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <Dialog open>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle>T</DialogTitle>
          </DialogContent>
        </Dialog>
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('button', { name: 'Хаах' })).toBeInTheDocument();
  });

  it('is axe-clean closed and open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Demo />);
    expect(await axe(container)).toHaveNoViolations();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');
    expect(await axeBody()).toHaveNoViolations();
  });
});

describe('ConfirmationDialog', () => {
  function Demo({
    onConfirm,
    description,
    loading,
    formatError,
  }: {
    onConfirm: () => void | Promise<void>;
    description?: string;
    loading?: boolean;
    formatError?: (e: unknown) => React.ReactNode;
  }) {
    const [open, setOpen] = useState(true);
    return (
      <>
        <span data-testid="state">{open ? 'open' : 'closed'}</span>
        <ConfirmationDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete project?"
          description={description}
          confirmLabel="Delete"
          confirmVariant="destructive"
          onConfirm={onConfirm}
          loading={loading}
          formatError={formatError}
        />
      </>
    );
  }

  it('renders title, optional description, default cancel + custom confirm label', () => {
    render(<Demo onConfirm={() => {}} description="Permanent." />);
    const dialog = screen.getByRole('dialog', { name: 'Delete project?' });
    expect(dialog).toHaveAccessibleDescription('Permanent.');
    expect(dialog).toHaveClass('max-w-[400px]');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('bg-danger');
  });

  it('no description → no aria-describedby and no Radix warning', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Demo onConfirm={() => {}} />);
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
    expect(warn.mock.calls.flat().join(' ')).not.toMatch(/aria-describedby/);
    expect(error.mock.calls.flat().join(' ')).not.toMatch(/aria-describedby/);
    error.mockRestore();
    warn.mockRestore();
  });

  it('awaits onConfirm: busy state while pending, then idle; cancel disabled meanwhile', async () => {
    const user = userEvent.setup();
    let resolve!: () => void;
    const onConfirm = vi.fn(
      () =>
        new Promise<void>((r) => {
          resolve = r;
        }),
    );
    render(<Demo onConfirm={onConfirm} />);
    const confirm = screen.getByRole('button', { name: 'Delete' });
    await user.click(confirm);
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(confirm).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    // second click is blocked while pending
    await user.click(confirm);
    expect(onConfirm).toHaveBeenCalledOnce();
    resolve();
    await waitFor(() => expect(confirm).not.toHaveAttribute('aria-busy'));
    expect(screen.getByRole('button', { name: 'Cancel' })).not.toBeDisabled();
  });

  it('rejection shows the generic message, never Error.message, and keeps the dialog open', async () => {
    const user = userEvent.setup();
    render(<Demo onConfirm={() => Promise.reject(new Error('ECONNRESET 10.0.0.7:5432'))} />);
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Something interrupted this action.');
    expect(alert).not.toHaveTextContent('ECONNRESET');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('state')).toHaveTextContent('open');
  });

  it('formatError maps the rejection; error clears on retry and on close', async () => {
    const user = userEvent.setup();
    let fail = true;
    const onConfirm = vi.fn(async () => {
      if (fail) throw 'boom';
    });
    render(<Demo onConfirm={onConfirm} formatError={(e) => `Mapped: ${String(e)}`} />);
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Mapped: boom');
    fail = false;
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });

  it('cancel closes via onOpenChange(false)', async () => {
    const user = userEvent.setup();
    render(<Demo onConfirm={() => {}} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('closed'));
  });

  it('external `loading` forces the busy state', () => {
    render(<Demo onConfirm={() => {}} loading />);
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('localises default button labels', () => {
    render(
      <DesignSystemProvider strings={mnStrings}>
        <ConfirmationDialog open onOpenChange={() => {}} title="T" onConfirm={() => {}} />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('button', { name: 'Баталгаажуулах' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Болих' })).toBeInTheDocument();
  });

  it('is axe-clean', async () => {
    render(<Demo onConfirm={() => {}} description="Permanent." />);
    expect(await axeBody()).toHaveNoViolations();
  });
});
