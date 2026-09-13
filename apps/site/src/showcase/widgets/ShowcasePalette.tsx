import { useEffect, useMemo, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/CommandPalette';
import { componentDocs } from '../registry/components';
import { templateDocs } from '../registry/templates';
import { guideDocs } from '../registry/guides';
import { previewUrl, routeToHash } from '../routing';
import { GITHUB_URL } from '../site.config';
import { useTheme } from '../theme/theme-context';

/**
 * ⌘K palette — jump to any component, template, or guide, open a template
 * preview in a new tab, or toggle the theme. Navigation is hash-based so a
 * selection just sets `location.hash`.
 */
export function ShowcasePalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toggleTheme } = useTheme();

  const components = useMemo(
    () =>
      componentDocs.map((d) => ({
        value: `${d.name} ${d.group} ${d.slug}`,
        label: d.name,
        hint: d.group,
        href: routeToHash({ kind: 'component', slug: d.slug }),
      })),
    [],
  );
  const templates = useMemo(
    () =>
      templateDocs.map((d) => ({
        value: `${d.name} template ${d.slug}`,
        label: d.name,
        slug: d.slug,
      })),
    [],
  );
  const guides = useMemo(
    () =>
      guideDocs.map((d) => ({
        value: `${d.title} guide ${d.slug}`,
        label: d.title,
        href: routeToHash({ kind: 'guide', slug: d.slug }),
      })),
    [],
  );

  // The block registry carries every live block, so it is fetched the first
  // time the palette opens rather than shipped with the top bar.
  const [blocks, setBlocks] = useState<
    { value: string; label: string; hint: string; href: string }[]
  >([]);
  useEffect(() => {
    if (!open || blocks.length) return;
    let live = true;
    import('../uiblocks/registry').then((m) => {
      if (!live) return;
      setBlocks(
        m.UI_BLOCKS.map((b) => ({
          value: `${b.name} block ${b.category} ${b.slug}`,
          label: b.name,
          hint: b.category,
          href: routeToHash({ kind: 'block', slug: b.slug }),
        })),
      );
    });
    return () => {
      live = false;
    };
  }, [open, blocks.length]);

  const go = (hash: string) => {
    window.location.assign(hash.startsWith('#') ? hash : `#${hash}`);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Jump to component, block, template, guide, or theme…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>

        <CommandGroup heading="Components">
          {components.map((it) => (
            <CommandItem key={it.href} value={it.value} onSelect={() => go(it.href)}>
              <span>{it.label}</span>
              <span className="text-foreground-subtle ml-auto text-xs">{it.hint}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Templates (open in new tab)">
          {templates.map((it) => (
            <CommandItem
              key={it.slug}
              value={it.value}
              onSelect={() => {
                window.open(previewUrl(it.slug), '_blank', 'noopener,noreferrer');
                onOpenChange(false);
              }}
            >
              <span>{it.label}</span>
              <span className="text-foreground-subtle ml-auto text-xs">Preview ↗</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Guides">
          {guides.map((it) => (
            <CommandItem key={it.href} value={it.value} onSelect={() => go(it.href)}>
              <span>{it.label}</span>
              <span className="text-foreground-subtle ml-auto text-xs">Guide</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Blocks">
          {blocks.map((it) => (
            <CommandItem key={it.href} value={it.value} onSelect={() => go(it.href)}>
              <span>{it.label}</span>
              <span className="text-foreground-subtle ml-auto text-xs">{it.hint}</span>
            </CommandItem>
          ))}
          <CommandItem
            value="theme editor tokens accent style depth radius"
            onSelect={() => go(routeToHash({ kind: 'theme' }))}
          >
            <span>Theme editor</span>
            <span className="text-foreground-subtle ml-auto text-xs">Theme</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Actions">
          <CommandItem
            value="toggle theme dark light"
            onSelect={() => {
              toggleTheme();
              onOpenChange(false);
            }}
          >
            Toggle theme
          </CommandItem>
          <CommandItem
            value="github source repository"
            onSelect={() => {
              window.open(GITHUB_URL, '_blank', 'noopener,noreferrer');
              onOpenChange(false);
            }}
          >
            Open GitHub ↗
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
