import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DesignSystemProvider } from '@/components/ui/DesignSystemProvider';
import { FileText, Sparkles } from '@/icons';
import { GetCodeDialog } from '../theme/GetCodeDialog';
import { ThemeControls } from '../theme/ThemeControls';
import { BLOCK_COUNT, ThemePreviewWall } from '../theme/ThemePreviewWall';
import {
  DEFAULT_STATE,
  changedCount,
  decodeState,
  deriveTokens,
  encodeState,
  type ThemeState,
} from '../theme/editor-model';

/**
 * `#theme` — pick tokens on the right, watch the wall on the left, take the CSS
 * away with Get code.
 *
 * The wall is wrapped in a `DesignSystemProvider` rather than writing to
 * `<html>`: the editor's own chrome must keep the site's theme so the two are
 * visibly different things, and the provider's `{light, dark}` pair is what
 * makes dark mode follow without a second set of controls.
 */
export function ThemePage() {
  const [state, setState] = useState<ThemeState>(() =>
    typeof window === 'undefined' ? DEFAULT_STATE : decodeState(window.location.hash),
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  // A different arrangement each visit: a fixed order teaches you the page
  // rather than the theme.
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 2 ** 31));

  // Keep the hash in step so the theme survives a reload and can be shared.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const next = `#theme${encodeState(state)}`;
    if (window.location.hash !== next) {
      window.history.replaceState(null, '', next);
    }
  }, [state]);

  const patch = useCallback((p: Partial<ThemeState>) => setState((s) => ({ ...s, ...p })), []);
  const reset = useCallback(() => setState(DEFAULT_STATE), []);

  const tokens = deriveTokens(state);
  const changed = changedCount(state);

  return (
    <div className="mx-auto w-full max-w-[1536px] px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-3 pb-6 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex max-w-2xl flex-col gap-1.5">
          <h1 className="text-3xl font-semibold tracking-tight">Theme</h1>
          <p className="text-foreground-muted text-sm">
            Style, Base Color, Theme, Chart Color-оо сонгоод <strong>Get code</strong> дар. Гарах
            CSS-ийг төслийнхөө нэг style файлд буулгахад бүх компонент тэр загвараар ажиллана —
            компонент засах шаардлагагүй. Доорх {BLOCK_COUNT} блок сонголт бүрд шууд шинэчлэгдэнэ.
          </p>
        </div>
        <div className="sm:grow" />
        <Button variant="secondary" onClick={() => setSeed((n) => n + 1)}>
          <Sparkles aria-hidden />
          Холих
        </Button>
        <Button onClick={() => setDialogOpen(true)}>
          <FileText aria-hidden />
          Get code
        </Button>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* The provider renders `display: contents`, so the frame is its own
            element — otherwise the border and padding would never paint. */}
        <div className="border-border bg-background min-w-0 grow rounded-lg border p-4 sm:p-6">
          <DesignSystemProvider tokens={tokens}>
            <ThemePreviewWall seed={seed} />
          </DesignSystemProvider>
        </div>

        <aside className="border-border bg-card w-full shrink-0 rounded-lg border p-5 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:w-80 lg:overflow-y-auto">
          <ThemeControls state={state} onChange={patch} onReset={reset} changed={changed} />
          <Button className="mt-5 w-full" onClick={() => setDialogOpen(true)}>
            <FileText aria-hidden />
            Get code
          </Button>
        </aside>
      </div>

      <GetCodeDialog open={dialogOpen} onOpenChange={setDialogOpen} state={state} />
    </div>
  );
}
