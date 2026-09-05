---
'@gerege-systems/ui': patch
---

The published package no longer carries `dist-lib/__tests__/helpers/*.d.ts`. The
declaration build excluded `*.test.*` and `src/test/**` but not `src/**/__tests__/**`,
so the two test helper modules were emitted and packed.
