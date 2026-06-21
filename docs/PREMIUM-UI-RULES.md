# Premium UI Rules

fractalApp UI should feel clean, expensive, quiet, and fast.

## Visual quality

```txt
Less noise.
More structure.
Clear hierarchy.
Soft contrast.
Precise spacing.
Fast feedback.
```

## Typography

Use hierarchy like this:

```txt
primary text: stronger weight
secondary text: muted color
metadata: smaller + muted
large heading: tight line-height
```

Do not scale every title up. Use weight and color first.

## Spacing

Use 8px grid. Use 4px only for micro-elements.

Bad:

```txt
random 5px / 13px / 17px gaps
```

Good:

```txt
4px / 8px / 12px / 16px / 24px / 32px
```

## Borders and shadows

Use one of:

```txt
1px soft border
very low opacity shadow
surface contrast
```

Do not stack heavy borders and heavy shadows together.

## Dark mode

Dark surfaces should have a slight cool brand tint.

Avoid:

```txt
flat muddy gray
pure black panels
pure white text everywhere
```

## 60-30-10 rule

```txt
60% neutral surfaces
30% secondary surfaces/content
10% accent/primary actions
```

## Nested radii

```txt
parent card radius > child button/input radius
```

Example:

```txt
modal 16px
panel 12px
input 8px
small badge 6px
```
