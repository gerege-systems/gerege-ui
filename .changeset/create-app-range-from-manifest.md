---
'@gerege-systems/create-app': patch
---

New projects get the `@gerege-systems/ui` range from create-app's own `dependencies`, which changesets updates on every library release — the range typed into the templates went stale twice. Scaffolds `^0.15.0` now.
