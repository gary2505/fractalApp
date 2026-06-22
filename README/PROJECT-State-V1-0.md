# PROJECT-State-V1-0

Project: `fractalApp`  
Date: `2026-06-21`  
State version: `V1-0`  
Based on: `PROJECT-STATE-V-07.md`  
Repo: `https://github.com/gary2505/fractalApp.git`

## One-line product goal

```txt
fractalApp = stable Core + Shared Foundation + Fractal Apps + Versioned Blocks
```

Main product vision:

```txt
Create a modern, easy UI desktop app for vibe coding, better than VS Code/Cursor.
Main value: AI Agent Control Center that creates/fixes code safely,
minimizes token cost, works with many agents/models, verifies work,
and learns from mistakes without breaking the system.
```

Most important rule:

```txt
Tokens are user money.
Every AI workflow must minimize token usage by design.
```

## Current confirmed status

User confirmed:

```txt
v0.9 checked locally
all known errors fixed
everything is OK
latest copies pushed to GitHub
v1-base freeze step done
```

Current milestone:

```txt
v1-base = stable architecture proof base
```

v1-base proves:

```txt
Core boots alone
components load through manifest
component update/rollback works
CoreBridge/Policy/native-access direction exists
Health/Repair/Reset/Safe/Crash recovery exists
theme/language/session basics work
```

## Important correction from latest planning

Do not keep creating many skeleton Fractal Apps.

Current decision:

```txt
Foundation is enough for now.
Stop making extra skeletons.
Start building one real vertical UI slice.
```

Best next real UI target:

```txt
Settings Popup v1
```

Why Settings Popup first:

```txt
small
safe
tests Shared UI
tests popup/modal/snackbar
tests theme/lang/tokens
tests messages/i18n
does not require dangerous AI logic
```

After Settings Popup:

```txt
AI Agent Chat Popup UI v1
```

## Correct next development order

```txt
1. Verify installed foundation files from ZIPs
2. Build real Settings Popup v1
3. Build AI Agent Chat Popup UI shell
4. Add Token Budget panel
5. Add Context Gate panel
6. Add Patch Preview panel
7. Add Gate Runner panel
8. Connect real AI workflow later
```

Do not do now:

```txt
real PDF editor
real DB1Hub
real Explorer filesystem access
real Terminal
real AI provider integration
remote updates
native extensions
large UI polish without foundation rules
```

## Generated ZIP blocks in previous session

These ZIPs were created as safe new-file-only drops.
They do not edit `package.json` and do not change Core.
Agent must verify whether they are already installed in repo before copying.

```txt
fractalApp-block-ui-system-new-files.zip
fractalApp-block-fractal-app-contract-new-files.zip
fractalApp-block-versioned-blocks-new-files.zip
fractalApp-block-ai-agent-chat-new-files.zip
```

Purpose:

```txt
block-ui-system                  = Shared UI/design/motion/icon/message/hotkey/input foundation
block-fractal-app-contract       = Fractal App contract/templates
block-versioned-blocks           = block manifest/version/rollback contract
block-ai-agent-chat              = AI Agent Chat skeleton only, no real provider logic
```

Important:

```txt
Do not assume these are installed.
Check repo first.
If file exists, do not overwrite silently.
```

## UI foundation direction

UI System means more than reusable components.

It must include:

```txt
consistent shared components
premium visual design
motion rules
keyboard behavior
accessibility
theme/design tokens
icon registry
message/i18n registry
hotkey registry
performance rules
AI-agent rules against random ugly UI
```

Design quality rules to preserve:

```txt
8px spacing grid
4px allowed for micro-elements
no pure #000 text on pure white background
typography hierarchy via weight/color, not only size
thin semi-transparent borders
soft low-opacity shadows
nested radius rule
brand-tinted dark grays
motion 150-180ms, hard cap 300ms
no animation for keyboard-triggered actions
tooltips instant on repeated hover
DaisyUI first
no random feature-local CSS
```

## Required Shared UI folders

Expected foundation direction:

```txt
src/shared/design/
src/shared/ui/
src/shared/icons/
src/shared/messages/
src/shared/hotkeys/
src/shared/input/
```

Shared UI catalog target:

```txt
button
input
select
slider
checkbox
switch
tabs
toolbar
panel
popup
modal
snackbar
tooltip
context-menu
icon
empty-state
error-state
loading-state
list
tree
table
```

Core rule:

```txt
No feature-local random CSS/UI/icons/messages/hotkeys.
Everything goes through shared foundation.
```

## Settings Popup v1 target

Goal:

```txt
Build first real UI slice using Shared UI foundation.
```

Scope:

```txt
Settings Popup only
no global redesign
no AI Chat yet
no Explorer/PDF/DB1Hub
```

