---
'@gerege-systems/ui': patch
---

Dev-only warnings in `Chart` and `Icon` no longer assume a `process` global: the
`NODE_ENV` check is guarded with `typeof process !== 'undefined'`, so the
modules load in bundler-less ESM environments (import maps, Deno) without a
`process is not defined` error. Bundlers still strip the branch in production.

Type declarations use `ComponentRef` instead of the `ElementRef` alias that
`@types/react@19` deprecates, so consumers on React 19 no longer see
deprecation strikethroughs on the exported prop types.
