# @gerege/ui

> Releases up to **0.11.2** were published as `@craftzbay/ui` from
> [craftzbay/craftzbay-ui](https://github.com/craftzbay/craftzbay-ui). The project split into a
> separate Gerege Systems line on 2026-09-02; entries below that point carry the old package name.

## 0.11.2

### Patch Changes

- 88415b8: Point the showcase links and package `homepage` at https://ui.craftzbay.com, the
  canonical home of the design system.

## 0.11.1

### Patch Changes

- 4a05b8f: Input: the inner `<input>` now stretches to the field's height, so the
  focusable target is the full 32/36/40px control instead of the ~20px text box.
  Below 24px axe's `target-size` rule only passes while nothing sits close by,
  which broke as soon as the field was packed into a toolbar.
- ad64552: Input: `type="search"` no longer shows two clear buttons. The native WebKit
  search cancel button is suppressed so only the `clearable` button renders.

  TopNav: the `search` slot keeps a fixed position from `md` up. The bar now
  lays out as three tracks, so a wider logo slot (breadcrumbs that change per
  page) no longer shifts the search box sideways on navigation.

- 4d3b80f: Point the showcase links and package `homepage` at https://ui.gecore.mn, the
  new home of the documentation site.

## 0.11.0

### Minor Changes

- 5ff1a7b: Audit round 2 — a11y, hydration, contrast and API consistency.

  **Fixes**
  - Calendar: selected/range days styled from tokens (RDP 9 `<td>` selector); `react-day-picker/style.css` side-effect import removed; RDP labels come from `useStrings` (mn included).
  - `brandPresets` / `DesignSystemProvider tokens`: `{ light, dark }` pairs — soft accent backgrounds no longer wash out in dark mode.
  - Hydration-safe: `useMediaQuery` (`useSyncExternalStore`), `useToast` (no module singleton shared across SSR requests), `DatePicker` default format `yyyy-MM-dd` / `locale.code`.
  - Toast: `duration: 0` keeps the toast open; `push` with an existing `id` updates in place; persistent toasts are never evicted by the 3-toast cap.
  - Drawer: `direction` is passed to vaul (drag physics follow it), close button, `dvh`.
  - Consumer `aria-label` / `aria-describedby` are merged, never overwritten (Input, Textarea, Checkbox, RadioGroup, Switch, Breadcrumbs, Sidebar, Stepper, Carousel). `hideLabel` hides only the label, not the description.
  - Combobox: filters by label (`keywords`), empty state renders for non-matching queries, `aria-controls` points at the real list, `loadOptions` rejection → error text.
  - Slider uncontrolled `showValue`; RadioGroup forwards `orientation`; Input `value={null}` handled; Textarea autoResize respects `minRows` + ResizeObserver; FileUpload drag flicker + duplicate keys; CommandPalette shortcut hook toggles without re-render; ConfirmationDialog awaits `onConfirm`.
  - Chart: one tab stop per series with arrow-key roving (was one per point), measured width (no `preserveAspectRatio="none"` distortion), negative bars, i18n `labels`.
  - Table / DataGrid: `aria-sort` only on the active column, `aria-selected` only with `role="row"` (plain rows use `data-state="selected"`), `align` on cells, sticky header via `containerClassName`/`maxHeight`, min one visible column, Date cells formatted; Pagination zero state; Progress clamps to `[0, max]`.
  - Contrast: `--border-input` and `--switch-track-off` ≥ 3:1 against both `background` and `background-muted` in light and dark. `prefers-contrast: more`, `forced-colors`, `prefers-reduced-transparency` handled in `theme.css`; scrollbar thumb always visible; reduced-motion keeps a slow opacity pulse for Spinner/indeterminate Progress.

  **Additions**
  - Button `size="xl"` (44px). Badge `icon`. `TableCell`/`TableHead` `align`. `headingLevel` on Alert/EmptyState/ErrorState. `asChild` on Card, SidebarItem, TopNavLink. Controlled `open` on Alert and SidebarGroup; controlled `columnVisibility` on DataGrid. New string keys (`drawer`, `calendar`, `topNav`, `stepper.*`, `breadcrumbs.collapsed`, `chart.summary/point/seriesNav`, `fileUpload.*`) with Mongolian translations. `mergeStrings` is a deep merge.

  **Behaviour changes (minor, 0.x)**
  - Button/IconButton `loading` no longer sets `disabled`; it uses `aria-disabled` + `aria-busy` and keeps focus. With `asChild` no spinner is rendered.
  - `Alert` is not a live region unless `live`; its title is an `h3` by default (`headingLevel`).
  - `FormError` is plain text referenced via `aria-describedby`; the form renders one `role="status"` live region. Field-level `role="alert"` removed.
  - `FormControl` no longer injects `tone`; fields style from `aria-invalid`. `tone` on Input/Select is **deprecated** and will be removed in the next major.
  - `useFieldIds` helper id suffix `-helper` → `-desc`. `Card` padding is 16px / 24px (md+). `--text-md` token removed (unused). `.line-clamp-*` utilities removed — use Tailwind's built-ins.

- f500b9c: Accessibility / localisation compliance pass (additive, no breaking changes):
  - Touch targets (WCAG 2.5.8): Checkbox, RadioGroup item, Switch `sm` and IconButton `sm` gain an invisible ≥24px hit halo; Input clear/password buttons are 24px.
  - Chart: `--chart-1` is a categorical blue (no longer aliases `--accent`); new `tableFallback` (default on, `sr-only` data table) + `showTableToggle`; every point/bar is keyboard-focusable with an `aria-label`; `y: null` breaks the line; `state="loading" | "empty" | "error"`; nice 1/2/2.5/5 axis ticks; strings moved to `UiStrings.chart`.
  - 16px inputs on mobile: Combobox, MultiSelect, TagInput, DatePicker trigger, CommandPalette input use `text-lg md:text-sm`.
  - Contrast: amber preset accent darkened to oklch(0.56 0.14 65) (4.8:1 with white); `--foreground-subtle` → hsl(215 16% 45%) (4.6:1 on `background-muted`).
  - Safe areas: Toast viewport, Sheet and Drawer pad by `env(safe-area-inset-*)` (set `viewport-fit=cover`).
  - New: `formatDate`, `formatNumber`, `formatMNT`, `<RelativeTime>`, `useDelayedLoading(ms)`, `Skeleton delay`; `UiStrings.relativeTime` (EN/MN).
  - Minor: Calendar weekday `text-xs` and `bg-accent-hover`; Sidebar root is `<nav>`; Popover content has a focus-visible ring.

- c4fe1d6: Accessibility fixes from the e2e/axe audit:
  - `Table` scroll wrapper and `ScrollArea` viewport are now focusable (`tabIndex=0`, `role="group"`, visible focus ring) with an accessible name from `strings.table.scrollRegion` / `strings.scrollArea.region`; override per instance with the new `scrollLabel` / `viewportLabel` props. `DataGrid` inherits this.
  - `Combobox`, `DatePicker` / `DateRangePicker`, `MultiSelect`, `TagInput` and `SelectTrigger` expose an accessible name when no `label` is given — the placeholder (or the default string, new `strings.select.placeholder`). With a `label`, the control carries `aria-labelledby`. A consumer `id` / `aria-label` / `aria-labelledby` is treated as an external label and left untouched.
  - `Chart` series groups get a visible keyboard focus outline (`[data-chart-series]:focus-visible` in `theme.css`; Tailwind rings do not paint on SVG `<g>`).
  - New `returnFocusTo?: RefObject<HTMLElement | null>` prop on `DialogContent`, `SheetContent` and `DrawerContent` to restore focus to a given element on close (controlled overlays opened from non-focusable or tooltip-wrapped triggers); `onCloseAutoFocus` is still forwarded and wins when it calls `preventDefault()`. Type exported as `ReturnFocusRef`.

- 2e5e8d4: Canon alignment, round 3.
  - `Dialog`: modal radius `rounded-xl` (12px).
  - `DataGrid`: default cell renders `—` with `aria-label` (`strings.dataGrid.emptyCell`, en/mn) for `null` / `undefined` / `''`.
  - `useToast`: per-variant default duration — success/info/default 4000ms, warning 6000ms, danger 0 (persistent, manual close); explicit `duration` still wins. New `TOAST_DURATIONS` export. Toast viewport uses `max-h-dvh`.
  - `Skeleton`: default `delay` is now 300ms (pass `delay={0}` for immediate render); new `minVisible` (500ms). `useDelayedLoading(ms, { minVisible })` holds `true` for at least `minVisible` once shown.
  - `theme.css`: `html { scrollbar-gutter: stable }`.
  - `ErrorState`: new `variant="403"` (permission denied) with `Locked` illustration and en/mn strings; pair with an `action` (back/home) — no retry.
  - `formatPhone(input)` → `+976 XXXX XXXX` for 8-digit Mongolian numbers (accepts `+976…`/`976…`/spaced; non-MN returned as-is); `parsePhoneMN()` → E.164. `formatMNT(n, { compact: true })` → `12.4M₮` / `850K₮`.
  - New hooks `useDebounce(value, delay = 300)` and `useDebouncedCallback(fn, delay = 300)`.
  - `IconButton` sizes now match Button heights: sm 32 / md 36 / lg 40 / new xl 44 (was 28/32/40).
  - `Calendar` / `DatePicker`: week starts on Monday by default (`weekStartsOn={1}`); popover shadow `shadow-md`.
  - `Sidebar` section labels: sentence case (removed forced `uppercase`).
  - `Chart` Y axis padding uses the spacing scale (`py-1.5`).

- 5395f74: Every interactive control edge now uses `--border-input` (≥3:1, WCAG 1.4.11): secondary/outline `Button`/`IconButton`, `Combobox`, `MultiSelect`, `DatePicker`, `TagInput`, `FileUpload` drop zone — matching Input/Select/Textarea/Checkbox/Radio. Containers (card, table, popover, divider) keep the soft `--border`.
- c4900d0: Mobile polish: `SelectTrigger` truncates its value instead of wrapping at 16px mobile text; `Pagination` collapses to prev/next + "page / count" below `sm` (page numbers and first/last from `sm` up); `TopNav` logo group may shrink (`min-w-0`) so a long tenant name truncates instead of pushing the actions off-screen.
- 2227223: Add `useModifierKey()` / `isApplePlatform()` — platform-correct shortcut hints (⌘ on Apple, Ctrl elsewhere) for `<Kbd>` labels.
- e471206: Body `overflow-wrap` is `break-word` instead of `anywhere` — `anywhere` collapsed table/flex columns (KPI deltas, selects, table cells) on narrow viewports.
- c4fe1d6: Full test suite (unit + keyboard + axe per component, SSR/hydration, hooks, token contrast, public-API guards) and the defects it surfaced:
  - Sidebar: collapsed items always have an accessible name (sr-only label no longer depends on the tooltip being open).
  - Toast: viewport region is labelled from `strings.toast.region` (was Radix's hard-coded English).
  - MultiSelect / Combobox / DatePicker: popover dialogs have an accessible name (axe `aria-dialog-name`).
  - DatePicker: reopens on the selected month (`defaultMonth`).
  - CommandDialog: focus returns to the previously focused element on close.
  - CommandSeparator: no `role="separator"` inside the listbox.
  - `formatMNT(999_999, { compact: true })` → `1M₮` (was `1,000K₮`).
  - Amber preset `--ring` darkened to 3.17:1 on `background-muted` (theme.css + `brandPresets` in sync).

## 0.10.0

### Minor Changes

- 0ce7563: Audit pass against design-research rules (2026-08-20).

  **Breaking (0.x minor):**
  - ESM-only output; CJS (`index.cjs`) removed. Per-module output (`preserveModules`) — importing `{ Button }` now costs ~9 kB gz instead of the whole library.
  - `Icon`, `iconNames`, `IconName` moved to the `@craftzbay/ui/icon` subpath (the 1.4k-icon dynamic map is opt-in).
  - `uid()` helper removed from the public surface.
  - Global `:focus-visible { outline: none }` replaced by a visible default ring; `TableHead` is no longer uppercase by default (`uppercase` prop); `ErrorState` no longer sets `role="alert"`; `Alert` uses `role="status"` except `danger`.
  - Dark-mode accent moved to accent-400 (contrast 3.6 → 5.4:1); light `--success-solid` darkened.

  **Added:**
  - `@craftzbay/ui/theme.css` — tokens + base layer for Tailwind v4 consumers (`@import "tailwindcss"; @import "tw-animate-css"; @import "@craftzbay/ui/theme.css";` + `@source`).
  - Every module ships `'use client'` — works from Next.js App Router server components.
  - Semantic tokens: `--border-input`, `--overlay`, `--tooltip(-foreground)`, `--accent-hover/active`, `--danger-hover/active`, `--surface-hover/active`, `--switch-track-off/thumb`, `--on-success/warning/danger/info` (mode-aware), `--chart-1..6`.
  - i18n: `DesignSystemProvider strings={…}`, `useStrings()`, `defaultStrings`, `mnStrings` (Mongolian built in). `Pagination labels` prop.
  - `useFieldIds` hook; `Tree` controlled `expanded`/`selected`; `Combobox selectedLabel`; `DatePicker formatDate`/`locale`/`disabledDays`; `Chart aria-label`/`title`/`showAxis`/`series`/`colors`; `TagInput label/description/error`; `FileUpload onReject`; `Card variant="interactive"` keyboard-operable; `TableRow aria-selected`.

  **Fixed:**
  - MultiSelect and Tree keyboard navigation (APG-conformant); Combobox nested-interactive clear button; Form → Input error styling; DatePicker `fromDate/toDate` now disable days; Chart accessible name + axis ticks, gradient removed; Sidebar collapsed items keep an accessible name; Pagination label association; Input password toggle keyboard-reachable, `clearable` uncontrolled; 16px inputs below `md` (no iOS zoom); `color-scheme` per theme class; `scroll-behavior` typo; `overflow-wrap: anywhere` + `font-synthesis: none` on body; Popover `min-w`; sub-12px text removed.
  - create-app: `vite-dashboard` template imported non-existent `AppShell`/`Dashboard`; smoke test now typechecks the scaffold; Geist `<link>` added to templates.

## 0.9.0

### Minor Changes

- New `<Icon name="…">` component — any lucide icon by kebab-case name, code-split
  and lazy-loaded (plus an `iconNames` export for pickers). Static icon imports
  now bypass the lucide barrel so the full set never lands in consumer bundles.

  Calendar/DatePicker fixes: month nav arrows were unclickable (caption painted
  above them); month/year dropdowns are now bounded, scrollable design-system
  Selects instead of the native full-screen `<select>`; switching month/year
  renders immediately.

  TagInput: growth capped at ~3 chip rows with internal scrolling.

## 0.8.1

### Patch Changes

- 16b9a77: Restore pointer cursor on enabled buttons and Radix triggers (Tailwind v4
  preflight resets buttons to `cursor: default`), and ship the full compiled
  design system in `styles.css` — previously the published file contained only
  react-day-picker styles, so consumers importing `@craftzbay/ui/styles.css`
  got no tokens, base layer, or utilities.

## 0.8.0

### Minor Changes

- 0770135: Auto-generated props tables, automated release pipeline confirmation, and a new CLI scaffolder.

  **Auto-generated props (library)**
  - New `scripts/generate-props.ts` parses every component under
    `src/components/ui/` with `react-docgen-typescript` and emits
    `src/showcase/registry/generated-props.ts` — a typed map of
    `{ componentName: PropGroup[] }`.
  - `ComponentDocPage` now falls back to the generated props when a doc file
    omits its `api: []` override. Sub-component props (CardHeader, DialogContent, …)
    surface automatically per exported name.
  - `pnpm gen:props` regenerates; `pnpm build` runs it automatically.
  - Result: the docs can no longer drift from the TypeScript interface.

  **CLI scaffolder — `create-craftzbay-ui` (0.1.0)**
  - New sibling package, published separately. Use via the standard
    `npm create` flow: `npm create craftzbay-ui my-app` (or `pnpm create
craftzbay-ui my-app`).
  - Templates: `vite-blank` (Card + Input + Switch starter) and
    `vite-dashboard` (AppShell + Dashboard, wired and ready).
  - Interactive prompts powered by `@clack/prompts`; supports
    `--template <id>`, `-y / --yes`, `--no-install`, `-h / --help`.
  - Detects the invoking package manager (pnpm / npm / yarn / bun) and
    runs the matching `install`.
  - Smoke test (`packages/create-app/scripts/smoke.mjs`) scaffolds each
    template into a temp dir and verifies file presence + token replacement.

  **Release CI confirmed**
  - The existing `.github/workflows/release.yml` uses `changesets/action@v1`
    and is operational. Adding `.changeset/*.md` to `main` opens a Release PR
    automatically; merging it publishes to npm + creates a GitHub release.
    See `CONTRIBUTING.md` for the new canonical flow. Local `npm publish`
    is now reserved for emergency hotfixes only.

  **Monorepo conversion**
  - Root is now a pnpm workspace (`pnpm-workspace.yaml` includes `.` and
    `packages/*`). Library stays as `@craftzbay/ui` at the root; the CLI
    lives at `packages/create-app/`.

## 0.7.1

### Patch Changes

- Hotfix: chunk load-order regression on hard refresh.
  - The 0.7.0 multi-vendor split (radix / cmdk / embla / vaul / day-picker /
    rhf / lucide each in own chunk) tripped Rollup's chunk-import graph in
    production, producing
    `Uncaught TypeError: Cannot read properties of undefined (reading 'useLayoutEffect')`
    on hard refresh. Several of those vendors import React indirectly, and
    the generated chunk graph evaluated them before `vendor-react` was ready.
  - Replaced with a conservative 2-chunk split: only React + its tight
    runtime deps (scheduler, jsx-runtime, use-sync-external-store) live in
    `vendor-react`; everything else stays in a single `vendor` chunk.
  - Added a `/favicon.svg` (previously 404'd) and tightened the index.html
    title + description.

## 0.7.0

### Minor Changes

- Mobile nav, real Dashboard chart, footer, migration guide, filterable templates,
  sidebar keyboard nav, vendor code-splitting, and 63 new tests.

  **Templates (library)**
  - `Dashboard` chart placeholder now renders a real `LineChart` with synthetic
    30-day data. Pass `chart` to override.

  **Showcase**
  - Mobile sidebar: a hamburger button now appears below the TopBar on screens
    < md, opening the full sidebar in a left Sheet drawer. Closes on navigation.
  - Sidebar search now supports keyboard nav: `↓ / ↑` cycle results, `↵` opens,
    `Esc` clears. Hint line shows under the input when results are visible.
  - TemplatesIndexPage: use-case chips are now clickable filters. Multi-select
    - clear button.
  - 404 page now uses the library's own `ErrorState` component for consistency.
  - New showcase Footer with brand, version, license, docs / project /
    resources columns. Hidden on `#preview/*` routes.
  - New Migration guide (`#guides/migration`) covering every prop addition
    from 0.4 → 0.6.
  - Home page version pill links to GitHub CHANGELOG.

  **Performance**
  - Showcase build now manually chunks vendor code (react, radix, lucide,
    cmdk, embla, vaul, react-day-picker, react-hook-form). First-paint
    bundle drops from ~244 KB gzip to ~95 KB (react) + ~78 KB (app code).
    No more "chunks larger than 500 KB" warning.

  **Tests**
  - 63 new tests across 8 new smoke-test files (one per component category):
    buttons, inputs, feedback, overlays, navigation, layout, data-display,
    form. Total test count: **87 passing**.
  - New jsdom polyfills: `IntersectionObserver` (Embla),
    `Element.scrollIntoView` (cmdk), `hasPointerCapture` / `releasePointerCapture`
    (Radix).

## 0.6.1

### Patch Changes

- Showcase fixes: never strand the user on a preview, sidebar search now finds
  matches across all three doc kinds.
  - `#preview/*` routes used to render full-bleed, hiding the showcase TopBar
    entirely. Templates like Dashboard rendered their own internal chrome and
    left no obvious way back to the docs. The ShowcaseTopBar is now always
    visible; preview routes get a slim "Live preview · <name>" banner with a
    "Back to template docs" link.
  - The sidebar search input only filtered the current kind's section (a user
    on the Components page could not find "Authentication" by typing "auth").
    When a query is active, the sidebar now searches across components,
    templates, and guides — grouped by kind, with a quick "Open" link to the
    matching index page.
  - Search input now uses `size="sm"` and a clear button.
  - 5 new tests cover the search + cross-kind behaviour.

## 0.6.0

### Minor Changes

- AppShell template + Illustrations defaults + live guides + global scrollbar polish.

  **AppShell**
  - `navSections`, `sidebar`, `topbarActions`, `search`, `user`, `profileMenu`,
    `notifications`, `onMarkAllNotificationsRead`, `onViewAllNotifications` are
    all configurable. The default still renders the same demo so existing call
    sites are unaffected.
  - `active` now accepts any string (was a closed union); legacy `AppShellNavKey`
    alias retained for typed callers.
  - `Dashboard` accepts `stats`, `chart`, `chartTitle`, `chartDescription`,
    `activity`, `activityTitle`, `headerActions` — defaults match the demo.

  **EmptyState / ErrorState**
  - `EmptyState` adds `illustration` prop. With no `icon` or `illustration` it
    renders the built-in `InboxEmpty` line illustration as a default hero —
    previously empty.
  - `ErrorState` swaps its default Lucide icon for the matching line
    illustration per variant (NotFound / ServerError / ConnectionLost). New
    `illustration` prop lets consumers override.

  **Showcase**
  - Guides now embed live interactive demos:
    - **Theming** — swap between the built-in accent presets, with primitives
      re-rendering inside the scope.
    - **Forms** — working react-hook-form sign-in form with validation + Switch.
    - **Dark mode** — live theme-toggle button bound to `<html>.dark`.
    - **Responsive** — live breakpoint indicator using `useMediaQuery`.
  - Sidebar — removed redundant section title (top-link already conveys
    context); group sub-headers (Buttons, Inputs, …) retained.
  - Global subtle scrollbars (thin, transparent track, visible only on hover
    of the scroll container) replace platform-default chrome.

## 0.5.0

### Minor Changes

- Real docs system + parameterized page templates.

  **Docs (consumer-facing showcase)**
  - 51 per-component doc pages (`#components/<slug>`) with description,
    import, multiple example variants, full props table, accessibility
    notes, and related-component links.
  - 11 template doc pages (`#templates/<slug>`) with usage code, API
    reference, and live full-bleed preview links.
  - 6 long-form guides (Quick start, Theming, Accessibility, Forms,
    Dark mode, Responsive).
  - New sidebar nav with filterable search; ⌘K command palette now jumps
    across all components, templates, and guides.

  **Patterns → real templates (library API)**
  Previously most patterns rendered hard-coded demo content. These now
  accept data and render through it. All props are optional with defaults
  matching the old demo content, so existing call sites are unaffected.
  - `SettingsPage` — `sections: SettingsSection[]` (id, label, icon?, render)
  - `RecordDetail` — `header`, `tabs`, `sidePanel`
  - `Pricing` — `tiers: PricingTier[]`, `title`, `subtitle`
  - `Onboarding<T>` — `steps: OnboardingStep<T>[]`, `initialData`, `onComplete`,
    with shared step context (next / prev / data / setData)
  - `FirstRunEmpty` — `heroIcon`, `title`, `description`, `primaryAction`, `steps`
  - `DataTablePage<T>` — generic over the row type, with `columns`,
    `filters: DataTableFilter[]`, `bulkActions: DataTableBulkAction<T>[]`,
    and an optional custom `predicate`.

  **Bundle**
  - `vaul` (Drawer) and `embla-carousel-react` (Carousel) remain externalized,
    keeping `dist-lib/index.js` at ~33 KB gzipped.

  **Other**
  - `AtSign` and `Package` added to the curated icons barrel.
