---
'@gerege-systems/create-app': patch
---

Templates depend on `@gerege-systems/ui` `^0.14.0` (a 0.x caret never crosses a minor, so new projects were scaffolded on 0.12). The smoke test now fails whenever the template pin and the library minor drift apart.
