---
'@gerege-systems/ui': patch
---

Two more shapes the style layer could not reach.

`Combobox` carried no `data-slot` at all, so its trigger stayed `rounded-md` and
its list stayed `rounded-lg` in every style; it now names the trigger
(`data-slot="combobox"`, a control) and its popover surface
(`data-slot="popover-content"`, the same slot `Popover` uses). `Toast` was the
other half of the same gap in reverse: the stylesheet already had a rule for
`[data-slot='toast']`, but nothing rendered that slot, so the rule styled
nothing — the root carries it now.

A test asserts both directions from here on: a component holding a radius must
declare a slot, and a slot the stylesheet names must be rendered by something.
