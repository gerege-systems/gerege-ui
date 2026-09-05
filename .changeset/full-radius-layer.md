---
'@gerege-systems/ui': minor
---

Add the `data-radius="full"` layer: pill controls (button, input, select, combobox, pagination, pill tabs) by slot, while cards, textareas and skeletons keep the radius tokens. The theme editor's "Full" radius now emits this attribute plus bounded surface tokens instead of `--radius-*: 9999px`, which turned every card into an ellipse.

Style layer fixes: a textarea and a card-sized skeleton are capped at the surface radius (lyra made them stadiums); underline tabs no longer take the surface radius (their bottom border bent up at both ends).
