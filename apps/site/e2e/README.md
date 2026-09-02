# Showcase E2E (Playwright)

```sh
pnpm --filter @gerege-systems/site build      # preview serves dist/
pnpm test:e2e                            # root alias; starts `vite preview --port 4173`
pnpm --filter @gerege-systems/site test:e2e docs       # one spec
pnpm --filter @gerege-systems/site exec playwright show-report
```

Specs are data-driven from `e2e/routes.ts` (mirrors `src/showcase/routing.ts`,
`registry/components.ts`, `registry/guides.tsx`, `blocks/meta.ts`,
`blocks/admin/data.ts`). `docs.spec.ts` cross-checks the slug lists against the
live index pages, so a new component/guide fails until added here.

| Spec                         | Scope                                                                 |
| ---------------------------- | --------------------------------------------------------------------- |
| `docs.spec.ts`               | every docs page × 1280/375 × light/dark: h1, errors, overflow, axe    |
| `templates.spec.ts`          | every template screen / admin layout+page × 4 viewports × 2 themes    |
| `admin-interactions.spec.ts` | Projects page behaviour, demo states, density, theme, layouts, drawer |
| `templates-flows.spec.ts`    | auth validation, deep links, legacy redirects, mobile sheets, ⌘K      |
| `visual.spec.ts`             | screenshot baselines (home / admin overview / landing)                |

Failures are also appended to `test-results/findings.jsonl` (kind, URL,
viewport, theme, axe nodes) — `FINDINGS.md` is the curated summary.

## Visual baselines

Rasterisation differs per OS, so baselines are stored per platform
(`__screenshots__/chromium-<platform>/…`). Baselines committed from macOS do not
match Linux; CI therefore skips `visual.spec.ts` unless `CI_VISUAL=1`. To enable
it in CI, generate Linux baselines once (`--update-snapshots` inside the CI
image or a Linux container) and commit them alongside the darwin set.
