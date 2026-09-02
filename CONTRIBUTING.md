# Contributing

## Releasing

Releases are fully automated via [`changesets/action`](https://github.com/changesets/action). **Do not run `npm publish` locally.**

### Standard flow

1. Make your changes on a branch.
2. Add a changeset describing the user-facing impact:

   ```bash
   pnpm changeset
   ```

   - Pick the affected packages (currently `@gerege/ui`).
   - Pick the bump level: `patch` (bug fix), `minor` (new feature, backwards-compatible), `major` (breaking).
   - Write a short summary — it becomes the CHANGELOG entry.

3. Commit the `.changeset/*.md` file with your code change.
4. Open a PR. Merge to `main` when reviewed.

That's it. The bot does the rest:

- **On push to `main` with pending changesets** → opens (or updates) a "Version Packages" PR that bumps `package.json` versions and rewrites `CHANGELOG.md`.
- **When that PR is merged** → runs `pnpm build:lib` (builds `packages/ui`) + `pnpm changeset publish`, which publishes to npm (using the `NPM_TOKEN` secret), creates a GitHub release for each package, and pushes git tags.

### Adding multiple changes before releasing

Add as many `.changeset/*.md` files as you want — the bot coalesces them. A `patch` + `minor` queued together produces a single `minor` release; multiple `minor`s produce one `minor`. The release PR refreshes on every push.

### Manual release (emergency only)

If the CI bot is down and you need to ship a hotfix:

```bash
pnpm changeset version    # consume pending changesets, bump version
git commit -am "chore: release X.Y.Z"
git push
pnpm build:lib
cd packages/ui && npm publish   # requires ~/.npmrc with an npm token that can publish to `@gerege/*`
cd ../.. && git tag vX.Y.Z && git push --tags
```

But the bot is the canonical path — keep it intact.

### Secrets

Required in GitHub repo settings → Secrets and variables → Actions:

- `NPM_TOKEN` — npm automation token with publish rights on the `@gerege/*` scope. **Not set on this repo yet** — it was not carried over when the project split from craftzbay-ui.

## Repository layout

```
packages/ui/          # @gerege/ui — the published library
packages/create-app/  # @gerege/create-app — project scaffolder
apps/site/            # the showcase site (not published; consumes packages/ui)
```

## Development

Run from the repo root (pnpm workspace):

```bash
pnpm install
pnpm dev            # showcase site (apps/site) at localhost:5173
pnpm typecheck      # all packages
pnpm test           # @gerege/ui component tests
pnpm build:lib      # build packages/ui → packages/ui/dist-lib/
pnpm build:site     # build apps/site → apps/site/dist/
pnpm build          # build the library, then the site
```

## Component checklist

Before opening a PR adding a new component:

- [ ] Component file in `packages/ui/src/components/ui/`
- [ ] Exported from `packages/ui/src/index.ts`
- [ ] Doc file in `apps/site/src/showcase/components/<Name>.docs.tsx`
- [ ] Registered in `apps/site/src/showcase/registry/components.ts`
- [ ] At least one smoke test in the matching `packages/ui/src/components/ui/__tests__/<group>.smoke.test.tsx`
- [ ] axe-clean on the rendered default state
- [ ] WCAG AA contrast respected (see `docs/ACCESSIBILITY.md`)
- [ ] Forwards refs correctly + `displayName` set
- [ ] Follows the refined-minimal philosophy (`docs/PHILOSOPHY.md`)
