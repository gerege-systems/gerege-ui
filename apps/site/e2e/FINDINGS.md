# E2E findings — 2026-08-21

Run: local, chromium (headless shell), fresh `vite build` of the showcase, Playwright 1.62, axe-core 4.13
(tags `wcag2a wcag2aa wcag21aa wcag22aa`; only `serious`/`critical` fail a test).
Matrix after trimming: docs 1280 light+dark, 375 light; templates 320/768 light, 375/1280 light+dark.

| Spec                         | Tests | Passed | Failed |
| ---------------------------- | ----: | -----: | -----: |
| `docs.spec.ts`               |   218 |      2 |    216 |
| `templates.spec.ts`          |   444 |    387 |     57 |
| `admin-interactions.spec.ts` |     9 |      8 |      1 |
| `templates-flows.spec.ts`    |    10 |     10 |      0 |
| `visual.spec.ts` (baselines) |    12 |     12 |      0 |
| **Total**                    |   693 |    419 |    274 |

No horizontal-overflow failures at any width, no console errors / page errors / failed requests on any
route. Every `docs.spec.ts` failure is axe; `templates.spec.ts` failures are focus-ring, landmark and a
handful of axe hits inside the landing template. Nothing is skipped; the failing tests stay red until
the app code below is fixed.

## Findings (deduped by root cause)

### F1 · Showcase top bar / footer links are 16px-tall touch targets — `target-size` (serious)

- Spec: `docs.spec.ts` · every docs page (71 routes) · 1280 + 375 · light + dark
- axe: `target-size` — "Target has insufficient size (70.5px by 16px, should be at least 24px by 24px);
  safe clickable space 22px"
- Selectors: `li > a[href$="#components"]`, `…#templates`, `…#guides`,
  `li > a[target="_blank"][rel="noreferrer"]` (GitHub, npm)
- HTML: `<a href="#components" class="text-foreground-muted hover:text-foreground">Components</a>`
- Same pattern on the templates index card links: `a[href$="#templates/admin"]` ("Docs") and the
  `#preview/*` "Open" links (`.text-accent.font-medium.hover:underline`), and the MultiSelect doc's
  `button[aria-label="Clear all"]` (375).
- Root cause: inline text links in `ShowcaseTopBar` / `ShowcaseFooter` / `TemplatesIndexPage` have no
  vertical padding or min-height. One fix (`min-h-6` / `py-1` on the nav anchors) clears ~1,300 hits.

### F2 · Sidebar section labels `text-foreground-subtle/80` at 12px fail contrast — `color-contrast` (serious)

- Spec: `docs.spec.ts` · components-index, templates-index, guides-index, every component + guide +
  template doc · 1280 · **light only** (dark passes)
- axe: `color-contrast` — "#808d9d on #ffffff = 3.37:1, 12px normal; expected 4.5:1"
- Selector: `.mb-3 > .text-foreground-subtle\/80.mb-1.tracking-wide`
- HTML: `<div class="text-foreground-subtle/80 mb-1 px-2 text-xs font-medium tracking-wide uppercase">Buttons</div>`
- Root cause: `DocSidebar` group headings use the subtle token at 80% opacity. Drop the `/80` (or use
  `text-foreground-muted`).

### F3 · Code blocks and demo frames are scrollable but not focusable — `scrollable-region-focusable` (serious)

- Spec: `docs.spec.ts` · 37 component docs + guides · 1280 + 375 · light + dark; `templates.spec.ts`
  admin overview at 320/375 (`div.relative.isolate.w-full.overflow-auto` table wrapper)
- axe: `scrollable-region-focusable` — "Element should be focusable"
- Selectors / HTML:
  - `<pre class="text-foreground max-h-[70vh] overflow-auto p-4">` (source viewer — 89 hits)
  - `<div class="border-border overflow-x-auto rounded-md border">` (props/usage tables — 133 hits)
  - `<div class="relative isolate w-full overflow-auto">` (library `Table` wrapper — also in admin overview)
  - `<div data-radix-scroll-area-viewport class="h-full w-full rounded-[inherit]">` (ScrollArea doc)
  - `<div class="relative isolate w-full overflow-auto rounded-lg border border-border">` (DataGrid doc, 375)
