import type { ReactNode } from 'react';

/* -----------------------------------------------------------------------------
 *  Shared metadata shapes for component / template / guide documentation.
 * --------------------------------------------------------------------------- */

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface PropGroup {
  title?: string;
  rows: PropRow[];
}

export interface Example {
  /** Short title used as the section heading on the doc page. */
  title: string;
  /** Optional 1–2 sentence explainer rendered above the demo. */
  description?: string;
  /** Live, fully interactive React node rendered in the Preview tab. */
  preview: ReactNode;
  /** Verbatim source code shown in the Code tab + Copy button. */
  code: string;
  /** Optional override for the preview surface (e.g. add height / padding). */
  surfaceClassName?: string;
}

export type ComponentGroup =
  | 'Buttons'
  | 'Inputs'
  | 'Feedback'
  | 'Overlays'
  | 'Navigation'
  | 'Layout'
  | 'Data Display'
  | 'Typography'
  | 'Utilities';

export interface ComponentDoc {
  /** URL slug — e.g. 'button'. */
  slug: string;
  /** Display name — e.g. 'Button'. */
  name: string;
  group: ComponentGroup;
  /** One-line tagline shown under the title and in lists. */
  description: string;
  /** Names re-exported from `@gerege-systems/ui` for this component. */
  exports: string[];
  /** Package entry the exports come from. Default `@gerege-systems/ui`. */
  importPath?: string;
  /**
   * Which `UiStrings` keys the component reads (e.g. `dialog.close`). Shown
   * as an i18n note on the doc page; override via `<DesignSystemProvider strings>`.
   */
  i18n?: string;
  /** Path under src/components/ui/ — used for the GitHub source link. */
  sourceFile: string;
  examples: Example[];
  /**
   * Hand-written prop rows. Rendered on top of the auto-generated tables:
   * generated rows come first, manual rows with the same name override them,
   * and new names are appended.
   */
  api?: PropGroup[];
  accessibility?: string[];
  /** Keyboard interaction table — `{ key: 'Esc', action: 'Close the dialog' }`. */
  keyboard?: { key: string; action: string }[];
  /** Usage guidance rendered as side-by-side Do / Don't lists. */
  guidelines?: { do: string[]; dont: string[] };
  /** Cross-links rendered at the bottom of the page. */
  related?: { slug: string; reason: string }[];
}

/* TemplateDoc lived here when templates were thin wrappers around exported
 * pattern components. Templates are now copy-paste blocks — see the BlockDoc
 * type in ../blocks/registry, re-exported as TemplateDoc from ./templates. */

export interface GuideDoc {
  slug: string;
  title: string;
  description: string;
  /** Rendered as the body of the guide page. */
  body: ReactNode;
}
