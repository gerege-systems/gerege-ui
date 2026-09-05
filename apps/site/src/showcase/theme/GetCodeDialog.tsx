import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Check, Copy } from '@/icons';
import { CodeBlock } from '../widgets/CodeBlock';
import {
  changedCount,
  encodeState,
  generateCss,
  type CssSetup,
  type ThemeState,
} from './editor-model';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: ThemeState;
}

/**
 * Hands over the two things a consumer needs: the install line and the token
 * block. Only tokens that differ from the library default are in the block, so
 * removing the theme later means deleting what you pasted.
 */
export function GetCodeDialog({ open, onOpenChange, state }: Props) {
  const [copiedLink, setCopiedLink] = useState(false);
  // The README documents two ways in: Tailwind v4 sharing the tokens, or the
  // precompiled sheet for apps without Tailwind. The imports differ; the
  // token block is the same.
  const [setup, setSetup] = useState<CssSetup>('tailwind');
  const css = generateCss(state, setup);
  const changed = changedCount(state);
  const shareUrl =
    typeof window === 'undefined'
      ? ''
      : `${window.location.origin}${window.location.pathname}#theme${encodeState(state)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 1400);
    } catch {
      // ignore — older browsers / non-secure contexts
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Get code</DialogTitle>
          <DialogDescription>
            Two steps: install the package, paste the block into your stylesheet.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">1. Install</h3>
            <CodeBlock language="bash" code="pnpm add @gerege-systems/ui" />
          </section>

          <section className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-medium">2. Paste into your stylesheet</h3>
              <code className="text-foreground-subtle font-mono text-xs">app/globals.css</code>
              <span className="grow" />
              <span className="text-foreground-subtle text-xs">
                {changed === 0 ? 'no changes' : `${changed} tokens`}
              </span>
            </div>
            <div role="group" aria-label="Stylesheet setup" className="flex gap-2">
              {(
                [
                  ['tailwind', 'Tailwind v4'],
                  ['plain', 'No Tailwind'],
                ] as const
              ).map(([value, label]) => (
                <Button
                  key={value}
                  size="sm"
                  variant={setup === value ? 'primary' : 'secondary'}
                  aria-pressed={setup === value}
                  onClick={() => setSetup(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
            <CodeBlock language="css" code={css} />
            <p className="text-foreground-subtle text-xs">
              {setup === 'tailwind'
                ? 'Your app compiles the library’s classes with its own Tailwind; theme.css shares the tokens.'
                : 'styles.css is the precompiled sheet — tokens, base layer and every utility the components use.'}
            </p>
          </section>

          <p className="text-foreground-muted text-sm">
            Components never hard-code a colour or a radius — they read these tokens. So the moment
            this block lands, every component follows it, and anything you did not change stays on
            the library default.
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={copyLink}>
            {copiedLink ? <Check aria-hidden /> : <Copy aria-hidden />}
            {copiedLink ? 'Copied' : 'Copy link'}
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
