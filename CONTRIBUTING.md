# Contributing

## Releasing

Releases are fully automated via [`changesets/action`](https://github.com/changesets/action). **Do not run `npm publish` locally.**

### Standard flow

1. Make your changes on a branch.
2. Add a changeset describing the user-facing impact:

   ```bash
   pnpm changeset
   ```

   - Pick the affected packages (currently `@gerege-systems/ui`).
   - Pick the bump level: `patch` (bug fix), `minor` (new feature, backwards-compatible), `major` (breaking).
   - Write a short summary — it becomes the CHANGELOG entry.

3. Commit the `.changeset/*.md` file with your code change.
4. Open a PR. Merge to `main` when reviewed.

That's it. The bot does the rest:

- **On push to `main` with pending changesets** → opens (or updates) a "Version Packages" PR that bumps `package.json` versions and rewrites `CHANGELOG.md`.
- **When that PR is merged** → runs `pnpm build:lib` (builds `packages/ui`) + `pnpm changeset publish`, which publishes to npm (using the `NPM_TOKEN` secret), creates a GitHub release for each package, and pushes git tags.

### The red X on the release PR

Every "Version Packages" PR shows a failed CI check with no jobs in it. The PR is
opened by `github-actions[bot]` using the workflow's own `GITHUB_TOKEN`, and
GitHub refuses to run workflows for events that token creates — the run is filed
but never starts, so it lands as a failure. Nothing is wrong with the tree:
Release re-runs lint, typecheck, tests and the package checks on `main` before it
publishes, and the merge commit gets a full CI run. Merge it as normal. Giving
`changesets/action` a user PAT instead would make the check run for real; that is
the only fix, and it costs a secret to rotate.

### Adding multiple changes before releasing

Add as many `.changeset/*.md` files as you want — the bot coalesces them. A `patch` + `minor` queued together produces a single `minor` release; multiple `minor`s produce one `minor`. The release PR refreshes on every push.

### Manual release (emergency only)

If the CI bot is down and you need to ship a hotfix:

```bash
pnpm changeset version    # consume pending changesets, bump version
git commit -am "chore: release X.Y.Z"
git push
pnpm build:lib
cd packages/ui && npm publish   # requires ~/.npmrc with an npm token that can publish to `@gerege-systems/*`
cd ../.. && git tag vX.Y.Z && git push --tags
```

But the bot is the canonical path — keep it intact.

### Secrets

Required in GitHub repo settings → Secrets and variables → Actions:

- `NPM_TOKEN` — a granular npm token with publish rights on the `@gerege-systems/*` scope. Set,
  and the path 0.12.0 was published through. **Bypass 2FA must be on** for the token, or the
  publish step gets a 403; leave the allowed-IP list empty.

## Repository layout

```
packages/ui/          # @gerege-systems/ui — the published library
packages/create-app/  # @gerege-systems/create-app — project scaffolder
apps/site/            # the showcase site (not published; consumes packages/ui)
deploy/deploy.sh      # run on the host that serves the showcase
```

### Deploying the showcase

`deploy/deploy.sh` runs **on the server**, from inside the checkout — it derives
the repo root from its own location, so nothing about the host is hard-coded.
It pulls, installs with a frozen lockfile, builds into `apps/site/dist.new` and
swaps that into place, keeping the previous build in `apps/site/dist.prev` to
roll back to. Point the static host's root at `apps/site/dist`.

```bash
VERIFY_URL=https://<host>/ bash deploy/deploy.sh   # VERIFY_URL is optional
```

## Development

Run from the repo root (pnpm workspace):

```bash
pnpm install
pnpm dev            # showcase site (apps/site) at localhost:5173
pnpm typecheck      # all packages
pnpm test           # @gerege-systems/ui component tests
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
