import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Check, Copy } from '@/icons';
import { CodeBlock } from '../widgets/CodeBlock';
import { loadBlockSource } from './registry';

/** Fetches a block's own file. `null` while loading, `false` on failure. */
export function useBlockSource(file: string): string | null | false {
  const [source, setSource] = useState<string | null | false>(null);
  useEffect(() => {
    let live = true;
    setSource(null);
    loadBlockSource(file).then(
      (s) => live && setSource(s),
      () => live && setSource(false),
    );
    return () => {
      live = false;
    };
  }, [file]);
  return source;
}

/** The exports a block pulls from the library — read off its own import line. */
export function usedExports(source: string): string[] {
  const m = /import \{([^}]*)\} from '@gerege-systems\/ui';/.exec(source);
  if (!m) return [];
  return m[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Copies a block's file. Loads it on click so the listing stays light. */
export function CopyBlockButton({ file, size = 'sm' }: { file: string; size?: 'sm' | 'md' }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(await loadBlockSource(file));
      setState('copied');
    } catch {
      setState('failed');
    }
    window.setTimeout(() => setState('idle'), 1600);
  };
  return (
    <Button variant="secondary" size={size} onClick={copy}>
      {state === 'copied' ? <Check aria-hidden /> : <Copy aria-hidden />}
      {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy code'}
    </Button>
  );
}

/** The code panel used on a block's own page. */
export function BlockCode({ file }: { file: string }) {
  const source = useBlockSource(file);
  if (source === null) {
    return (
      <div className="border-border bg-background-subtle text-foreground-subtle rounded-md border p-6 text-sm">
        Loading source…
      </div>
    );
  }
  if (source === false) {
    return (
      <div className="border-danger-border bg-danger-subtle text-danger-foreground rounded-md border p-6 text-sm">
        The source could not be loaded. Reload the page, or read the file in the repository.
      </div>
    );
  }
  return <CodeBlock language="tsx" code={source} />;
}