- Root cause: overflow containers without `tabindex="0"` (+ an accessible name). The `Table`/`ScrollArea`
  wrappers live in `packages/ui`, the `pre`/props table in `apps/site`.

### F4 · Inline doc links rely on colour alone — `link-in-text-block` (serious)

- Spec: `docs.spec.ts` · 33 component docs (the "see DesignSystemProvider `strings`" note) + all 5
  template docs ("open it in a new tab ↗") · 1280 + 375 · light + dark
- axe: `link-in-text-block` — "contrast 1.03:1 with surrounding text (#3e43bb vs #48566a); no underline"
- HTML: `<a href="#components/design-system-provider" class="text-accent hover:underline">…</a>`,
  `<a … class="text-accent focus-visible:ring-ring rounded-sm outline-none hover:underline focus-visible:ring-2">open it in a new tab ↗</a>`
- Root cause: prose links use `hover:underline` only. Use a persistent `underline underline-offset-2`
  (or a link component) for links inside paragraphs.

### F5 · Combobox / Select / DatePicker triggers have no accessible name in their docs — `button-name` (critical)

- Spec: `docs.spec.ts` · `component/combobox`, `component/select`, `component/date-picker` · 1280 + 375 · light + dark
- axe: `button-name` — "Element does not have inner text visible to screen readers; aria-label missing"
- HTML: `<button id=":r8:" type="button" role="combobox" aria-expanded="false" aria-haspopup="listbox" …>`,
  DatePicker: `<button … role="combobox" aria-haspopup="dialog" aria-controls=":r8:-calendar">`
- Root cause: the doc's first demo renders the trigger with only a placeholder and no `aria-label` /
  visible `<label>`. Either the docs example needs a label or the component should expose the
  placeholder as the name when nothing else is given (library).

### F6 · MultiSelect / TagInput inner `<input>` has no label — `label` (critical)

- Spec: `docs.spec.ts` · `component/multi-select`, `component/tag-input` · 1280 + 375 · light + dark
- axe: `label` — "Element does not have an implicit or explicit `<label>`"
- HTML: `<input id=":r8:" type="text" role="combobox" … class="placeholder:text-foreground-subtle min-w-[6ch] flex-1 bg-transparent text-lg outline-none md:text-sm">`
- Root cause: the combobox input inside the chip container is not associated with the component's
  label (`aria-labelledby` missing). Library component.

### F7 · Tabs trigger `aria-controls` points at a non-existent id — `aria-valid-attr-value` (critical)

- Spec: `docs.spec.ts` · `component/tabs` · 1280 + 375 · light + dark
- axe: `aria-valid-attr-value` — `aria-controls="radix-:rc:-content-day"` has no matching element
- HTML: `<button type="button" role="tab" aria-selected="true" aria-controls="radix-:rc:-content-day" id="radix-:rc:-trigger-day" data-variant="pills" tabindex="-1">`
- Root cause: a Tabs demo renders `TabsTrigger`s whose `TabsContent` is conditionally omitted (or
  unmounted when inactive) — Radix keeps `aria-controls` either way.

### F8 · Landing template: star rating `aria-label` on a plain `<div>` — `aria-prohibited-attr` (serious)

- Spec: `docs.spec.ts` (`template-doc/landing`, inside the preview iframe) + `templates.spec.ts`
  (`landing/home`) · 320/375/768/1280 · light + dark
- axe: `aria-prohibited-attr` — "aria-label cannot be used on a div with no valid role"
- HTML: `<div class="text-warning-text mb-4 flex items-center justify-center gap-1" aria-label="5 out of 5 stars">`
- Fix: `role="img"` on the wrapper.

### F9 · Landing template contrast: logo strip + hero sub-copy — `color-contrast` (serious)

