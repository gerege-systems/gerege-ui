/**
 * Central showcase constants — repository links, package coordinates, version,
 * and the brand presets surfaced by the on-page brand switcher. Keeping these
 * in one place means a repo rename or version bump touches a single file.
 */
import type { BrandName } from '@gerege-systems/ui';
import { ACCENT_PRESETS, oklchToHex } from './theme/editor-model';

export const PKG_NAME = '@gerege-systems/ui';
/** Injected by vite.config.ts from packages/ui/package.json. */
declare const __UI_VERSION__: string;
export const VERSION: string = typeof __UI_VERSION__ === 'string' ? __UI_VERSION__ : '0.0.0';

export const GITHUB_URL = 'https://github.com/gerege-systems/gerege-ui';
export const NPM_URL = 'https://www.npmjs.com/package/@gerege-systems/ui';
export const CHANGELOG_URL = `${GITHUB_URL}/blob/main/packages/ui/CHANGELOG.md`;

/** Source-file link bases (monorepo layout). */
export const SRC_UI = `${GITHUB_URL}/blob/main/packages/ui/src/components/ui`;
/** Blocks (page templates) live in the showcase, not the published package. */
export const SRC_BLOCKS = `${GITHUB_URL}/blob/main/apps/site/src/showcase/blocks`;

/**
 * Accent presets the top-bar switcher cycles through: the library's own
 * `brandPresets`, as listed by the theme editor (one list, one set of numbers).
 * `swatch` is a plain hex so the menu reads correctly regardless of the active
 * accent.
 */
export interface BrandOption {
  name: BrandName;
  label: string;
  description: string;
  swatch: string;
}

export const BRANDS: BrandOption[] = ACCENT_PRESETS.filter((p) => p.library).map((p) => ({
  name: p.library as BrandName,
  label: p.label,
  description: p.hint,
  swatch: oklchToHex(p.l, p.c, p.h),
}));
