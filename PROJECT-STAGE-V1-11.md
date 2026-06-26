# PROJECT-STAGE-V1-11

Project: `fractalApp`  
Date: `2026-06-25`  
Stage: `V1-11`  
Purpose: freeze shared popup template cleanup after local test pass.

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

LOCK
text that must not change
END LOCK

---

## Freeze result

```txt
Shared Popup Template Cleanup v1 passed.
```

User-confirmed status:

```txt
all tests passed
```

Frozen scope:

```txt
shared popup template normalized
shared short UI paths confirmed
contracts co-located beside boundary blocks
version switcher popup proof preserved
```

---

## Frozen shared UI paths

```txt
src/lib/ui/tpl/popup.svelte
src/lib/ui/tpl/icon-btn.svelte
src/lib/ui/icons/x.svelte
```

Contract locations:

```txt
src/lib/ui/tpl/popup.contract.json
src/main-window/start-v1-1.contract.json
src/main-window/start-v1-1.etalon.json
```

Rule preserved:

```txt
shared template -> src/lib/ui/tpl
shared icon -> src/lib/ui/icons
contract lives beside block it proves
```

---

## Verified behavior

```txt
Version switcher opens
X close works
Esc close works
outside click close works
select version closes popup
focus starts on active row, not X
Bits Dialog close state remains source of truth
```

---

## Checked

```txt
pnpm check passed
popup runtime test passed
version switcher interaction proof passed
```

Note:

```txt
This freeze records user-confirmed local test results.
```

---

## Changed

```txt
popup template cleanup completed
short shared path usage completed
old proof-slice popup path replaced by shared UI path
popup contract co-located with popup template
version switcher contract/etalon co-located with start-v1-1
```

---

## Proof

Expected:

```txt
child event -> parent callback -> state change -> render result
```

Actual:

```txt
select version closes popup
X closes popup
Esc closes popup
outside click closes popup
active row focus remains correct
```

Result:

```txt
Expected = Actual
```

---

## Not checked

```txt
remote bundle loader
remote update server
full proof framework
large .fractal system
new main layout shell
```

Reason:

```txt
out of scope for V1-11 freeze
```

---

## Completed artifacts / patch source

```txt
fractalapp-popup-cleanup-patch.zip
PATCH-APPLY.md
PATCH-REPORT.md
```

---

## Current repo

```txt
https://github.com/gary2505/fractalApp.git
```

---

## Current target for next session

```txt
Choose next small proof block after popup template freeze.
```

Recommended next block:

```txt
main window layout template proof
```

Do first:

```txt
write target contract
create smallest visible layout proof
verify one child -> parent -> state -> render path
stop after proof
```

Do not build yet:

```txt
full component bundle loader
remote updater
AI agent chat
large panel system
```

---

## Next coding agent prompt

```txt
Continue fractalApp.
Use PROJECT-STAGE-V1-11.md.
Repo: https://github.com/gary2505/fractalApp.git
Status: shared popup template cleanup is frozen and all tests passed.
Task: choose and implement the next smallest proof block only.
Recommended: main window layout template proof.
Patch only brokenAt.
Report Changed / Checked / Proof / Not checked.
```

---

## Final guardrail

```txt
Token saving first.
Short prompt first.
Small patch first.
Proof before next feature.
```
