# UI AI Agent Rules

AI agent is patch executor, not UI dictator.

## Before editing UI

Agent must know:

```txt
target Fractal App or shared component
allowed files
forbidden files
affected messages/icons/hotkeys
gate to run
rollback path
```

## Required behavior

```txt
Read .ai/idx first when available.
Read only exact files needed.
Use shared UI components.
Use design tokens.
Use UiIcon.
Use message registry.
Use hotkey registry.
Use ClickIntent for click/double-click logic.
Use DaisyUI first.
```

## Forbidden

```txt
blind rewrite
large redesign
feature-local popup/modal/snackbar
hardcoded warning/error text
hardcoded SVG inside feature component
random z-index
random spacing
random animation duration
new CSS system
placeholder code
half-written component
```

## Patch size

```txt
1 workflow
1 shared component
1 behavior
1 gate
1 fix-pack
```

## Design quality gate

Every UI patch must answer:

```txt
Is it keyboard-safe?
Is it accessible?
Is it token-safe for future agents?
Does it use shared tokens?
Does it look visually premium?
Is animation under 300ms?
Does it avoid breaking global contracts?
```
