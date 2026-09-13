/**
 * Route inventory for the data-driven specs.
 *
 * Component + guide slugs are listed by hand (the registries import React
 * docs modules, which Playwright's Node runner can't load); docs.spec.ts
 * cross-checks the list against the live index pages so drift fails loudly.
 * Template metadata mirrors src/showcase/blocks/meta.ts + blocks/admin/data.ts.
 */

export const COMPONENT_SLUGS = [
  'accordion',
  'alert',
  'avatar',
  'badge',
  'breadcrumbs',
  'button',
  'calendar',
  'card',
  'carousel',
  'chart',
  'checkbox',
  'combobox',
  'command-palette',
  'context-menu',
  'data-grid',
  'date-picker',
  'design-system-provider',
  'dialog',
  'drawer',
  'dropdown-menu',
  'empty-state',
  'error-state',
  'file-upload',
  'form',
  'format',
  'hooks',
  'icon',
  'icon-button',
  'input',
  'kbd',
  'multi-select',
  'pagination',
  'popover',
  'progress',
  'radio-group',
  'relative-time',
  'scroll-area',
  'select',
  'separator',
  'sheet',
  'sidebar',
  'skeleton',
  'slider',
  'snackbar',
  'spinner',
  'stepper',
  'switch',
  'table',
  'tabs',
  'tag-input',
  'textarea',
  'timeline',
  'toast',
  'tooltip',
  'top-nav',
  'tree',
] as const;

export const GUIDE_SLUGS = [
  'quickstart',
  'theming',
  'accessibility',
  'forms',
  'dark-mode',
  'responsive',
  'migration',
] as const;

/** Showcase chrome pages (not templates). */
export const DOC_PAGES: { name: string; hash: string }[] = [
  { name: 'home', hash: '' },
  { name: 'components-index', hash: 'components' },
  { name: 'templates-index', hash: 'templates' },
  { name: 'guides-index', hash: 'guides' },
  ...COMPONENT_SLUGS.map((s) => ({ name: `component/${s}`, hash: `components/${s}` })),
  ...GUIDE_SLUGS.map((s) => ({ name: `guide/${s}`, hash: `guides/${s}` })),
  ...['admin', 'auth', 'landing', 'news', 'ecommerce'].map((s) => ({
    name: `template-doc/${s}`,
    hash: `templates/${s}`,
  })),
];

export const ADMIN_LAYOUTS = ['sidebar', 'sidebar-module', 'topnav', 'topnav-module'] as const;

/**
 * Admin pages with real, layout-sensitive content (ALL_SECTIONS in
 * blocks/admin/data.ts). These run in every layout.
 */
export const ADMIN_CORE_PAGES = [
  'overview',
  'analytics',
  'projects',
  'inbox',
  'members',
  'reports',
  'settings',
  'billing',
  'apikeys', // the permission-denied (403) page
] as const;

/**
 * CRM / Finance / Content / Admin module stubs — identical EmptyState bodies,
 * so a layout bug would show on the core pages first. Covered in the `sidebar`
 * layout only to keep the matrix (and CI wall-clock) proportional.
 */
export const ADMIN_STUB_PAGES = [
  'customers',
  'deals',
  'pipeline',
  'segments',
  'invoices',
  'payments',
  'fin-reports',
  'pages',
  'media',
  'comments',
  'audit',
  'roles',
] as const;

/** Every navigable admin page. */
export const ADMIN_PAGES = [...ADMIN_CORE_PAGES, ...ADMIN_STUB_PAGES] as const;

export interface TemplateRoute {
  /** Stable id used in test titles. */
  name: string;
  hash: string;
  /** `app` shells lock to the viewport; `page` shells scroll the document. */
  shell: 'app' | 'page';
}

export const TEMPLATE_ROUTES: TemplateRoute[] = [
  ...ADMIN_LAYOUTS.flatMap((layout) =>
    (layout === 'sidebar' ? ADMIN_PAGES : ADMIN_CORE_PAGES).map((page) => ({
      name: `admin/${layout}/${page}`,
      hash: `preview/admin/app/${layout}/${page}`,
      shell: 'app' as const,
    })),
  ),
  ...['signin', 'signup', 'forgot', 'magic'].map((s) => ({
    name: `auth/${s}`,
    hash: `preview/auth/${s}`,
    shell: 'page' as const,
  })),
  ...['home', 'signup'].map((s) => ({
    name: `landing/${s}`,
    hash: `preview/landing/${s}`,
    shell: 'page' as const,
  })),
  ...['home', 'article'].map((s) => ({
    name: `news/${s}`,
    hash: `preview/news/${s}`,
    shell: 'page' as const,
  })),
  ...['shop', 'product', 'cart'].map((s) => ({
    name: `ecommerce/${s}`,
    hash: `preview/ecommerce/${s}`,
    shell: 'page' as const,
  })),
];

export const THEMES = ['light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

export const VIEWPORTS = {
  xs: { width: 320, height: 640 },
  sm: { width: 375, height: 740 },
  md: { width: 768, height: 1024 },
  lg: { width: 1280, height: 800 },
} as const;
