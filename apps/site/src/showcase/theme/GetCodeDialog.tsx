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
import { changedCount, encodeState, generateCss, type ThemeState } from './editor-model';

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
  const css = generateCss(state, true);
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
            Хоёр алхам: сан суулгах, доорх блокийг style файлдаа буулгах.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">1. Сан суулгах</h3>
            <CodeBlock language="bash" code="pnpm add @gerege-systems/ui" />
          </section>

          <section className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">2. Style файлдаа буулгах</h3>
              <code className="text-foreground-subtle font-mono text-xs">app/globals.css</code>
              <span className="grow" />
              <span className="text-foreground-subtle text-xs">
                {changed === 0 ? 'токен өөрчлөгдөөгүй' : `${changed} токен`}
              </span>
            </div>
            <CodeBlock language="css" code={css} />
          </section>

          <p className="text-foreground-muted text-sm">
            Компонентууд өнгө, радиусаа шууд бичдэггүй — зөвхөн эдгээр токеноос уншдаг. Тиймээс
            блокийг буулгамагц бүх компонент шинэ загвараар гарна, өөрчлөөгүй токенууд сангийн
            default дээрээ үлдэнэ.
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={copyLink}>
            {copiedLink ? <Check aria-hidden /> : <Copy aria-hidden />}
            {copiedLink ? 'Хуулагдлаа' : 'Холбоос хуулах'}
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Хаах
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
