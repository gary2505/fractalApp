# PROJECT-STAGE-V1-04

Project: `fractalApp`  
Date: `2026-06-22`  
Stage: `V1-04`  
Purpose: next-session checkpoint after simplifying AI-agent workflow.

---

## One-line truth

```txt
fractalApp = Core-Web + Fractal Architecture + simple AI-agent workflow.
```

Main rule:

```txt
Evidence beats instructions.
Less prompt. More local proof.
```

---

## Current project direction

Confirmed direction:

```txt
v1-base is frozen.
Do not create more empty skeletons.
Next real vertical slice = Settings Popup v1.
```

Settings Popup v1 remains the next build target.

It must prove:

```txt
shared UI works
theme switch works
language switch works
popup/modal behavior works
keyboard/focus behavior works
snackbar/message registry works
small feature can be built without breaking Core
```

---

## Blocks created in this session

### 1. `block-system`

System mechanics moved to:

```txt
src/system/
  async/
  input/
  runtime/
  diag/
  index.ts
```

Rule:

```txt
src/system = app-wide mechanics only.
```

Allowed in `src/system`:

```txt
async
input gates
click/key control
runtime operations
diagnostics/logs
safety net
race control
```

Forbidden in `src/system`:

```txt
UI components
feature state
feature CSS
settings UI
hardcoded user messages
```

---

### 2. `block-agent-skills`

Added short reusable skills:

```txt
.ai/skills/
```

Skills are not mandatory ceremony.

They are small guardrails used only when useful.

Rule:

```txt
Do not read all skills.
Read max 1-3 skills only when needed.
```

---

### 3. `block-agent-start`

Added first structured agent entry:

```txt
.ai/start.md
.ai/idx/map.md
plan/
.ai/checks/
```

Later correction:

```txt
.ai = general agent rules
plan = concrete feature plan + tests + metrics
src = product code
```

Feature plans belong in `plan/`, not `.ai/recipes/`.

---

### 4. `block-agent-gates`

Added check idea:

```txt
Rule without check = wish.
Rule with check = law.
```

Checks added for:

```txt
names
paths
core-web
fractal
i18n
platform
```

Important correction:

```txt
Checks are guardrails.
They must not become heavy ceremony for every tiny fix.
```

---

### 5. `block-agent-router`

Final simplified workflow block.

Added:

```txt
.github/copilot-instructions.md
.ai/router.md
.ai/skills/agent/simple.md
.ai/skills/agent/tracer.md
.ai/skills/agent/done.md
```

Main rule:

```txt
Small bug = local search first.
Big feature = plan first.
Lost agent = tracer first.
Done = proof required.
```

---

## Final simplified workflow

### Small bug / follow-up fix

Example:

```txt
The popup must close by Esc.
```

Correct workflow:

```txt
local search
smallest patch
smallest check
proof
stop
```

Do not:

```txt
read many docs
load full plan
scan whole repo
redesign feature
create new architecture
```

---

### Big feature

Example:

```txt
Add Settings Popup v1.
```

Correct workflow:

```txt
read plan
read max 1-3 skills
patch in small steps
run checks
show proof
```

---

### Lost agent / unclear bug

Correct workflow:

```txt
add tracer
inspect actual state
compare expected vs actual
patch
remove temporary tracer
show proof
```

Do not:

```txt
add more long prompt
invent theory
rewrite architecture
```

---

## Router rule

`.ai/router.md` must stay short.

Limit:

```txt
router max 50 lines
skills max 80 lines each
copilot instructions max 30 lines
```

Router is only a traffic sign.

It must not become a second brain.

---

## Copilot rule

`.github/copilot-instructions.md` should be short.

Expected behavior:

```txt
Use shortest working path.
For small fixes, search code first and patch locally.
Read max 1 skill only if needed.
For big features, use plan.
Do not redesign.
Do not scan whole repo.
If lost, add tracer instead of reading more docs.
Done only with Changed / Checked / Proof / Not checked.
```

---

## Naming rule

Short names only.

Bad:

```txt
block-system-foundation-from-filesup
src/settings/setting-session/session-store.ts
src/shared/input/click-controller.ts
```

Good:

```txt
block-system
src/settings/store.ts
src/system/input/click.ts
```

Rule:

```txt
No repeated folder meaning.
No long block names.
No feature name repeated in every file.
```

---

## Core-Web rule

Always preserve:

```txt
Web Component -> CoreBridge -> Policy -> Core -> Rust
```

Forbidden:

```txt
component calls Tauri/Rust directly
component reads filesystem directly
component owns native permission logic
```

---

## Fractal rule

For real feature code:

```txt
contract first
small vertical slice
one concern per short file
view does not own business logic
```

Example:

```txt
src/settings/
  contract.ts
  store.ts
  actions.ts
  view.svelte
  index.ts
```

---

## Multi-language rule

User-facing text must go through messages/i18n.

Bad:

```txt
"Settings saved"
```

Good:

```txt
msg("settings.saved")
```

---

## Multi-OS rule

No hardcoded platform paths.

Bad:

```txt
C:\
/Users/
hardcoded separator
```

Good:

```txt
use platform/path helper
```

---

## Self-skill for next ChatGPT session

When continuing this project, do not hallucinate a complex process.

Follow this:

```txt
1. Start from this PROJECT-STAGE file.
2. Keep answers short.
3. Prefer simple workflow.
4. Do not invent new blocks unless user asks.
5. Small bug = local search + small patch + check.
6. Big feature = plan + few skills + checks.
7. If unsure, say what is unknown.
8. If agent is lost, add tracer, not more theory.
9. Do not make long instruction systems unless they replace a real recurring failure.
10. Keep next target: Settings Popup v1.
```

Important correction to remember:

```txt
Skills/plan/checks are support tools.
They are not mandatory ritual for every prompt.
```

Most important phrase:

```txt
Evidence beats instructions.
```

---

## Current next step

Recommended next implementation task:

```txt
Build Settings Popup v1.
```

Recommended prompt for coding agent:

```txt
Add Settings Popup v1.
Use shortest working path.
Use plan/settings-popup.md only if needed.
Keep scope small.
No redesign.
No direct Tauri/Rust from component.
No hardcoded user text.
Run smallest relevant check.
Report Changed / Checked / Proof / Not checked.
```

---

## Final guardrail

```txt
The agent is already smart.
Do not drown it in instructions.
Give it short guardrails, local evidence, and checks.
```
