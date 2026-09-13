import { useState } from 'react';
import { Check, Copy } from '@/icons';
import { cn } from '@/lib/utils';
import { highlight } from './highlight';

interface CodeBlockProps {
  code: string;
  /** Display language label (tsx, css, bash, …) shown in the top-right. */
  language?: string;
  className?: string;
}

/**
 * Minimal pre/code block with a copy-to-clipboard button.
 * No syntax highlighting — keeps the showcase bundle small.
 */
export function CodeBlock({ code, language = 'tsx', className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore — older browsers / non-secure contexts
    }
  };

  return (
    <div
      className={cn(
        'code-block group border-border bg-card relative overflow-hidden rounded-md border font-mono text-xs leading-relaxed',
        className,
      )}
    >
      <div className="border-border bg-background-subtle/60 flex items-center justify-between border-b px-3 py-1.5">
        <span className="text-foreground-subtle text-xs font-medium tracking-wider uppercase">
          {language}
        </span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
          className="text-foreground-muted hover:bg-background-muted hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded-sm px-1.5 py-1 text-xs outline-hidden transition-colors focus-visible:ring-2"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        className="text-foreground scroll-region max-h-[70vh] overflow-auto p-4"
        tabIndex={0}
        role="region"
        aria-label={`${language} code`}
      >
        <code>{highlight(code, language)}</code>
      </pre>
    </div>
  );
}
