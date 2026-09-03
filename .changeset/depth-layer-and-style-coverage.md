---
'@gerege-systems/ui': minor
---

A depth layer, and the shapes the style layer could not reach.

`data-depth` joins `data-style` as a second attribute layer: `flat`, `soft`
(the default, unchanged), `raised` and `deep` move how far floating surfaces —
menus, dialogs, popovers, toasts — sit off the page. Cards keep their hairline
border and no shadow at every depth. Put it on `<html>` or any subtree; the
rules ship with the library.

The style layer now also reaches page numbers, pill tabs, checkbox marks, menu
rows, progress tracks, slider tracks and thumbs, the table's scroll frame and
the timeline, so a style like `vega` no longer leaves rounded corners behind.
Radios stay circular in every style. New `data-slot` values: `table-container`,
`slider-track`, `slider-thumb`, `timeline`, `timeline-item`, `timeline-bullet`.
