# PROJECT-STAGE-V1-12

Project: `fractalApp`  
Date: `2026-06-26`  
Stage: `V1-12`  
Purpose: restore product vision and design canon while advancing to main window layout proof.

---

## One-line truth

```txt
fractalApp = an AI Agent Control Center built on a stable Core with updatable versioned web bundles.
```

---

LOCK

VISION & PHILOSOPHY:

Goal: AI Agent Control Center better than Cursor/VS Code.
Safety: AI creates/fixes code safely without breaking the system.
Economy: Tokens are user money. Minimize token usage by design.
Speed: Fast, keyboard-first, and premium visual design.

END LOCK

---

LOCK

OUTPUT RULE:
5 lines default.
First give result.
No long theory.
No repeat old rules.
If more needed — ask first.

END LOCK

---

LOCK

CORE-WEB CANON:
Core is stable. Web components are versioned.
Native path: Web Component -> CoreBridge -> Policy -> Core -> Rust.
Forbidden: direct Tauri/Rust calls, direct FS access, local native permission logic.

END LOCK

---

LOCK

DESIGN & UI CANON:
8px spacing grid. 4px micro-elements.
No pure #000 on pure white.
Thin semi-transparent borders + soft low-opacity shadows.
Motion: 150–180ms. Hard cap 300ms.
Keyboard: Every action must be reachable by keyboard (Arrows, Enter, Esc, Home, End).
description: CSS must use DaisyUI only and inherit root font settings.
---

CSS rules

- Use only DaisyUI utility classes for styling. No custom CSS overrides if necessary.
- Font must inherit from `:root`:

  ```css

  :root {
    font-family: var(--font-sans);
    --font-size-root: 14px;
    font-size: var(--font-size-root);
  }
  ```

- Do not apply explicit `font-size` or `font-family` classes like `text-xs`, `text-sm`, etc. — let elements inherit the root cascade.

END LOCK

---

LOCK

FRACTAL ARCHITECTURE CANON:
App -> Domain -> Feature -> Flow -> Step -> Cell.
UI is only done when child event -> parent callback -> state change -> render result is proven.

END LOCK

---

LOCK

PROOF WORKFLOW CANON:
Evidence beats instructions.
Visible UI is not proof.
Expected -> Actual -> Diff -> Small patch -> Proof.

END LOCK

---

LOCK

COMPONENT BUNDLE CANON:
Core owns theme, language, hotkeys, design tokens, CoreBridge, rollback.
Bundle owns compiled assets, local i18n, contract and proof.
Bundle uses Core tokens and must not implement its own theme system.

END LOCK

---

## Technical Freeze: V1-11 Result

```txt
Shared Popup Template Cleanup v1 passed.
```

Status:
- Shared popup template normalized.
- Shared UI paths frozen.
- Contracts co-located with boundary blocks.
- Version switcher proof passed.

## Roadmap

1. Main Window Layout Template Proof
2. AI Agent Chat UI shell
3. Token Budget Panel
4. Context Gate & Patch Preview
5. Real AI workflow integration

## Current Target

```txt
Main Window Layout Template Proof
```

Goal:
- Contract first.
- Small visible proof.
- Verify child -> parent -> state -> render.

## Final guardrail

```txt
Protect tokens.
Evidence beats instructions.
Small patch first.
```
