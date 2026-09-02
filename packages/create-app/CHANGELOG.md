# @gerege/create-app

> Releases up to **1.0.4** were published as `@craftzbay/create-app`. Renamed on 2026-09-02 when the
> project split from craftzbay-ui.

## 1.0.4

### Patch Changes

- 88415b8: Point the showcase links and package `homepage` at https://ui.craftzbay.com, the
  canonical home of the design system.

## 1.0.3

### Patch Changes

- 4d3b80f: Point the showcase links and package `homepage` at https://ui.gecore.mn, the
  new home of the documentation site.

## 1.0.2

### Patch Changes

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

## 1.0.1

### Patch Changes

- Bump the scaffolded `@craftzbay/ui` dependency to `^0.8.1` — caret ranges on
  0.x stay within the minor, so templates pinned to `^0.7.0` kept installing the
  old release whose `styles.css` shipped no tokens, base layer, or utilities.

## 1.0.0

### Major Changes

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
