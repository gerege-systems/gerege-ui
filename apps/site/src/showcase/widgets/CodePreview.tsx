import { useState, type ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';
import { cn } from '@/lib/utils';

interface CodePreviewProps {
  preview: ReactNode;
  code: string;
  language?: string;
  /** Tweak the preview surface — e.g. add min-height for overlays. */
  surfaceClassName?: string;
}

/**
 * shadcn-style "Preview / Code" tab widget. Tabs hold their own state per
 * instance so a page can flip individual examples without affecting others.
 */
export function CodePreview({
  preview,
  code,
  language = 'tsx',
  surfaceClassName,
}: CodePreviewProps) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');

  return (
    <div className="border-border bg-background overflow-hidden rounded-lg border">
      <div className="border-border bg-background-subtle/60 flex items-center border-b px-2">
        <Tab active={tab === 'preview'} onClick={() => setTab('preview')}>
          Preview
        </Tab>
        <Tab active={tab === 'code'} onClick={() => setTab('code')}>
          Code
        </Tab>
      </div>

      {tab === 'preview' ? (
        <div className={cn('flex min-h-[180px] items-center justify-center p-8', surfaceClassName)}>
          {preview}
        </div>
      ) : (
        <CodeBlock code={code} language={language} className="rounded-none border-0" />
      )}
    </div>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'relative px-3 py-2 text-xs font-medium outline-hidden transition-colors',
        'focus-visible:ring-ring rounded-sm focus-visible:ring-2',
        active
          ? 'text-foreground after:bg-accent after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px'
          : 'text-foreground-muted hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}
