# Design Tokens

Design tokens are the single source for spacing, radius, typography, motion, z-index, and semantic UI values.

## Spacing

Use an 8px grid for layout and 4px for micro spacing.

```txt
0    = 0px
0.5  = 4px
1    = 8px
1.5  = 12px
2    = 16px
3    = 24px
4    = 32px
5    = 40px
6    = 48px
8    = 64px
```

## Typography

Use weight and subtle color contrast before increasing size.

```txt
xs  12px
sm  13px
md  14px
lg  16px
xl  20px
2xl 24px
```

Large headers use tighter line-height:

```txt
1.1 - 1.2
```

Do not use pure black text on pure white background.

## Radius

```txt
sm  6px
md  8px
lg  12px
xl  16px
```

Nested radius rule:

```txt
Child radius must be smaller than parent radius.
```

## Border

Use thin soft borders:

```txt
1px
semi-transparent
low contrast
```

Prefer soft shadows only when border makes UI noisy.

## Z-index

Use named tokens only:

```txt
dropdown
sticky
popup
modal
snackbar
tooltip
crash
```

No feature component may invent z-index values.

## Color

Use semantic tokens:

```txt
surface
surface-muted
text
text-muted
border
primary
success
warning
error
info
```

Dark mode should include a tiny brand tint in gray surfaces so it does not look muddy.
