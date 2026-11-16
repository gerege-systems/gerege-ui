---
'@gerege-systems/ui': minor
---

New `DialogBody`: the scrollable middle of a dialog. Put it between `DialogHeader` and `DialogFooter` and the panel is capped at the viewport height (`100dvh - 2rem`), the header with the close button and the footer stay visible, and only the body scrolls. It bleeds to the panel edges so the scrollbar sits at the edge and focus rings inside are not clipped, and it is a focusable group named by `scrollArea.region` (overridable with `aria-label`) so the keyboard can scroll it. `DialogHeader` and `DialogFooter` no longer shrink in that layout. Dialogs without `DialogBody` lay out exactly as before, including ones that pass their own `max-h-* overflow-y-auto` className — migrate those by dropping that className and wrapping the middle in `DialogBody`.
