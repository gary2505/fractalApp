---
description: CSS must use DaisyUI only and inherit root font settings.
---

## CSS rules

- Use only DaisyUI utility classes for styling. No custom CSS overrides.
- Font must inherit from `:root`:
  ```css
  :root {
    font-family: var(--font-sans);
    --font-size-root: 14px;
    font-size: var(--font-size-root);
  }
  ```
- Do not apply explicit `font-size` or `font-family` classes like `text-xs`, `text-sm`, etc. — let elements inherit the root cascade.
