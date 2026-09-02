# @gerege-systems/site

## 0.0.7

### Patch Changes

- ee08319: Admin template: the shell's `<main>` scroll pane is now `position: relative`.
  Without a containing block, the `sr-only` labels the library renders
  (`position: absolute`) resolved against the initial containing block, escaped
  both the pane's and the shell's `overflow`, and stretched the document to the
  full length of the page — the Projects table gave the preview a second
  scrollbar and a screen of dead space below the shell. `templates.spec.ts` now
  asserts that an `app` shell never scrolls the document.

> Formerly `@craftzbay/site`; renamed on 2026-09-02 when the project split from craftzbay-ui.

## 0.0.6

### Patch Changes

- Updated dependencies [88415b8]
  - @craftzbay/ui@0.11.2

## 0.0.5

### Patch Changes

- Updated dependencies [4a05b8f]
- Updated dependencies [ad64552]
- Updated dependencies [4d3b80f]
  - @craftzbay/ui@0.11.1

## 0.0.4

### Patch Changes

- Updated dependencies [5ff1a7b]
- Updated dependencies [f500b9c]
- Updated dependencies [c4fe1d6]
- Updated dependencies [2e5e8d4]
- Updated dependencies [5395f74]
- Updated dependencies [c4900d0]
- Updated dependencies [2227223]
- Updated dependencies [e471206]
- Updated dependencies [c4fe1d6]
  - @craftzbay/ui@0.11.0

## 0.0.3

### Patch Changes

- Updated dependencies [0ce7563]
  - @craftzbay/ui@0.10.0

## 0.0.2

### Patch Changes

- Updated dependencies
  - @craftzbay/ui@0.9.0

## 0.0.1

### Patch Changes

- Updated dependencies [16b9a77]
  - @craftzbay/ui@0.8.1
