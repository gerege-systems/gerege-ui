/**
 * The colour pairs every accent — the library default, a `[data-accent]`
 * preset, a `brandPresets` entry, or a custom one from the theme editor —
 * must hold to (WCAG 1.4.3, 4.5:1). One list, read by the library's token
 * test (packages/ui/src/__tests__/tokens.test.ts) and by the showcase theme
 * editor's live contrast report, so the two cannot drift.
 *
 * Token names are bare (no `--`): callers prefix as their source needs.
 * Not exported from the package entry — it is a rule, not a runtime API.
 */
export interface AccentPair {
  /** Stable key for callers that report per pair. */
  key: 'button' | 'text' | 'muted' | 'soft' | 'soft-text';
  /** What the pair is in the UI, for a human-readable report. */
  label: string;
  fg: string;
  bg: string;
  min: number;
}

export const ACCENT_PAIRS: readonly AccentPair[] = [
  // Button text on the accent fill (`text-on-accent` on `bg-accent`).
  { key: 'button', label: 'button text', fg: 'accent-foreground', bg: 'accent', min: 4.5 },
  // The accent as link text on the page background.
  { key: 'text', label: 'link text', fg: 'accent', bg: 'background', min: 4.5 },
  // The accent as text on a hovered / highlighted row (`text-accent` inside
  // `hover:bg-background-muted`, a menu's `data-[highlighted]` row).
  { key: 'muted', label: 'text on muted surface', fg: 'accent', bg: 'background-muted', min: 4.5 },
  // Text on the soft accent surface (`text-on-accent-soft` on `bg-accent-soft`).
  {
    key: 'soft',
    label: 'soft surface',
    fg: 'accent-subtle-foreground',
    bg: 'accent-subtle',
    min: 4.5,
  },
  // The accent as text on its own soft surface (`bg-accent-soft text-accent`).
  {
    key: 'soft-text',
    label: 'accent on soft surface',
    fg: 'accent',
    bg: 'accent-subtle',
    min: 4.5,
  },
];
