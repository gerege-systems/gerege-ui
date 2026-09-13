import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Toaster,
} from './Toast';
import { toast, useToast } from '@/hooks/use-toast';
import { DesignSystemProvider } from './DesignSystemProvider';
import { mnStrings } from '@/lib/strings.mn';

/* The queue is a module singleton — expose the hook API so each test can
   drain it afterwards. */
let api: ReturnType<typeof useToast> | null = null;
function Probe() {
  api = useToast();
  return null;
}

function drain() {
  act(() => {
    api?.toasts.forEach((t) => api?.remove(t.id));
  });
}

const openToasts = () => Array.from(document.querySelectorAll('ol > li[data-state="open"]'));

describe('Toaster (queue-driven)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    drain();
    api = null;
    vi.useRealTimers();
  });

  function mount(strings?: typeof mnStrings) {
    const ui = (
      <>
        <Probe />
        <Toaster />
      </>
    );
    return render(
      strings ? <DesignSystemProvider strings={strings}>{ui}</DesignSystemProvider> : ui,
    );
  }

  it('renders pushed toasts as role=status inside a labelled region', () => {
    mount();
    act(() => {
      toast({ variant: 'success', title: 'Saved', description: 'All good.' });
    });
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region).toBeInTheDocument();
    // Radix announces through a visually-hidden live region (foreground → assertive).
    expect(document.querySelector('[role="status"][aria-live="assertive"]')).not.toBeNull();
    const items = openToasts();
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveClass('bg-success-soft');
    expect(items[0]).toHaveTextContent('Saved');
    expect(items[0]).toHaveTextContent('All good.');
    expect(items[0].querySelector('svg')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('success auto-closes after 4000ms and is removed from the queue', () => {
    mount();
    act(() => {
      toast({ variant: 'success', title: 'Saved' });
    });
    act(() => {
      vi.advanceTimersByTime(3999);
    });
    expect(openToasts()).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(openToasts()).toHaveLength(0);
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(api?.toasts).toHaveLength(0);
  });

  it('warning waits 6000ms', () => {
    mount();
    act(() => {
      toast({ variant: 'warning', title: 'Careful' });
    });
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(openToasts()).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(openToasts()).toHaveLength(0);
  });

  it('danger persists until closed; duration 0 persists too', () => {
    mount();
    act(() => {
      toast({ variant: 'danger', title: 'Failed' });
      toast({ variant: 'success', title: 'Sticky', duration: 0 });
    });
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(openToasts()).toHaveLength(2);
    fireEvent.click(screen.getAllByRole('button', { name: 'Close' })[0]);
    expect(openToasts()).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(api?.toasts).toHaveLength(1);
  });

  it('same id updates in place and keeps queue position', () => {
    mount();
    act(() => {
      toast({ id: 'job', title: 'Uploading…', duration: 0 });
      toast({ title: 'Other' });
    });
    expect(openToasts().map((t) => t.textContent)).toEqual([
      expect.stringContaining('Other'),
      expect.stringContaining('Uploading…'),
    ]);
    act(() => {
      toast({ id: 'job', title: 'Uploaded', variant: 'success' });
    });
    const items = openToasts();
    expect(items).toHaveLength(2);
    expect(items[1]).toHaveTextContent('Uploaded');
    expect(items[1]).not.toHaveTextContent('Uploading…');
    expect(items[1]).toHaveClass('bg-success-soft');
  });

  it('caps auto-dismissing toasts at 3 but never drops persistent ones', () => {
    mount();
    act(() => {
      toast({ title: 'Persistent', duration: 0 });
      toast({ title: 'A' });
      toast({ title: 'B' });
      toast({ title: 'C' });
      toast({ title: 'D' });
    });
    const texts = openToasts().map((t) => t.textContent ?? '');
    expect(texts).toHaveLength(4);
    expect(texts.some((t) => t.includes('Persistent'))).toBe(true);
    expect(texts.some((t) => t.includes('A'))).toBe(false);
    expect(texts.some((t) => t.includes('D'))).toBe(true);
  });

  it('action button fires and is announced via altText', () => {
    mount();
    const onClick = vi.fn();
    act(() => {
      toast({
        title: 'Archived',
        duration: 0,
        action: { label: 'Undo', altText: 'Undo archive', onClick },
      });
    });
    const btn = screen.getByRole('button', { name: 'Undo' });
    expect(btn).toHaveAttribute('data-radix-toast-announce-alt', 'Undo archive');
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('uses Mongolian region + close labels', () => {
    mount(mnStrings);
    act(() => {
      toast({ title: 'x', duration: 0 });
    });
    expect(screen.getByRole('region', { name: 'Мэдэгдлүүд' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Хаах' })).toBeInTheDocument();
  });

  it('is axe-clean with an open toast', async () => {
    vi.useRealTimers();
    const { baseElement } = mount();
    act(() => {
      toast({ variant: 'info', title: 'Heads up', description: 'Details', duration: 0 });
    });
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});

describe('Toast primitives', () => {
  it('variant classes + icon; forwardRef/className/props on each part', () => {
    const root = createRef<HTMLLIElement>();
    const title = createRef<HTMLDivElement>();
    const desc = createRef<HTMLDivElement>();
    const action = createRef<HTMLButtonElement>();
    const close = createRef<HTMLButtonElement>();
    const viewport = createRef<HTMLOListElement>();
    render(
      <ToastProvider>
        <Toast ref={root} open variant="danger" className="w-80" data-testid="toast">
          <ToastTitle ref={title} className="text-base">
            Failed
          </ToastTitle>
          <ToastDescription ref={desc} className="opacity-100">
            Try again.
          </ToastDescription>
          <ToastAction ref={action} altText="Retry upload" className="mt-2">
            Retry
          </ToastAction>
          <ToastClose ref={close} className="top-1" />
        </Toast>
        <ToastViewport ref={viewport} className="p-2" data-testid="vp" />
      </ToastProvider>,
    );
    expect(root.current?.tagName).toBe('LI');
    expect(root.current).toHaveAttribute('data-state', 'open');
    expect(root.current).toHaveClass('w-80', 'bg-danger-soft');
    expect(root.current).toHaveAttribute('data-testid', 'toast');
    // Variant icon is the first child (before the content block).
    expect(root.current?.firstElementChild?.tagName).toBe('svg');
    expect(title.current).toHaveClass('text-base', 'font-medium');
    expect(desc.current).toHaveClass('opacity-100', 'text-sm');
    expect(action.current).toBe(screen.getByRole('button', { name: 'Retry' }));
    expect(action.current).toHaveClass('mt-2', 'h-8');
    expect(close.current).toBe(screen.getByRole('button', { name: 'Close' }));
    expect(close.current).toHaveClass('top-1', 'absolute');
    expect(viewport.current?.tagName).toBe('OL');
    expect(viewport.current).toHaveClass('p-2', 'fixed');
    expect(viewport.current).toHaveAttribute('data-testid', 'vp');
  });

  it('default variant has no icon; ToastClose keeps a consumer aria-label', () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Plain</ToastTitle>
          <ToastClose aria-label="Dismiss" />
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    const li = document.querySelector('ol > li[data-state="open"]') as HTMLElement;
    expect(li).toHaveClass('bg-card');
    expect(li.firstElementChild?.tagName).toBe('DIV');
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('calls onOpenChange(false) when closed via ToastClose', () => {
    const onOpenChange = vi.fn();
    render(
      <ToastProvider>
        <Toast open onOpenChange={onOpenChange} duration={Infinity}>
          <ToastTitle>T</ToastTitle>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
