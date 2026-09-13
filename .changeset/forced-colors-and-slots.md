---
'@gerege-systems/ui': patch
---

Accessibility and style-layer fixes.

- Forced-colours and `prefers-contrast: more` token overrides were inside `@layer base` while `:root`/`.dark` are unlayered, so they never applied. They are top-level now, and a test keeps them there.
- Every `outline-none` is `outline-hidden`: in Tailwind v4 `outline-none` removes the outline outright, which left no focus indicator at all in Windows High Contrast. `outline-hidden` keeps the transparent outline that forced colours paint.
- A collapsed `Sidebar` no longer throws in an app that has not mounted `TooltipProvider` — it provides its own.
- `data-slot` now sits on the element the style layer shapes: `Button asChild`, the `Snackbar` card (not its close button), the `TagInput` and `MultiSelect` field (not the label), the `DatePicker`/`DateRangePicker` trigger, the `Carousel` region and the `Tree` root. Named styles reach these components for the first time.
