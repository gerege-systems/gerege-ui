import { componentDocs } from '../registry/components';
import { templateDocs } from '../registry/templates';
import { guideDocs } from '../registry/guides';
import type { Route } from '../routing';
import type { DocSidebarSection } from './DocSidebar';

/**
 * Build the sidebar sections + top links for each page kind.
 * Same sidebar shape across components / templates / guides — only the
 * active highlight differs.
 */

export function buildComponentSidebar(): DocSidebarSection[] {
  return [
    {
      title: 'Components',
      kind: 'component',
      entries: componentDocs.map((d) => ({
        slug: d.slug,
        label: d.name,
        group: d.group,
      })),
    },
  ];
}

export function buildTemplateSidebar(): DocSidebarSection[] {
  return [
    {
      title: 'Templates',
      kind: 'template',
      entries: templateDocs.map((d) => ({
        slug: d.slug,
        label: d.name,
        group: 'Templates',
      })),
    },
  ];
}

export function buildGuideSidebar(): DocSidebarSection[] {
  return [
    {
      title: 'Guides',
      kind: 'guide',
      entries: guideDocs.map((d) => ({
        slug: d.slug,
        label: d.title,
        group: 'Guides',
      })),
    },
  ];
}

export const docTopLinks: { label: string; route: Route }[] = [
  { label: 'Overview', route: { kind: 'home' } },
  { label: 'Components', route: { kind: 'components-index' } },
  { label: 'Templates', route: { kind: 'templates-index' } },
  { label: 'Guides', route: { kind: 'guides-index' } },
  { label: 'Blocks', route: { kind: 'blocks-index' } },
  { label: 'Theme', route: { kind: 'theme' } },
];

type Kind = 'component' | 'template' | 'guide';

/**
 * Returns the sidebar sections for the two kinds NOT matching `currentKind`.
 * Passed to DocLayout as `crossKindSections` so the search input can surface
 * matches from other docs sections without showing them when idle.
 */
export function buildCrossKindSections(currentKind: Kind) {
  const others: ReturnType<typeof buildComponentSidebar>[number][] = [];
  if (currentKind !== 'component') others.push(...buildComponentSidebar());
  if (currentKind !== 'template') others.push(...buildTemplateSidebar());
  if (currentKind !== 'guide') others.push(...buildGuideSidebar());
  return others;
}
