---
'@gerege-systems/ui': minor
---

Softer form control borders: `--border-input` is now `hsl(215 16% 82%)` light / `hsl(215 16% 30%)` dark (was 55% / 45%), shadcn-style. This applies to inputs, selects, textarea, checkbox/radio and outline buttons, and drops them below WCAG 1.4.11's 3:1. `prefers-contrast: more` restores the previous values.
