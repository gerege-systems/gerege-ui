---
'@gerege-systems/ui': minor
---

Hygiene release.

- `lucide-react` is a peer dependency (`>=0.460.0`) instead of a dependency, so an app on a newer lucide no longer ships two icon sets. Install it alongside the library.
- `--surface-active` and the unused `.focus-ring` / `.ring-focus` / `.border-hairline` / `.glass-fallback` utilities are gone — nothing in the library used them.
- A `@media print` layer: light tokens, no floating layers or chrome, no shadows.
- Calendar navigation, Pagination arrows and the Alert dismiss button keep their size but gain a 44px hit area (WCAG 2.5.8) through an invisible halo, like the 16px controls already had.
- Combobox's loading indicator is the library `Spinner`.
- `useModifierKey` reads the platform through `useSyncExternalStore` (no effect-driven re-render); `useDebounce` with `delay <= 0` returns the value directly.
- React Compiler lint rules are on for the whole repo; the remaining effect-driven state (Carousel's first read, delayed-loading timers) is annotated.