Settings Popup should test:

```txt
UiPopup or UiModal behavior
UiButton / UiSelect / UiSwitch / UiTabs if available
message registry EN/RU
theme tokens
language switch
a11y labels
keyboard navigation
snackbar feedback
focus restore
Escape close
outside click close if allowed
```

Settings groups v1:

```txt
Appearance
Language
AI / Token defaults placeholder
Advanced / Recovery links placeholder
```

Minimum real behavior:

```txt
theme switch works
language switch works
save/cancel works
changes go through Intent/StatePatch if existing architecture supports it
snackbar uses message key
no hardcoded user-facing warning/error text
```

## AI Agent Chat UI direction after Settings

AI Agent Chat is the main product value, but build UI before real AI logic.

AI Chat Popup UI v1 should include:

```txt
Task input
Model selector
Agent mode
Token budget
Allowed scope
Files to read
Plan
Patch preview
Run gates
Error log
Rollback button
Parallel agents panel
```

Agent modes:

```txt
architect
patch-executor
reviewer
tester
debugger
refactor-small
doc-writer
summarizer
```

Do not connect real provider yet.

## Token Budget Engine direction

Most important AI product feature.

Rules:

```txt
Read only needed files
Use .ai/idx first
Never scan whole repo by default
Max lines per task
Compress context
Reuse summaries
Compare before/after
Show estimated token cost
Choose cheap model for simple task
Use expensive model only when needed
```

Agent must avoid:

```txt
reading README repeatedly
reading whole codebase
printing full code blocks when patch is enough
long explanations
re-reading files already in context
using expensive models for simple text edits
```

## Fast iteration rule

Current user preference:

```txt
Do not waste time running full tests/clean after every small patch.
Go forward fast.
Run full validation once at block end or before freeze.
```

Per small step:

```txt
run only targeted check/gate if available
no full rebuild
no cargo clean
```

At block end:

```txt
run pnpm gate
run pnpm check
run cargo clean/build only once if needed
```

Cargo rule:

```txt
Never run cargo clean unless specifically required by Rust/cache error or user asks.
```

## AI agent behavior rules

AI executor is patch executor, not architect.

Always follow:

```txt
Do not redesign
Do not add unrelated features
Read .ai/idx first if available
Read max 20-50 exact lines unless task requires more
Use unified diff or direct edit tools
One patch fixes one issue
Run smallest relevant check
Stop after patch
```

Token rules:

```txt
Be concise
Do not echo full code
Use edit tools directly
Read files in large chunks once
Do not re-read files already in context
Do not read README/docs unless task needs them
Do not scan whole project
Use exact scope and exact files
```

Patch scope must define:

```txt
target app/block/service/file
allowed files
forbidden files
gate/check to run
rollback path
```

## Next-agent task recommendation

Recommended next task:

```txt
Build Settings Popup v1 using Shared UI foundation.
```

Agent prompt:

```txt
Task: build real Settings Popup v1 for fractalApp.

Goal:
Create first real vertical UI slice after v1-base and UI foundation.
Use existing Core/settings/theme/i18n/Intent/StatePatch flow if present.
Use Shared UI foundation where available.

Rules:
- Do not redesign Core.
- Do not add AI Chat, Explorer, PDF, DB1Hub features.
- Do not make more skeleton apps.
- Do not overwrite existing files without checking.
- No random CSS, colors, z-index, icons, or hardcoded messages.
- Use design tokens and message registry where available.
- Use fast iteration mode.
- Do not run cargo clean.

UI requirements:
- Settings opens as Popup/Modal.
- Escape closes.
- Focus returns to opener.
- Theme switch works.
- Language switch works.
- Save/Cancel behavior is clear.
- Snackbar uses message key.
- Keyboard navigation works.
- No animation for keyboard-triggered actions.
- Motion duration 150-180ms for pointer UI, max 300ms.

Before editing:
- inspect current settings files only
- inspect shared/ui, shared/design, shared/messages only if needed
- report conflicts if foundation files are missing

After patch:
- run smallest relevant check
- run pnpm check only if safe
- do not run full rebuild repeatedly
- stop after patch
```

## Current roadmap after Settings Popup

```txt
1. Settings Popup v1
2. AI Agent Chat Popup UI v1
3. Token Budget panel
4. Context Gate panel
5. Patch Preview panel
6. Gate Runner panel
7. Error Memory UI
8. Real AI workflow integration
9. Explorer shell only when needed by AI workflow
10. DB1Hub/PDF later
```

## Final guardrail

```txt
Do not build more empty skeletons unless needed.
Build one real vertical slice at a time.
Keep Core stable.
Keep scope small.
Protect tokens.
Make UI beautiful, fast, keyboard-safe, and consistent.
```
