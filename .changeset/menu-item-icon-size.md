---
'@gerege-systems/ui': patch
---

`DropdownMenuItem` and `ContextMenuItem` now size a bare `<svg>` child to 16px
(`[&_svg]:size-4 [&_svg]:shrink-0`), the same default `Button`, `Sidebar` and
`Command` items already apply. A lucide icon dropped into a menu item rendered at
its 24px default, so every consumer sized it by hand — the admin template's
`className="size-4"` on each item icon is now redundant (and harmless).
