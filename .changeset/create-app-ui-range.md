---
'@gerege-systems/create-app': patch
---

Templates depend on `@gerege-systems/ui@^0.12.0`. The previous `^0.11.0` range
stays below 0.12 on a 0.x caret, so a fresh scaffold installed 0.11.2 and missed
the depth layer and the new style slots.
