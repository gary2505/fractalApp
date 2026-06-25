# PROJECT-STAGE-V1-09

Project: `fractalApp`
Date: `2026-06-24`
Stage: `V1-09`
Purpose: preserve canon with LOCK blocks and add Component Bundle Contract.

---

## One-line truth

```txt
fractalApp = desktop exe with stable Core and updatable versioned web bundles.
```

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

Core is stable.
Web components are versioned.
Components update without full binary update.

Native path:

Web Component -> CoreBridge -> Policy -> Core -> Rust

Forbidden:
component calls Tauri/Rust directly
component reads filesystem directly
component owns native permission logic

END LOCK

---

LOCK

FRACTAL ARCHITECTURE CANON:

App -> Domain -> Feature -> Flow -> Step -> Cell

Feature:
what user wants

Flow:
user/system path from input to result

Step:
small observable part of flow

Cell:
smallest code/action unit that can be checked

Every real interactive block must define:
boundary
inputs
outputs
parent callbacks
state read/write
expected result
actual probe
proof/check

UI is not done when it renders.
UI is done when Flow -> Step -> Cell path is proven.

Required interaction proof:
child event -> parent callback -> state change -> render result

END LOCK

---

LOCK

PROOF WORKFLOW CANON:

Evidence beats instructions.
Visible UI is not proof.
Interaction proof is proof.

No blind UI patch.
Expected -> Actual -> Diff -> Small patch -> Proof.

Small bug:
local search
smallest patch
smallest check
proof
stop

Lost agent:
add tracer/probe first
inspect actual state
compare expected vs actual
patch only brokenAt

AI reads short result first.
AI reads raw trace only if brokenAt is unknown.

END LOCK

---

LOCK

COMPONENT BUNDLE CANON:

fractalApp user installs/runs desktop exe.
New UI components update as compiled web bundles, not as .svelte files.

Bundle example:

AppData/fractalApp/components/main-v1-7/
manifest.json
index.html
assets/main.js
assets/main.css
i18n/en.json
i18n/ru.json
hotkeys.json
contract.json
proof.json

Core owns:
theme setting
language setting
hotkey router
base css
design tokens
CoreBridge
native permissions
rollback

Bundle owns:
compiled js
local css
local i18n strings
declared hotkeys
contract
proof

CSS rule:
Core CSS = reset, DaisyUI/Tailwind base, theme tokens, global layout.
Bundle CSS = only component-specific styles.

Theme rule:
Bundle uses Core CSS variables/tokens.
Bundle must not create its own theme system.

Language rule:
Core i18n = common words.
Bundle i18n = feature-specific words.

Hotkey rule:
Bundle declares hotkeys.
Core validates conflicts and dispatches allowed actions.
Bundle does not catch global hotkeys directly.

Native rule:
Bundle -> CoreBridge -> Policy -> Core -> Rust

Bundle is not default until it passes:
load proof
render proof
interaction proof
parent callback proof
rollback proof

END LOCK

---

## Current real issue

Version Switcher shows:

```txt
v1-0
v1-1
v1-2
```

Broken behavior:

```txt
click v1-1 does nothing
after click v1-1, X close does not work
popup stays open
```

This remains the current proof case.

---

## Current target

```txt
Version Switcher Proof Slice v1
```

Goal:

```txt
find brokenAt
patch only brokenAt
prove interaction contract
```

Do not build yet:

```txt
full proof framework
component bundle loader
remote update server
pattern compiler
large .fractal system
new switcher UI
```

---

## Current interaction contract

```txt
1. Ctrl+Alt+Backspace opens switcher.
2. Switcher shows only main versions.
3. UI labels are v1-0, v1-1, v1-2.
4. Click v1-0 opens main-v1-0 and makes it default.
5. Click v1-1 opens main-v1-1 and makes it default.
6. Click v1-2 opens main-v1-2 and makes it default.
7. Click any version closes switcher.
8. X closes switcher.
9. Esc closes switcher.
10. main-v1-2 is empty screen with label v1-2.
```

---

## Patch notes collected

### PATCH-001 — Svelte `$inspect` as dev sensor

```txt
$inspect = local dev signal
trace/proof = AI-readable short result
```

---

### PATCH-002 — Fractal block contract rule

```txt
Interactive block is not done until child -> parent -> state -> render path is proven.
```

---

### PATCH-003 — PROJECT-STAGE lock rule

```txt
LOCK
text that must not change
END LOCK
```

Rule:

```txt
Text between LOCK and END LOCK must be copied unchanged into next PROJECT-STAGE.
```

---

### PATCH-004 — Output hard limit

```txt
5 lines default
result first
no long theory
patch only when asked
```

---

### PATCH-005 — Component Bundle Contract

```txt
bundle = js + local css + local i18n + hotkeys + contract + proof
core = theme + language setting + hotkey router + base css + bridge + rollback
```

Base code change:

```txt
not needed now
needed later when building real component bundle loader
```

---

## Last created artifact

```txt
fractalApp-version-switcher-proof-slice-v1.zip
```

Status:

```txt
created
not checked with pnpm
waiting for user test/proof result
```

Expected proof source:

```txt
localStorage["fractal.proof.version-switcher-v1"]
```

---

## Correct next workflow

```txt
1. Install/test proof slice.
2. Click v1-1.
3. Read short proof result.
4. Patch only brokenAt.
5. Re-test click v1-1, X, Esc.
6. Stop when contract passes.
```

---

## Next coding agent prompt

```txt
Continue fractalApp.
Read PROJECT-STAGE-V1-09.md.
Follow LOCK blocks exactly.
Be concise. 5 lines default.

Current target: Version Switcher Proof Slice v1.
Do not fix blindly.
Do not redesign.
Do not build full proof framework.
Do not build component bundle loader yet.
Do not run pnpm unless asked.

Use proof result first.
Patch only brokenAt.
Report Changed / Checked / Proof / Not checked.
```

---

## Final guardrail

```txt
Current bug first.
Proof slice first.
Component loader later.
Framework later.
```
