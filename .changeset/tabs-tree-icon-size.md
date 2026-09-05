---
'@gerege-systems/ui': patch
---

`TabsTrigger` and a `Tree` node's custom `icon` size a bare `<svg>` to 16px
(`[&_svg]:size-4 [&_svg]:shrink-0`), completing the pass that gave menu items
the same default in 0.13.0: every slot that takes an icon next to a label now
renders a lucide icon at text size without a `className` on it.
