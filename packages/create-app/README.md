# @gerege-systems/create-app

Scaffold a new project preconfigured with [`@gerege-systems/ui`](https://www.npmjs.com/package/@gerege-systems/ui).

```bash
npm create @gerege-systems/app my-app
# or
pnpm create @gerege-systems/app my-app
# or
yarn create @gerege-systems/app my-app
# or
bun create @gerege-systems/app my-app
```

Then:

```bash
cd my-app
pnpm dev
```

## Templates

| ID               | What you get                                                                |
| ---------------- | --------------------------------------------------------------------------- |
| `vite-blank`     | Minimal Vite + React + `@gerege-systems/ui` starter (Card + Input + Switch) |
| `vite-dashboard` | `AppShell` + `Dashboard` template, ready to wire data                       |

Pass `--template <id>` to skip the picker:

```bash
npm create @gerege-systems/app my-app -- --template vite-dashboard
```

## Options

```
-t, --template <name>   Skip the prompt and use a known template
-y, --yes               Skip "install deps?" prompt and install
    --no-install        Skip dependency install entirely
-h, --help              Show this help
```

## Docs

- Showcase: <https://ui.gecore.mn>
- Components: <https://ui.gecore.mn/#components>
- Templates: <https://ui.gecore.mn/#templates>
- Guides: <https://ui.gecore.mn/#guides>
