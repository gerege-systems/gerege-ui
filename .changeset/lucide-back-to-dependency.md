---
'@gerege-systems/ui': patch
---

`lucide-react` is a regular dependency (`^0.460.0`) again instead of a peer. Since 0.16.0 the library resolved the app's own lucide, but it imports icons by per-module path (`dist/esm/icons/<name>.js`, `lucide-react/dynamicIconImports`), and lucide-react 1.10+ ships those files as `.mjs` only — so any app on lucide 1.10 or newer failed with "Cannot find module …/alert-circle.js". The library now carries the lucide it was built against, as it did up to 0.15.