- Spec: `docs.spec.ts` (`template-doc/landing`) + `templates.spec.ts` (`landing/home`)
- Logo strip (light, all widths): `<span class="text-foreground-muted … opacity-70 grayscale …">Northwind</span>`
  — #7d8796 on #f8fafc = 3.47:1 (18px semibold; 4.5:1 required below 24px/18.7px-bold).
- Hero note (**dark only**, 1280/375): `<p class="mt-4 text-sm opacity-80">No credit card required · 14-day free trial</p>`
  — #1e213f on #787cdd = 4.25:1.
- Root cause: opacity-based de-emphasis on already-muted tokens.

### F10 · Chart series groups are keyboard stops without a focus ring (focus walk)

- Spec: `templates.spec.ts` · `admin/{sidebar,topnav,dual}/{overview,analytics,reports}` · all widths · light + dark
- Observation: Tab lands on `g[role="group"]` ("Series 1, 30 points. Use arrow keys to move between
  points." / "This period…" / "Previous period…") with `outline: none`, `box-shadow: none`.
- Root cause: the library `Chart` makes each series a focusable group (good) but `focus-visible` styling
  is not applied to SVG `<g>` (Tailwind ring utilities are box-shadow based and do not paint on SVG
  groups — use `outline` on `:focus-visible`).

### F11 · News article screen has no `<main>` landmark

- Spec: `templates.spec.ts` · `news/article` · 320/375/768/1280 · light + dark
- Observation: `document.querySelectorAll('main, [role=main]').length === 0` on the article view
  (the front page and the not-found branch do have `<main>`).
- Root cause: `NewsTemplate` article layout wraps the body in `<article>` without a `<main>`.

### F12 · Members page role `Select` scrolls out of the viewport at 320px (focus walk)

- Spec: `templates.spec.ts` · `admin/*/members` · **320 light**
- Observation: step 8 focuses `button[role=combobox]` "Role for Bat Erdene" at x=206, w=128 (right edge
  334 > 320) — the team table's horizontal scroller does not scroll the focused cell into view.
- Root cause: the `Table` wrapper scrolls but focus does not trigger `scrollIntoView` for cells; at 320
  the Role column starts off-screen. (Not an overflow of the document — `scrollWidth` is fine.)

### F13 · Admin mobile drawer: Escape does not return focus to the hamburger

- Spec: `admin-interactions.spec.ts` › "hamburger opens the navigation drawer; Escape closes and
  restores focus" · `#preview/admin/app/sidebar/projects` · 375 · light
- Observation: after `Escape` the `Sheet` closes and `document.activeElement` is `<body>`; the
  `IconButton[aria-label="Open navigation"]` is still in the DOM.
- Root cause: the drawer `Sheet` is controlled (no `SheetTrigger`); Radix restores focus to the
  element that was focused when the content mounted, and the hamburger (wrapped in `Tooltip`) is not
  focused on pointer click. Fix: pass `onCloseAutoFocus={() => burgerRef.current?.focus()}` on the
  `SheetContent`, or render the hamburger as the `SheetTrigger`.

## Moderate / minor (soft warnings only, see HTML report annotations)

Reported via `axe-moderate` / `axe-minor` annotations on each test; not collected here.

## Not findings (checked)

- Horizontal overflow: 0 routes at 320/375/768/1280.
- Console / pageerror / failed requests: 0 (favicon and Google Fonts ignored).
- `h1` count: exactly one on every template screen and admin page.
- Auth validation, deep links (`?id=`), legacy redirects, mobile nav sheets (focus trap + Escape +
  focus return on landing/ecommerce/news), ⌘K palette, projects search/sort/pagination/bulk/undo,
  demo states, density, in-app theme toggle, dock layout switch: all pass.

## Reproduce

```sh
pnpm --filter @gerege-systems/site build
pnpm test:e2e                                  # full suite (~6 min, 4 workers)
pnpm --filter @gerege-systems/site test:e2e docs -g "component/tabs"
pnpm --filter @gerege-systems/site exec playwright show-report
```
