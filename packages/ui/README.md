# @gerege/ui

A refined-minimal Tailwind v4 + React design system. Production-grade
primitives — Button through DataGrid — plus composed patterns
(authentication, app shell, settings, etc.).

- **Showcase:** [ui.gecore.mn](https://ui.gecore.mn)
- **Components:** [ui.gecore.mn#components](https://ui.gecore.mn#components)
- **Templates:** [ui.gecore.mn#templates](https://ui.gecore.mn#templates)

> **Aesthetic direction:** Linear / Vercel / Stripe Dashboard / Notion / Raycast.
> Neutral-dominant, one accent, hairline borders, generous whitespace, fast quiet
> motion. See [`docs/PHILOSOPHY.md`](./docs/PHILOSOPHY.md).

## Install

```bash
pnpm add @gerege/ui            # peers: react ^18 || ^19, react-dom ^18 || ^19
```

**1. Fonts** — Geist + Geist Mono are referenced by the tokens but not bundled (Inter is only a fallback in the stack). Google Fonts serves the `cyrillic-ext` subset automatically; self-hosting (≤4 woff2, weights 400/500/600) is equally fine. Add to `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

**2. CSS** — pick one:

```css
/* a) No Tailwind in your app: one precompiled sheet (tokens + base + every utility the components use) */
@import '@gerege/ui/styles.css';

/* b) Your app already uses Tailwind v4: share the tokens and let Tailwind compile the library's classes */
@import 'tailwindcss';
@import 'tw-animate-css'; /* required on this path — overlays use animate-in / animate-out */
@import '@gerege/ui/theme.css';
@source "../node_modules/@gerege/ui/dist-lib";
```

Path (b) needs `tw-animate-css` installed (`pnpm add -D tw-animate-css`; it is an optional peer). Path (a) already bundles it.

**3. Dark mode** — toggle the `dark` class on `<html>`; every token flips and `color-scheme` follows. Set it from a blocking script before first paint to avoid a flash (three states: light / dark / system). `data-theme` is not used.

**4. Providers** — `<Toaster />` once near the root if you use `toast()`; wrap the app in `<TooltipProvider>` if you use `Tooltip`. Nothing else is required.

```tsx
import { Button, Toaster, TooltipProvider, toast } from '@gerege/ui';

export function App() {
  return (
    <TooltipProvider>
      <Button onClick={() => toast({ title: 'Saved' })}>Save</Button>
      <Toaster />
    </TooltipProvider>
  );
}
```

**Next.js App Router** — since 0.10 every built module carries a `'use client'` banner, so `import { Button } from '@gerege/ui'` works directly inside Server Components without a local re-export file. Put the CSS import and fonts in `app/layout.tsx`. Note: the pure helpers (`formatDate`, `formatNumber`, `formatMNT`, `mnStrings`, `defaultStrings`) are also client-marked today — they still run fine in Server Components (the directive only affects the boundary), but they are not tree-shaken into a server-only chunk.

**Name-addressed icons** — `Icons.*` (curated, tree-shaken) ships in the main entry. The lazy `<Icon name="…">` + `iconNames` list lives in a separate entry so its ~1500-icon import map never enters your bundle unless asked for:

```tsx
import { Icon } from '@gerege/ui/icon';
<Icon name="calendar" className="size-4" />;
```

The package is ESM-only, ships one module per component (`sideEffects` limited to CSS), so `import { Button }` pulls in about 8 KB gzipped — no calendar, drawer, or form dependencies.

## Localisation (Mongolian built in)

Every built-in string (close/dismiss labels, placeholders, "No results.", pagination summary, error-state copy…) is typed in `UiStrings` and read through `useStrings()`. Defaults are English; a full Mongolian set ships as `mnStrings`.

```tsx
import { DesignSystemProvider, mnStrings } from '@gerege/ui';
<DesignSystemProvider strings={mnStrings}>…</DesignSystemProvider>; // whole library in Mongolian
<DesignSystemProvider strings={{ dialog: { close: 'Schließen' } }}>…</DesignSystemProvider>; // partial override, deep-merged over defaults
```

Precedence is per-component props (`placeholder`, `labels`, `aria-label`) → nearest provider → `defaultStrings`. Templates use `{name}` placeholders, e.g. `pagination.showing: '{from}–{to} / {total}'`.

## Design rules

This library implements the [gerege-systems design-research](https://github.com/gerege-systems/design-research) guidelines
([rendered site](https://gerege-systems.github.io/design-research/)) — colour, type, spacing, components, accessibility, tokens.
design-research is the source of truth (canonical numbers in [`00-defaults.md`](https://github.com/gerege-systems/design-research/blob/main/00-defaults.md));
[`docs/PHILOSOPHY.md`](./docs/PHILOSOPHY.md) is the library-specific summary.

## Local development

This package lives in the [`gerege-ui`](https://github.com/gerege-systems/gerege-ui)
monorepo (`packages/ui`). The showcase site is a separate workspace
(`apps/site`) that consumes this package's source directly. From the repo root:

```bash
pnpm install
pnpm dev           # showcase site (apps/site) — edits to this package hot-reload
pnpm build:lib     # build this library → packages/ui/dist-lib/
```

Inside `packages/ui` itself, `pnpm build` produces the distributable bundle and
`pnpm test` runs the component tests.

## Tech stack

- **Tailwind CSS v4** — tokens defined in `@theme` in `src/styles/theme.css` (`globals.css` = tailwind + tw-animate-css + theme)
- **React 18 / 19** + **TypeScript 5.7**
- **Radix UI** primitives for accessibility-correct overlays
- **class-variance-authority** + `cn()` (`clsx` + `tailwind-merge`)
- **Lucide** icons (16 / 20px, 1.5 stroke)
- **Geist** sans + **Geist Mono** monospace

## Project structure

```
src/
├── styles/
│   ├── theme.css             # @theme tokens, semantic vars, dark variant, base layer
│   └── globals.css           # tailwindcss + tw-animate-css + theme.css
├── lib/
│   ├── utils.ts              # cn() + uid()
│   ├── format.ts             # formatDate / formatNumber / formatMNT
│   └── strings.ts            # UiStrings, defaultStrings (+ strings.mn.ts)
├── components/
│   ├── ui/                   # primitives — 52 components
│   └── patterns/             # composed layouts
├── hooks/
│   ├── use-toast.ts
│   └── use-media-query.ts
└── icons/                    # curated Lucide re-exports
docs/
├── PHILOSOPHY.md             # the 6 refined-minimal principles
├── VOICE.md                  # content + tone of voice
└── ACCESSIBILITY.md          # WCAG checklist + contrast ratios
```

## Component index

### Inputs

- [Input](./src/components/ui/Input.tsx) — text / email / password / number / search with prefix, suffix, error
- [Textarea](./src/components/ui/Textarea.tsx) — auto-resize multi-line input
- [Select](./src/components/ui/Select.tsx) — single-choice menu (Radix)
- [MultiSelect](./src/components/ui/MultiSelect.tsx) — chip-based multi-choice picker
- [Combobox](./src/components/ui/Combobox.tsx) — searchable single-select, sync or async
- [Checkbox](./src/components/ui/Checkbox.tsx) — including indeterminate
- [RadioGroup](./src/components/ui/RadioGroup.tsx) — mutually-exclusive choices
- [Switch](./src/components/ui/Switch.tsx) — instant-apply binary toggle
- [Slider](./src/components/ui/Slider.tsx) — single + range
- [DatePicker](./src/components/ui/DatePicker.tsx) — single + range
- [Form primitives](./src/components/ui/Form.tsx) — react-hook-form bindings

### Buttons

- [Button](./src/components/ui/Button.tsx) — primary · secondary · outline · ghost · destructive · link
- [IconButton](./src/components/ui/IconButton.tsx) — square icon-only variant
- [Pagination](./src/components/ui/Pagination.tsx) — numbered + jumps + page-size

### Feedback

- [Alert](./src/components/ui/Alert.tsx) — inline banner, dismissible
- [Toast](./src/components/ui/Toast.tsx) + `useToast` hook
- [Spinner](./src/components/ui/Spinner.tsx) — accent / neutral / on-accent tones
- [Progress](./src/components/ui/Progress.tsx) — linear + circular, determinate + indeterminate
- [Skeleton](./src/components/ui/Skeleton.tsx) — text, avatar, card variants
- [EmptyState](./src/components/ui/EmptyState.tsx)
- [ErrorState](./src/components/ui/ErrorState.tsx) — 404 / 500 / generic

### Navigation

- [TopNav](./src/components/ui/TopNav.tsx) + `TopNavLink`
- [Sidebar](./src/components/ui/Sidebar.tsx) + `SidebarSection` + `SidebarItem` + `SidebarGroup`
- [Breadcrumbs](./src/components/ui/Breadcrumbs.tsx) — with overflow ellipsis
- [Tabs](./src/components/ui/Tabs.tsx) — underline + pills variants
- [Stepper](./src/components/ui/Stepper.tsx) — horizontal + vertical

### Layout

- [Card](./src/components/ui/Card.tsx) + `CardHeader/Title/Description/Content/Footer`
- [Separator](./src/components/ui/Separator.tsx)
- [ScrollArea](./src/components/ui/ScrollArea.tsx) — Radix-backed styled scroll
- [Accordion](./src/components/ui/Accordion.tsx) — single + multiple

### Overlays

- [Dialog](./src/components/ui/Dialog.tsx) + `ConfirmationDialog`
- [Sheet](./src/components/ui/Sheet.tsx) — left / right / top / bottom
- [Popover](./src/components/ui/Popover.tsx)
- [Tooltip](./src/components/ui/Tooltip.tsx) — 500ms delay default
- [DropdownMenu](./src/components/ui/DropdownMenu.tsx) — submenus, separators, kbd
- [ContextMenu](./src/components/ui/ContextMenu.tsx) — right-click menu
- [CommandPalette](./src/components/ui/CommandPalette.tsx) — ⌘K palette

### Data display

- [Table](./src/components/ui/Table.tsx) + `TableSortHeader`
- [DataGrid](./src/components/ui/DataGrid.tsx) — column visibility, filter, sortable
- [Badge](./src/components/ui/Badge.tsx) — subtle + outline, 6 tones
- [Avatar](./src/components/ui/Avatar.tsx) + `AvatarGroup`

### Typography

- [Kbd](./src/components/ui/Kbd.tsx) — keyboard shortcut indicator

## Blocks (page templates)

Whole-page compositions — dashboard, settings, auth, pricing, data table,
record detail, onboarding, first-run — are **not** shipped as importable
components. They live in the showcase as copy-paste **blocks**: complete pages
assembled from the primitives above, with the full source on the page. Read it,
copy it, adapt it — no opaque `<Dashboard />` import. Browse them under
**Templates** in the [showcase](https://ui.gecore.mn/#templates).

## Documentation

- [`docs/PHILOSOPHY.md`](./docs/PHILOSOPHY.md) — the six principles + forbidden list
- [`docs/VOICE.md`](./docs/VOICE.md) — tone of voice, button labels, error copy formula
- [`docs/ACCESSIBILITY.md`](./docs/ACCESSIBILITY.md) — WCAG AA contrast table, keyboard map

## Contributing

1. Read [`docs/PHILOSOPHY.md`](./docs/PHILOSOPHY.md) first — the forbidden list is
   non-negotiable.
2. Components reference semantic tokens (`bg-card`, `text-accent`), never raw
   palette steps (`bg-indigo-500`).
3. Every interactive element ships with: default, hover, focus-visible, active,
   disabled, loading, and (where applicable) error / success states.
4. Forward refs correctly; set `displayName`.
5. Run `pnpm typecheck && pnpm test` before opening a PR.
