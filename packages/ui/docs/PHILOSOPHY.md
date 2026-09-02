# Design Philosophy — Refined-Minimal

> The rules below are the library-specific distillation of the [gerege-systems design-research](https://github.com/gerege-systems/design-research) guidelines ([rendered](https://gerege-systems.github.io/design-research/)).
> **Precedence:** design-research is the source of truth; this file summarises it. When the two disagree, design-research wins — the canonical numbers live in [`00-defaults.md`](https://github.com/gerege-systems/design-research/blob/main/00-defaults.md).

This system is built for **internal product teams** at the company. It must work across
any product surface, so it favours discipline and clarity over decoration. The visual
quality bar is Linear, Vercel, Stripe Dashboard, Notion, and Raycast — side by side.

The six principles below are the only ones that override taste. Every other choice
follows from them.

---

## 1. Neutral dominates. Colour earns its place.

About 85% of any screen is neutral. Colour appears on primary actions, status, and
focus — never as decoration. The eye should land on content first, chrome second.

- **Do**: a dashboard where the only chromatic element is the active nav indicator
  and the primary "Create" button.
- **Don't**: tint cards, headers, or empty-state illustrations with the accent.

## 2. One accent. No exceptions.

A single chromatic hue — `graphite-indigo` — covers primary actions, focused inputs,
active nav, selected rows, and links. We do not introduce a second accent for
"variety". If something needs to look distinct, use weight, size, or position.

- **Do**: primary button in `accent-600`; link text in `accent-600`; focus ring in `accent-500`.
- **Don't**: success buttons in green, danger in red — those are status colours, not
  alternate accents. Buttons stay neutral or accent unless their action is destructive.

## 3. Typography carries the hierarchy.

Three weights only: **400** (body), **500** (UI labels, emphasis), **600** (headings).
We do not use 700. Size, weight, and colour combine to express hierarchy — borders,
fills, and shadows do not.

- **Do**: section headings as `text-lg font-semibold text-foreground` with no underline,
  no rule, no background.
- **Don't**: wrap each section in a coloured panel to separate it.

## 4. Hairlines, not shadows.

Inline surfaces are bounded by a 1px `border` token. Shadows exist only for floating
surfaces — popover, modal, toast, dropdown. A card on the page has a border; a card
floating above the page has a soft shadow. Shadows are neutral; never tinted.

- **Do**: page card → `border border-border bg-card`; padding 16px (compact / mobile) or
  24px (default desktop) — never 20.
- **Don't**: page card → `shadow-lg` with no border.

## 5. Whitespace is content.

Body line-height is 1.5–1.7. Section gaps default to `space-y-8` or larger. Tables
breathe with `py-3` row padding. Density is a deliberate decision in data-heavy
contexts, never a default.

- **Do**: settings page with `space-y-12` between sections and `space-y-6` inside
  a section.
- **Don't**: cram form rows at `gap-2` to fit more above the fold.

## 6. Motion is fast and quiet.

UI motion is 120–240ms (`--duration-fast` 120 / `--duration-base` 160 / `--duration-slow`
240 — 240ms is the ceiling). Entrances ease-out, exits ease-in. No bounce, no overshoot,
no springs on chrome. Decorative motion is reserved for empty states and onboarding
illustrations. All motion respects `prefers-reduced-motion`.

- **Do**: dropdown opens in 160ms with a 4px translate-y and opacity fade.
- **Don't**: modals that scale-bounce in over 400ms.

---

## Forbidden

These are instant disqualifiers in code review:

- Decorative gradients (`from-purple-500 to-pink-500` and friends).
- Inter as the only/default font.
- `rounded-2xl` or larger on cards and buttons.
- `shadow-xl` / `shadow-2xl` on inline (non-floating) surfaces.
- Drop shadows tinted with colour.
- Emojis used as UI icons (`✨🚀💡` in buttons or labels).
- A second accent colour for "variety".
- Tailwind's default palette used raw — always go through semantic tokens.
- Glassmorphism / heavy backdrop blur as a primary style.
- Decorative dots, grids, or noise textures on surfaces.

## Font and palette commitments

- **Sans**: **Geist** — Vercel's grotesk, designed specifically for UI. Distinctive
  but neutral enough to fit any internal product; the digit kerning is unusually
  good for dashboards. Cyrillic is covered via the `cyrillic-ext` subset. Load it
  from Google Fonts (`preconnect` + `display=swap`, weights 400/500/600 only) or
  self-host — ≤4 woff2 files total. **Inter is a fallback in the stack only, never
  the default.**
- **Mono**: **Geist Mono** — pairs natively with Geist; we use it for `Kbd`, code,
  tabular numbers, and IDs.
- **Neutral**: **cool-gray** (slight blue undertone, hue ≈ 220°). Reads as precise
  and technical; works across product domains.
- **Accent**: **graphite-indigo** — a desaturated indigo (`hsl(238 70% 58%)` at 500).
  Distinct from Tailwind's vivid `indigo-500`; intentionally muted so it can carry
  weight without shouting.

## Theming

Dark mode is the `.dark` class on `<html>` — three user states (light / dark /
system), resolved by a blocking pre-paint script that also sets `color-scheme`.
`data-theme` is not used. Every semantic token flips under `.dark`; components never
branch on the theme themselves.

## Vocabulary

| Term        | Meaning                                                                                                                                                                                                                                                                                            |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`   | Visual style of a component (`primary`, `secondary`, `outline`, `ghost`, `destructive`, `link`; `subtle` / `outline` on Badge). Default Button variant stays `primary` — but a view shows **at most one** primary; pass `variant="secondary"` (or `outline` / `ghost`) explicitly everywhere else. |
| `size`      | Scale step: `sm` 32 / `md` 36 / `lg` 40 / `xl` 44px (xl = marketing CTA / touch-first).                                                                                                                                                                                                            |
| `tone`      | Status colour on Badge / Spinner (`neutral`, `accent`, `success`, `warning`, `danger`, `info`). On inputs `tone` is **deprecated** — use `aria-invalid` for the error look.                                                                                                                        |
| State model | Every data-bearing component handles five states: **loading / empty** (first-run or filtered) **/ error / success / permission-denied**.                                                                                                                                                           |
| Direction   | LTR only — RTL is not supported yet.                                                                                                                                                                                                                                                               |
