---
'@gerege-systems/ui': patch
---

Text-sized controls get a 24×24 hit area (WCAG 2.5.8 target size) from an invisible `::before` centred on the label, so the layout does not change: `Button variant="link"` and the Chart's "View as table" toggle.
