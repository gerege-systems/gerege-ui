import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DesignSystemProvider } from '@/components/ui/DesignSystemProvider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet';
import { FileText, Settings, Sparkles } from '@/icons';
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
 * `#theme` — pick tokens in the panel, watch the wall, take the CSS away with
 * Get code.
 *
 * The panel is a sticky column at the right edge of the site's own container,
 * not a viewport-docked drawer. Docked to the viewport it left dead space on
 * wide screens — the wall stopped at the 1400px column while the panel sat at
 * the window edge — and nothing can close that gap while both are true. In the
 * container the two edges meet, the page still lines up with the top bar, and
 * the panel keeps the thing that mattered: its own scroll, so a menu opened
 * inside it never fights the page.
 *
 * The wall is wrapped in a `DesignSystemProvider` rather than writing to
 * `<html>`: the page's own chrome must keep the site theme so the two are
 * visibly different things, and the provider's `{light, dark}` pair is what
 * makes dark mode follow without a second set of controls.
 */
export function ThemePage() {
  const [state, setState] = useState<ThemeState>(() =>
    typeof window === 'undefined' ? DEFAULT_STATE : decodeState(window.location.hash),
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
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
  const controls = (
    <ThemeControls state={state} onChange={patch} onReset={reset} changed={changed} />
  );

  return (
    <>
      {/* Same column as the top bar and the footer: max-w-[1400px] px-6. */}
      <div className="mx-auto flex w-full max-w-[1400px] items-start gap-6 px-6 py-8">
        <div className="min-w-0 grow">
          <header className="flex flex-col gap-3 pb-6 sm:flex-row sm:items-start sm:gap-4">
            <div className="flex max-w-2xl flex-col gap-1.5">
              <h1 className="text-3xl font-semibold tracking-tight">Theme</h1>
              <p className="text-foreground-muted text-sm">
                Pick a style, base colour, accent and chart palette, then hit{' '}
                <strong>Get code</strong>. Paste the snippet into one stylesheet and every component
                follows — no component edits. The {BLOCK_COUNT} blocks below repaint on every
                change.
              </p>
            </div>
            <div className="sm:grow" />
            <div className="flex items-center gap-2">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" className="xl:hidden">
                    <Settings aria-hidden />
                    Customise
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[22rem] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Customise</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">{controls}</div>
                </SheetContent>
              </Sheet>
              <Button variant="secondary" onClick={() => setSeed((n) => n + 1)}>
                <Sparkles aria-hidden />
                Shuffle
              </Button>
              <Button onClick={() => setDialogOpen(true)}>
                <FileText aria-hidden />
                Get code
              </Button>
            </div>
          </header>

          {/* The provider renders `display: contents`, so the frame is its own
              element — otherwise the border and padding would never paint. */}
          <div className="border-border bg-background rounded-lg border p-4 sm:p-6">
            <DesignSystemProvider tokens={tokens}>
              <ThemePreviewWall seed={seed} />
            </DesignSystemProvider>
          </div>
        </div>

        {/* Sticky from xl up; below that the same controls live in the Sheet.
            `h-[calc(100dvh-…)]` gives it its own scrollport so a long rail
            never drags the page with it. */}
        <aside
          aria-label="Theme controls"
          className="border-border bg-card sticky top-[4.5rem] hidden h-[calc(100dvh-6rem)] w-80 shrink-0 overflow-y-auto rounded-lg border p-5 xl:block"
        >
          {controls}
          <Button className="mt-5 w-full" onClick={() => setDialogOpen(true)}>
            <FileText aria-hidden />
            Get code
          </Button>
        </aside>
      </div>

      <GetCodeDialog open={dialogOpen} onOpenChange={setDialogOpen} state={state} />
    </>
  );
}
