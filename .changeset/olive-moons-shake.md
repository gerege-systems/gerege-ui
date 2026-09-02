---
'@gerege/site': patch
---

Admin template: the shell's `<main>` scroll pane is now `position: relative`.
Without a containing block, the `sr-only` labels the library renders
(`position: absolute`) resolved against the initial containing block, escaped
both the pane's and the shell's `overflow`, and stretched the document to the
full length of the page — the Projects table gave the preview a second
scrollbar and a screen of dead space below the shell. `templates.spec.ts` now
asserts that an `app` shell never scrolls the document.
