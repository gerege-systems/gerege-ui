# gerege-ui

[![npm](https://img.shields.io/npm/v/@gerege/ui.svg)](https://www.npmjs.com/package/@gerege/ui)
[![CI](https://github.com/gerege-systems/gerege-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/gerege-systems/gerege-ui/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@gerege/ui.svg)](./LICENSE)

Monorepo for **[@gerege/ui](https://www.npmjs.com/package/@gerege/ui)** — a
refined-minimal Tailwind v4 + React design system — and its showcase site.
Live demo: **[ui.gecore.mn](https://ui.gecore.mn)**.

> Aesthetic direction: Linear / Vercel / Stripe Dashboard / Notion / Raycast.
> Neutral-dominant, one accent, hairline borders, generous whitespace, fast quiet motion.

## Layout

```
packages/
  ui/            @gerege/ui — the published component library
  create-app/    @gerege/create-app — `npm create @gerege/app`
apps/
  site/          the showcase / documentation site (not published)
```

`apps/site` consumes the library straight from `packages/ui/src` via a Vite
alias, so editing a component hot-reloads the docs instantly. Templates open in
their own browser tab, and the brand + theme switchers in the header re-theme
the whole site — including any open preview tab — live.

## Install (consumers)

```bash
pnpm add @gerege/ui
```

```css
@import '@gerege/ui/styles.css'; /* no Tailwind in your app */
/* — or, with Tailwind v4 — */
@import 'tailwindcss';
@import 'tw-animate-css'; /* required with theme.css */
@import '@gerege/ui/theme.css';
@source "../node_modules/@gerege/ui/dist-lib";
```

Add the Geist Google Fonts `<link>` (Inter is a fallback only), toggle `.dark` on `<html>` for dark mode, render `<Toaster />` once.
ESM-only, per-module output: `import { Button }` is ~8 KB gz. Name-addressed icons: `import { Icon } from '@gerege/ui/icon'`.
Next.js App Router: since 0.10 every module ships with a `'use client'` banner — import straight from Server Components, no re-export shim (pure utils such as `formatMNT` / `mnStrings` are client-marked too for now).
Full setup (providers, fonts, dark mode) in [`packages/ui/README.md`](./packages/ui/README.md).

## Design rules

The library implements the [gerege-systems/design-research](https://github.com/gerege-systems/design-research) guidelines
([rendered](https://gerege-systems.github.io/design-research/)) — that repo is the source of truth
([`00-defaults.md`](https://github.com/gerege-systems/design-research/blob/main/00-defaults.md) holds the canonical numbers);
[`packages/ui/docs/PHILOSOPHY.md`](./packages/ui/docs/PHILOSOPHY.md) summarises it.

## Develop

```bash
pnpm install
pnpm dev            # showcase site at localhost:5173
pnpm typecheck      # every package
pnpm test           # @gerege/ui component tests
pnpm lint           # eslint (typescript-eslint + react-hooks + jsx-a11y)
pnpm size           # bundle-size budgets (.size-limit.json)
pnpm build          # build the library, then the site
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the release flow and the
new-component checklist. Library usage docs live in
[`packages/ui/README.md`](./packages/ui/README.md).

MIT © Gerege Systems
