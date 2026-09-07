---
'@gerege-systems/ui': minor
---

Secondary buttons drop their border, and the accent foreground gains an alias.

`secondary` and `outline` differed only by a fill: both drew the same
`border-input` stroke, so the pair read as one variant with two moods. The fill
is now the shape — `secondary` uses new `--secondary` / `--secondary-hover` /
`--secondary-active` tokens, a step darker than `background-muted` so the button
is legible without a stroke, and `outline` keeps the 3:1 border for controls
that need one.

`--accent-foreground` is now also exposed as `text-accent-foreground`. The
variable existed while the only utility was `text-on-accent`, so reaching for the
variable's own name generated nothing and left dark text on the accent fill.
`--accent-subtle-foreground` gains the same alias.
