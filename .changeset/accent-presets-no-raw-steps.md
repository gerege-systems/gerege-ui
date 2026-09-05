---
'@gerege-systems/ui': patch
---

`brandPresets` and the `[data-accent]` presets in theme.css no longer set
`--color-accent-700` / `--color-accent-800`. Hover and active states have
derived from `--accent` (`--accent-hover`, `--accent-active`) since 0.11, so
those two steps were dead weight in every preset. The raw `accent-700` /
`accent-800` utilities still exist and keep the library's indigo ramp.
