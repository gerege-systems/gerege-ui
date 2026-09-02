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
 * The panel is docked to the viewport rather than sitting in the page column:
 * as a column it competed with the page for the scroll, and any menu opened
 * from it froze the page underneath it. Docked, it owns its own scroll and the
 * wall keeps the site's normal column width.
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
      <div className="mx-auto w-full max-w-[1400px] px-6 py-8 xl:pr-[21rem]">
        <header className="flex flex-col gap-3 pb-6 sm:flex-row sm:items-start sm:gap-4">
          <div className="flex max-w-2xl flex-col gap-1.5">
            <h1 className="text-3xl font-semibold tracking-tight">Theme</h1>
            <p className="text-foreground-muted text-sm">
              Pick a style, base colour, accent and chart palette, then hit{' '}
              <strong>Get code</strong>. Paste the snippet into one stylesheet and every component
              follows — no component edits. The {BLOCK_COUNT} blocks below repaint on every change.
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

      {/* Docked panel from xl up; below that the same controls live in the Sheet. */}
      <aside
        aria-label="Theme controls"
        className="border-border bg-card fixed top-14 right-0 bottom-0 z-[var(--z-sticky)] hidden w-80 overflow-y-auto border-l p-5 xl:block"
      >
        {controls}
        <Button className="mt-5 w-full" onClick={() => setDialogOpen(true)}>
          <FileText aria-hidden />
          Get code
        </Button>
      </aside>

      <GetCodeDialog open={dialogOpen} onOpenChange={setDialogOpen} state={state} />
    </>
  );
}
