import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DesignSystemProvider } from '@/components/ui/DesignSystemProvider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { FileText, Settings, Sparkles } from '@/icons';
import { GetCodeDialog } from '../theme/GetCodeDialog';
import { ThemeControls } from '../theme/ThemeControls';
import { FONTS, MONO_FONTS, findFont, googleFontsUrl } from '../theme/fonts';
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
 * The panel is docked to the viewport: flush right, starting under the sticky
 * top bar, with its own scrollport so a menu opened inside it never fights the
 * page. The wall then cannot also stop at the site's centred 1400px column —
 * that combination is what left dead space between the two — so from xl the
 * content drops the width cap and is padded by the panel's width instead. It
 * runs edge to edge up to the panel; the trade is that on very wide screens
 * the wall is wider than the top bar's column.
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
  const written = useRef('');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const next = `#theme${encodeState(state)}`;
    written.current = next;
    if (window.location.hash !== next) {
      window.history.replaceState(null, '', next);
    }
  }, [state]);

  // …and read it back when it changes from outside — pasting a shared theme
  // link while already on this page used to do nothing, because the state was
  // only ever decoded on mount and the effect above then overwrote the hash.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onHash = () => {
      if (window.location.hash !== written.current) setState(decodeState(window.location.hash));
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Pull the chosen families in on demand — the page ships with Geist only, and
  // a theme is not judgeable in a fallback face.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const url = googleFontsUrl([
      findFont(FONTS, state.fontSans).google,
      findFont(FONTS, state.fontHeading).google,
      findFont(MONO_FONTS, state.fontMono).google,
    ]);
    const id = 'theme-editor-fonts';
    const existing = document.getElementById(id) as HTMLLinkElement | null;
    if (!url) {
      existing?.remove();
      return;
    }
    const link = existing ?? document.createElement('link');
    if (!existing) {
      link.id = id;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (link.href !== url) link.href = url;
  }, [state.fontSans, state.fontHeading, state.fontMono]);

  const patch = useCallback((p: Partial<ThemeState>) => setState((s) => ({ ...s, ...p })), []);
  const reset = useCallback(() => setState(DEFAULT_STATE), []);

  const tokens = deriveTokens(state);
  const changed = changedCount(state);
  const controls = (
    <ThemeControls state={state} onChange={patch} onReset={reset} changed={changed} />
  );

  return (
    <>
      {/* The site column, centred in the window exactly like every other page,
          so the content starts under the brand mark rather than 95px to its
          left. The right padding is what the panel eats: it shrinks as the
          window grows (the centred column's own right margin already covers
          part of the panel) and never drops below the normal px-6. */}
      <div className="mx-auto w-full max-w-[1400px] px-6 py-8 xl:pr-[clamp(1.5rem,calc(21.5rem-(100vw-1400px)/2),21.5rem)]">
        <div className="min-w-0">
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
                    <SheetDescription>
                      Style, base colour, accent and chart palette. Changes apply to the preview
                      behind this panel.
                    </SheetDescription>
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

          {/* No frame: every block is a Card already, so a border around the
              wall was one more box drawn around thirty boxes. */}
          {/* data-style drives the library's per-component style layer; the
              provider carries the colour tokens. The two compose. */}
          {/* font-sans here on purpose: html already resolved font-family from
              the old value, so a nested --font-sans override changes nothing
              unless something re-applies it. */}
          <div data-style={state.style} className="font-sans">
            <DesignSystemProvider tokens={tokens}>
              <ThemePreviewWall seed={seed} />
            </DesignSystemProvider>
          </div>
        </div>
      </div>

      {/* Docked from xl up; below that the same controls live in the Sheet.
          Full height and above the sticky top bar (--z-overlay > --z-sticky),
          so the panel reads as one surface rather than a strip beneath the
          site chrome. */}
      <aside
        aria-label="Theme controls"
        className="border-border bg-card fixed inset-y-0 right-0 z-[var(--z-overlay)] hidden w-80 overflow-y-auto border-l p-5 xl:block"
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
