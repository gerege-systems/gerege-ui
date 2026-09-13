---
'@gerege-systems/ui': minor
---

Accent, states and a11y.

- `--info-*` and `--selection*` derive from the accent, so a `data-accent` preset or a brand no longer leaves an indigo badge and an indigo text selection behind as a second hue.
- Every accent — library preset, brand, custom — is now held to five 4.5:1 pairs, adding the accent as text on `background-muted` (hovered rows, highlighted menu items) and on its own soft surface. The light presets moved to L 0.51–0.54 and their soft surface to L 0.97 to pass.
- `DesignSystemProvider` writes its scoped `<style>` as raw text: the server renderer escaped it, so `{ light, dark }` tokens did nothing under SSR and hydration reported a mismatch.
- `DataGrid` and `FileUpload` take `error`; `FileUpload` also shows `accept` / `maxSize` rejections inline (`fileUpload.tooLarge`, `fileUpload.wrongType` strings) and marks the input invalid.
- `ConfirmationDialog` no longer shows `Error.message` by default — the generic `errorState.genericDescription` string instead; pass `formatError` to map.
- `ErrorState live` renders `role="alert"`: a live region that mounts already populated is not announced, an inserted alert is.
- `RelativeTime` re-reads "now" every minute when `now` is omitted, so "1 min ago" stays true.
- `Sidebar` `asChild` keeps the item content (icon, trailing, collapsed sr-only label) around the child's own children.
- `MultiSelect` opens on typing, arrow keys and click, not on focus alone.
- `Slider` uncontrolled `showValue` starts at `min`; `AvatarGroup` overflow and `DataGrid` empty cells expose their names through `role="img"` / sr-only text instead of `aria-label` on a generic element.
