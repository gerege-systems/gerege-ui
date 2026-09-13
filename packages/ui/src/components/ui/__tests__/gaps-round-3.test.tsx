import { describe, expect, it, vi } from 'vitest';
import { act, render, renderHook, screen } from '@testing-library/react';
import { useToast, TOAST_DURATIONS } from '@/hooks/use-toast';
import { useDebounce, useDebouncedCallback } from '@/hooks/use-debounce';
import { StringsContext } from '@/hooks/use-strings';
import { mnStrings } from '@/lib/strings.mn';
import { ErrorState } from '../ErrorState';
import { DataGrid } from '../DataGrid';
import { Skeleton } from '../Skeleton';
import { IconButton } from '../IconButton';
import { Plus } from 'lucide-react';

describe('toast per-variant duration', () => {
  it('defaults by variant and lets explicit duration win', () => {
    const { result } = renderHook(() => useToast());
    // Push one at a time — the queue keeps only 3 auto-dismissing toasts.
    const durationOf = (t: Parameters<typeof result.current.push>[0]) => {
      let id = '';
      act(() => {
        id = result.current.push(t);
      });
      const d = result.current.toasts.find((x) => x.id === id)?.duration;
      act(() => result.current.remove(id));
      return d;
    };
    expect(durationOf({ variant: 'success' })).toBe(4000);
    expect(durationOf({ variant: 'info' })).toBe(4000);
    expect(durationOf({})).toBe(4000);
    expect(durationOf({ variant: 'warning' })).toBe(6000);
    expect(durationOf({ variant: 'danger' })).toBe(0);
    expect(durationOf({ variant: 'danger', duration: 1234 })).toBe(1234);
    expect(TOAST_DURATIONS.danger).toBe(0);
  });

  it('re-derives duration when an in-place update changes variant', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.push({ id: 'save', title: 'Saving…', duration: 0 });
    });
    act(() => {
      result.current.push({ id: 'save', title: 'Saved', variant: 'success' });
    });
    expect(result.current.toasts.find((t) => t.id === 'save')?.duration).toBe(4000);
    act(() => result.current.remove('save'));
  });
});

describe('useDebounce', () => {
  it('settles after delay and useDebouncedCallback fires once', () => {
    vi.useFakeTimers();
    try {
      const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
        initialProps: { v: 'a' },
      });
      rerender({ v: 'ab' });
      rerender({ v: 'abc' });
      expect(result.current).toBe('a');
      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(result.current).toBe('a');
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current).toBe('abc');

      const fn = vi.fn();
      const cb = renderHook(() => useDebouncedCallback(fn, 200));
      act(() => {
        cb.result.current(1);
        cb.result.current(2);
        cb.result.current(3);
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(3);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('ErrorState 403', () => {
  it('renders permission-denied copy in en and mn with action slot', () => {
    const { rerender } = render(<ErrorState variant="403" action={<a href="/">Home</a>} />);
    expect(screen.getByRole('heading', { name: "You don't have access" })).toBeInTheDocument();
    expect(screen.getByText('Ask an admin to grant the permission.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Try again' })).toBeNull();
    rerender(
      <StringsContext.Provider value={mnStrings}>
        <ErrorState variant="403" />
      </StringsContext.Provider>,
    );
    expect(screen.getByRole('heading', { name: 'Танд хандах эрх байхгүй' })).toBeInTheDocument();
  });
});

describe('DataGrid empty cell', () => {
  it('renders an em dash with an accessible label for null/undefined/empty', () => {
    render(
      <DataGrid
        columns={[
          { key: 'a', header: 'A' },
          { key: 'b', header: 'B' },
          { key: 'c', header: 'C' },
        ]}
        rows={[{ id: 1, a: null, b: undefined, c: '' }]}
      />,
    );
    const dashes = screen.getAllByText('Empty').map((el) => el.parentElement!);
    expect(dashes).toHaveLength(3);
    expect(dashes[0]).toHaveTextContent('—');
  });
});

describe('Skeleton default delay', () => {
  it('waits 300ms by default before rendering', async () => {
    vi.useFakeTimers();
    try {
      const { container } = render(<Skeleton className="h-4" />);
      expect(container.firstChild).toBeNull();
      await act(async () => {
        vi.advanceTimersByTime(299);
      });
      expect(container.firstChild).toBeNull();
      await act(async () => {
        vi.advanceTimersByTime(1);
      });
      expect(container.firstChild).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('IconButton sizes', () => {
  it('matches button heights sm 32 / md 36 / lg 40 / xl 44', () => {
    const { rerender } = render(<IconButton aria-label="Add" icon={<Plus />} size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('h-8');
    rerender(<IconButton aria-label="Add" icon={<Plus />} />);
    expect(screen.getByRole('button')).toHaveClass('h-9');
    rerender(<IconButton aria-label="Add" icon={<Plus />} size="xl" />);
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });
});
