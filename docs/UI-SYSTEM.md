# UI System

`block-ui-system` creates one shared UI foundation for all future Fractal Apps.

## Goal

```txt
Consistent + premium + fast + accessible + AI-safe UI.
```

The UI system is not only reusable buttons. It defines product taste, interaction quality, keyboard behavior, messages, icons, motion, and patch boundaries.

## Rules

```txt
Use DaisyUI first.
Use shared design tokens.
Use shared UI components.
Use shared icons through UiIcon.
Use shared message registry.
Use shared hotkey registry.
Use shared popup/modal/snackbar implementation.
Use shared ClickIntent service for click/double-click.
```

Do not use:

```txt
random feature-local CSS
hardcoded colors
hardcoded font sizes
hardcoded z-index values
hardcoded SVG icons in feature components
hardcoded warning/error text
custom popup/modal/snackbar per feature
mouse-only behavior
```

## Component hierarchy

```txt
Atom -> Molecule -> Organism -> Screen -> Workflow -> Fractal App
```

## Shared UI catalog

```txt
src/shared/ui/
  button/
  icon/
  popup/
  modal/
  snackbar/
```

Future components should be added in small independent patches.

## Required behavior for every interactive component

```txt
loading
disabled
readonly
error
empty
focused
selected
active
hover
keyboard navigation
screen-reader label
i18n text
theme tokens
small/medium/large size
```

## Keyboard baseline

```txt
Arrow keys move inside component.
Home goes to first item/value.
End goes to last item/value.
Escape closes popup/modal/menu or cancels edit.
Enter activates selected item.
Tab leaves component normally.
```

No functionality should be mouse-only.

## AI agent rule

```txt
Do not only make UI functional.
Make it consistent, fast, keyboard-safe, accessible, and visually premium.
```
