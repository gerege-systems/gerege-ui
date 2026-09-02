import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ArrowLeft } from '@/icons';
import { routeToHash } from '../routing';
import { BlockCode, CopyBlockButton, useBlockSource, usedExports } from '../uiblocks/BlockSource';
import type { UiBlock } from '../uiblocks/registry';

/** `#blocks/<slug>` — one block, live and in source. */
export function BlockDocPage({ block }: { block: UiBlock }) {
  const source = useBlockSource(block.file);
  const exports = typeof source === 'string' ? usedExports(source) : [];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <a href={`#${routeToHash({ kind: 'blocks-index' })}`}>
          <ArrowLeft aria-hidden />
          All blocks
        </a>
      </Button>

      <header className="flex flex-col gap-3 pb-6 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex max-w-2xl flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{block.name}</h1>
            <Badge tone="neutral">{block.category}</Badge>
          </div>
          <p className="text-foreground-muted text-sm">{block.description}</p>
        </div>
        <div className="sm:grow" />
        <CopyBlockButton file={block.file} size="md" />
      </header>

      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="pt-4">
          <div className="border-border bg-background-subtle rounded-lg border p-6">
            <div className="mx-auto max-w-xl">
              <block.Component />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="code" className="pt-4">
          <BlockCode file={block.file} />
        </TabsContent>
      </Tabs>

      {exports.length > 0 && (
        <section className="flex flex-col gap-2 pt-6">
          <h2 className="text-sm font-semibold">From the library</h2>
          <div className="flex flex-wrap gap-2">
            {exports.map((name) => (
              <Badge key={name} tone="neutral">
                {name}
              </Badge>
            ))}
          </div>
          <p className="text-foreground-subtle text-xs">
            The block itself is not exported — copy the file and it is yours to change.
          </p>
        </section>
      )}
    </div>
  );
}
