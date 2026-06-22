# PROJECT-STATE-V-07

Project: `fractalApp`  
Date: `2026-06-21`  
State version: `V-07`  
Previous state file: `PROJECT-STATE-06-21.md`  
Current goal: freeze `v1-base`, then build the production foundation before any real Fractal App UI.

## One-line product goal

```txt
fractalApp = stable Core + Shared Foundation + Fractal Apps + Versioned Blocks
```

Main product vision:

```txt
Create a modern, easy UI desktop app for vibe coding, better than VS Code/Cursor.
The main value is an AI Agent Control Center that creates/fixes code safely,
minimizes token cost, works with many agents/models in parallel, verifies work,
and learns from mistakes without breaking the system.
```

Most important business rule:

```txt
Tokens are user money.
Every AI workflow must minimize token usage by design.
```

## Current target

```txt
v1-base = architecture proof project
not final UI
not full IDE
not PDF editor
not DB studio
not AI coding product yet
```

The base app must prove:

```txt
1. Core boots alone
2. Components are external/versioned
3. Components load through manifest
4. Components do not call Tauri/Rust directly
5. CoreBridge + Policy controls native access
6. Update/Rollback works without binary update
7. Fractal Binding / Fractal Patch rules are ready for future UI
8. Broken manifest/component does not kill the Core
9. User can recover through Health / Repair / Reset MF / Safe or Crash screen
```

## Tech stack

```txt
Tauri 2
Rust
Svelte 5
Vite
DaisyUI
pnpm only
Desktop only: Windows / Linux / macOS
App data root: platform app-data/fractalApp
```

## Architecture

```txt
Stable Tauri 2 Core
+ Shared Foundation
+ Isolated versioned Svelte Web Components
+ Fractal Apps
+ Fractal Versioned Blocks
+ Fractal verified workflows
+ Fractal Binding
+ Fractal Patch
+ Optional native extensions / sidecars later
```

Native access flow:

```txt
Component iframe
-> CoreBridge v1
-> Policy Engine
-> Core command
-> Rust command
-> Result
```

Core rule:

```txt
Core is the stable runtime/player.
Core must not know DB1Hub/PDF/Explorer/AI Chat business logic.
Core loads, isolates, authorizes, logs, updates, rolls back, and recovers.
```

## Naming decision

Use this language:

```txt
fractalApp Core     = stable runtime
Shared Foundation   = UI system, tokens, messages, hotkeys, logs, result format, gates
Fractal Apps        = big product apps/subsystems: AI Agent Chat, Explorer, DB1Hub, PDF Editor
Versioned Blocks    = small independently updateable/testable units inside Fractal Apps
Fractal Services    = small internal services, not necessarily separate OS microservices
```

Do not use:

```txt
core subprojects
```

Preferred term:

```txt
Fractal Apps
```

## Fractal rules

Runtime UI/state changes:

```txt
Fractal Binding = Intent -> Policy -> Flow -> State Patch -> Render -> Audit
```

AI code changes:

```txt
Fractal Patch = Issue -> Index -> Exact Lines -> Unified Diff -> Gate -> Audit
```

Core rule:

```txt
Do not rewrite everything.
Change only the smallest verified piece.
```

Work size rule:

```txt
1 workflow
1 component
1 service
1 gate
1 fix-pack
1 versioned block
```

## Current project version

Latest generated ZIP:

```txt
fractalApp-v0.9.zip
```

Generated stages:

```txt
v0.1 base scaffold
v0.2 local update/rollback proof
v0.3 Fractal Binding proof
v0.4 multi-component shell
v0.5 health/recovery foundation
v0.6 baseline stop-line
v0.7 fix pack for rollback/app-data/crash recovery
v0.8 Settings UI Template v1 through Intent/StatePatch
v0.9 Component SDK / Template Kit
```

Important honesty note:

```txt
v0.1-v0.9 were generated as project ZIPs.
Some node gates were checked in generation environment.
Rust/Svelte compile was not fully verified in that environment.
User will verify locally.
```

## User-tested results so far

Confirmed by user:

```txt
App launches
Core status visible
Welcome component loads
Health Check works
Manifest Reset works
Theme switch works
Language switch works
Update 1.0.0 -> 1.0.1 works
Rollback restores previous manifest
Session path restore works
Reload works
```

Found issues during user test:

```txt
1. After Rollback, clicking Activate again caused "component not found".
2. App data list could go out of screen with no scrollbar.
3. Broken mf/active.json opened Crash screen but had no Repair / Reset MF buttons.
```

Fix pack created:

```txt
v0.7 should fix these issues.
Needs local verification.
```

## Current stop-line

Do not add new foundation systems until `v1-base` is stable.

Allowed now:

```txt
compile fixes
runtime fixes
Tauri config fixes
Svelte fixes
Rust command fixes
app-data path fixes
manifest/recovery fixes
gate fixes
small docs fixes
```

Not allowed now:

```txt
PDF editor
DB1Hub
real file explorer
real terminal
real AI chat
real code editor
remote updates
native extensions
large UI polish
new architecture redesign
```

## Correct roadmap

Important correction:

```txt
Product priority: AI Agent Chat / vibe coding system is the main product value.
Implementation order: foundation first, AI Agent Chat after foundation.
```

Correct order:

```txt
1. freeze-v1-base
2. block-production-checklist
3. block-ui-system
4. block-subproject-contract
5. block-versioned-blocks
6. fractal-app-ai-agent-chat
7. block-explorer-shell
8. Cursor-like app workspace
9. DB1Hub / PDF Editor / other Fractal Apps
```

Do not build AI Agent Chat before UI/subproject/versioned-block foundation.
Otherwise it will become inconsistent and hard to fix.

## block-production-checklist

Goal:

```txt
Create production-ready desktop app rules before building real product UI.
```

Must cover:

```txt
security
permissions
IPC boundaries
update signing
rollback
logs
crash recovery
accessibility
keyboard navigation
performance budgets
memory budgets
AI patch safety
context/token rules
release checklist
```

Suggested docs:

```txt
docs/PRODUCTION-READY-DESKTOP-APP.md
docs/AI-PATCH-SAFETY.md
docs/RELEASE-CHECKLIST.md
docs/SECURITY-POLICY.md
docs/PERFORMANCE-BUDGET.md
```

## block-ui-system

Goal:

```txt
Create one unified UI Design System before any real UI feature.
Prevent AI agents from inventing inconsistent UI.
```

Problem:

```txt
AI agents create inconsistent sliders, buttons, popups, modals, CSS, icons,
spacing, fonts, z-index, messages, and keyboard behavior.
```

Rules:

```txt
Use DaisyUI first.
Use shared design tokens.
Use shared UI components.
No random feature-local CSS.
No hardcoded font family/font size/colors/z-index.
No direct SVG icons in feature components.
No hardcoded warning/error text.
No custom popup/modal/snackbar per feature.
```

Design tokens must include:

```txt
font.family
font.size.xs/sm/md/lg
radius.sm/md/lg
spacing.xs/sm/md/lg
panel.padding
toolbar.height
icon.size
border.width
z.index.popup/modal/snackbar/tooltip
animation.fast/normal
```

Shared UI catalog:

```txt
src/shared/ui/
  button/
  input/
  select/
  slider/
  checkbox/
  switch/
  tabs/
  toolbar/
  panel/
  popup/
  modal/
  snackbar/
  tooltip/
  context-menu/
  icon/
  empty-state/
  error-state/
  loading-state/
  list/
  tree/
  table/
```

Each shared UI component must support:

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

## Shared popup/modal/snackbar rules

All Fractal Apps must use one shared implementation.

```txt
UiPopup:
- close by Escape
- close by outside click
- optional pin mode
- correct z-index token
- focus trap if interactive
- restore focus to opener
- position: anchor / cursor / center
- auto-flip if outside screen

UiModal:
- close by Escape
- close by backdrop click if allowed
- focus trap
- Enter = primary action when safe
- Escape = cancel/close
- restore focus to opener

UiSnackbar:
- one shared stack
- success/warning/error/info variants
- auto-dismiss
- manual close
- no random colors
- message from i18n registry
```

## Shared keyboard rules

Every interactive component supports:

```txt
ArrowLeft
ArrowRight
ArrowUp
ArrowDown
Home
End
Enter
Escape
Tab
Shift+Tab
```

Behavior:

```txt
Arrow keys move inside component.
Home goes to first item/value.
End goes to last item/value.
Escape closes popup/modal/menu or cancels edit.
Enter activates selected item.
Tab leaves component normally.
```

No functionality should be mouse-only.

## Shared adaptive click behavior

Goal:

```txt
Correctly detect one click vs double click for different users.
The system should learn/adapt to user click speed.
```

Location:

```txt
src/shared/input/
  click-intent-service.ts
  use-click-intent.ts
```

Rule:

```txt
No component decides click/double-click timing by itself.
All components use shared ClickIntent service.
```

Behavior:

```txt
single click
double click
slow double click
drag start
cancel click
adaptive user timing
```

Settings:

```txt
Default double-click delay is only fallback.
System learns user speed and saves preference.
User can override it in Settings.
```

Used by:

```txt
Explorer file list
Folder tree
DB1Hub table rows
PDF thumbnails
Tabs
Preset icons
```

User note:

```txt
User has ready code for adaptive click/double-click logic.
```

## Icons

Rule:

```txt
All icons go through UiIcon.
No direct random SVG inside feature components.
Icon can be changed by user or internal agent.
Icon registry maps semantic name -> icon implementation.
```

Example semantic icons:

```txt
save
close
settings
folder
file
warning
error
rollback
health
theme
language
```

Feature usage:

```svelte
<UiIcon name="save" />
```

## Messages / warnings / errors

One source for messages:

```txt
src/shared/messages/
  messages.en.json
  messages.ru.json
  message-registry.ts
```

Rules:

```txt
No hardcoded warning text inside components.
All warnings/errors/snackbars use message key.
Every message supports EN/RU.
Message can include parameters.
```

Example message keys:

```txt
manifest.reset.success
manifest.reset.failed
component.load.failed
settings.saved
hotkey.conflict
```

## Hotkeys

Hotkeys are separate by Fractal App and language.

```txt
src/shared/hotkeys/
  hotkey-registry.ts
  hotkey-user-overrides.ts
  hotkey-i18n.en.json
  hotkey-i18n.ru.json

apps/ai-agent-chat/hotkeys/
apps/explorer/hotkeys/
apps/db1hub/hotkeys/
apps/pdf-editor/hotkeys/
```

Rules:

```txt
Default hotkeys are registered per Fractal App.
User can change hotkeys.
Conflicts must be detected.
Hotkey labels must be localized.
No hardcoded "Ctrl+S" text in UI.
```

## block-subproject-contract

Goal:

```txt
Define how Fractal Apps are created, versioned, isolated, tested, updated, and rolled back.
```

Fractal Apps examples:

```txt
AI Agent Chat
Explorer
DB1Hub
PDF Editor
Code Editor
Terminal
```

Each Fractal App has its own:

```txt
manifest
version
state file
workflows
services
components
versioned blocks
messages
hotkeys
icons
gates
tests
docs
```

All Fractal Apps share:

```txt
CoreBridge
Policy Engine
Shared UI Design System
design tokens
message registry
hotkey registry
icon registry
logging
Result/Error format
Fractal Patch rules
```

Fractal Apps must not directly:

```txt
call Tauri/Rust
read filesystem
write app-data
open native dialog
change global settings
```

They must go through:

```txt
Fractal App Component
-> CoreBridge
-> Policy
-> Allowed Service
-> Result
```

## block-versioned-blocks

Goal:

```txt
Make each important block/component/workflow independently versioned,
updateable, testable, and rollbackable.
```

Rule:

```txt
Every Fractal App is versioned.
Every important workflow/block/component inside a Fractal App can be versioned.
A patch updates only the smallest versioned unit.
```

Do not update:

```txt
whole fractalApp
whole DB1Hub
whole PDF Editor
```

If only this is broken:

```txt
db1hub.sqlite.create-table
```

Update only:

```txt
db1hub.sqlite.create-table v0.3.2 -> v0.3.3
```

Versioned units should include:

```txt
subproject / Fractal App
workflow block
reusable complex component
shared UI component
service with public API
```

Usually do not version:

```txt
small internal helper
private tiny component
CSS-only wrapper
one-use local file
```

Rule:

```txt
If other blocks depend on it, version it.
If it can be updated/rolled back separately, version it.
If it has public API, version it.
```

Suggested structure:

```txt
apps/db1hub/
  app.manifest.json
  subproject-state.md

  blocks/
    sqlite-create-table/
      block.manifest.json
      index.ts
      ui/
      workflow/
      service/
      messages/
      hotkeys/
      tests/
      gate.ts
```

Example block manifest:

```json
{
  "id": "db1hub.sqlite.create-table",
  "name": "SQLite Create Table",
  "version": "0.3.2",
  "fractalApp": "db1hub",
  "type": "workflow-block",
  "entry": "./index.ts",
  "permissions": [
    "db.sqlite.schema.read",
    "db.sqlite.schema.write"
  ],
  "dependsOn": {
    "corebridge": "1.x",
    "ui-system": "1.x",
    "db1hub.connection-manager": ">=0.5.0"
  },
  "gates": [
    "gate:db1hub:sqlite-create-table"
  ],
  "rollback": {
    "enabled": true,
    "previousVersion": "0.3.1"
  }
}
```

## Naming rules

Use short but clear names.

```txt
Short enough for tokens.
Clear enough for AI and human.
Stable forever.
```

Each versioned block has three names:

```txt
1. Canonical ID      -> db1hub.sqlite.create-table
2. Folder name      -> sqlite-create-table
3. Component name   -> SqliteCreateTableBlock
```

Version is stored in manifest, not in source file names.

Good names:

```txt
db1hub.sqlite.create-table
db1hub.mssql.create-index
db1hub.query.editor
pdf.thumbnail-rail
pdf.highlight-tool
explorer.file-list
ui.slider
ui.modal
```

Bad names:

```txt
ctb
tblnew
dbui1
block3
better-table
final-table
table-v2-new
database-sqlite-create-new-table-dialog-workflow-component
```

Rules:

```txt
Canonical ID: 3-4 parts max
Folder name: 2-4 words max
Component name: clear PascalCase
No random abbreviations
Use same words everywhere
Do not rename blocks unless absolutely necessary
Rename = migration
AI agent must search by canonical ID before editing
```

## Fractal component hierarchy

Use:

```txt
Atom -> Molecule -> Organism -> Screen -> Workflow -> Fractal App
```

Atom:

```txt
Button
Input
Select
Icon
Badge
Slider
Checkbox
```

Molecule:

```txt
SearchInput
PathBar
DbConnectionRow
PdfPageNumberInput
ToolbarButtonGroup
```

Organism:

```txt
DbTreePanel
PdfThumbnailRail
ExplorerFileList
QueryEditorPanel
```

Screen:

```txt
DB1HubMainScreen
PdfEditorScreen
ExplorerScreen
AiAgentChatScreen
```

Workflow:

```txt
connect database
open table
create table
save PDF annotation
run query
create patch
run gate
rollback manifest
```

## AI Agent Chat as first real Fractal App

After foundation, first real Fractal App:

```txt
fractal-app-ai-agent-chat
```

Goal:

```txt
AI Agent Control Center for vibe coding.
```

Must support:

```txt
efficient code creation
efficient code fixing
token budget control
context gate
small patch workflow
parallel agents
multiple models
self-checking
gates/log verification
rollback
error memory
controlled self-improvement
```

Suggested blocks:

```txt
apps/ai-agent-chat/blocks/chat-popup/
apps/ai-agent-chat/blocks/context-gate/
apps/ai-agent-chat/blocks/token-budget/
apps/ai-agent-chat/blocks/model-router/
apps/ai-agent-chat/blocks/parallel-runner/
apps/ai-agent-chat/blocks/patch-planner/
apps/ai-agent-chat/blocks/patch-review/
apps/ai-agent-chat/blocks/gate-runner/
apps/ai-agent-chat/blocks/error-memory/
apps/ai-agent-chat/blocks/rule-improvement-proposals/
```

AI Agent Chat Popup UI should include:

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

## Token Budget Engine

This is the most important AI product feature.

Rules:

```txt
Read only needed files.
Use .ai/idx first.
Never scan whole repo by default.
Max lines per task.
Compress context.
Reuse summaries.
Compare before/after.
Show estimated token cost.
Choose cheap model for simple task.
Use expensive model only when needed.
```

Agent must avoid:

```txt
reading README repeatedly
reading whole codebase
printing full code blocks when patch is enough
long explanations when short result is enough
re-reading files already in context
using expensive models for simple text edits
```

## Parallel agents

Goal:

```txt
Run many agents from different models in parallel without corrupting project state.
```

Example roles:

```txt
Agent A: cheap model reads/indexes
Agent B: coding model writes patch
Agent C: reviewer checks patch
Agent D: tester runs gate/log compare
Agent E: summarizer updates memory/rules
```

Safety:

```txt
No agent can directly overwrite Core/shared foundation without allowed scope.
No agent can silently apply patch outside task scope.
No agent can change its own rules directly.
All patches go through gate + audit + optional user approval.
```

## Error Memory

Goal:

```txt
Agent learns from mistakes and avoids repeating them.
```

Store:

```txt
bug pattern
root cause
bad patch
correct fix
files involved
rule to prevent repeat
gate that should catch it next time
```

Example:

```txt
mistake:
Agent changed shared UI while fixing SQLite Create Table.

new rule:
For db1hub.sqlite.create-table tasks, shared/ui is forbidden unless explicitly allowed.
```

## Controlled self-improvement

Allowed:

```txt
Agent proposes rule improvement.
System saves proposal.
Gate checks it.
User approves it.
Rule becomes active.
```

Not allowed:

```txt
Agent silently changes its own rules.
Agent silently expands permissions.
Agent disables gates to pass task.
```

## Main folders - current base

```txt
src/core/
  boot/
  state/
  safe/
  crash/
  bridge/
  policy/
  perm/
  bind/
  mf/
  cmp/
  update/
  rollback/
  checkpoint/
  log/
  sess/
  set/
  theme/
  i18n/
  patch/

src/shell/
  app-shell.svelte
  core-status.svelte
  safe-screen.svelte
  crash-screen.svelte
  cmp-host.svelte
  log-panel.svelte
  health-panel.svelte
  binding-panel.svelte

src/wf/
  rl/
  settings/

src/shared/
  err/
  result/
  fn/
  schema/
  ui/

cmp/
  welcome/
  explorer/
  editor/
  chat/
  terminal/
  settings/
  _template/

mf/
  active.json
  prev.json
  candidate.json
  verified.json

.ai/
  idx/
  golden/
  patch/
```

## Main folders - future foundation proposal

```txt
src/core/
src/shell/
src/shared/
  design/
  ui/
  icons/
  messages/
  hotkeys/
  input/
  log/
  result/
  perm/
  gate/
  policy/

apps/
  ai-agent-chat/
  explorer/
  db1hub/
  pdf-editor/
  code-editor/
  terminal/

.ai/
  idx/
  golden/
  patch/
  memory/
  rules/
  skills/
```

## Important scripts

```txt
pnpm install
pnpm gate
pnpm smoke
pnpm check
pnpm tauri dev
pnpm idx:build
pnpm cmp:new <component-id> [version]
```

Expected current gates:

```txt
gate:base
gate:arch
gate:ctx
gate:log
gate:mf
gate:policy
gate:bind
gate:patch
gate:cmp
```

Future gates:

```txt
gate:production-checklist
gate:ui-system
gate:subproject-contract
gate:versioned-blocks
gate:ai-agent-chat
gate:token-budget
gate:parallel-agent-runner
gate:error-memory
```

## Current validation checklist

Before freezing `v1-base`, test:

```txt
1. pnpm install
2. pnpm gate
3. pnpm smoke
4. pnpm check
5. pnpm tauri dev
6. Health -> Check / Repair / Reset MF
7. Theme switch + reload
8. Language switch + reload
9. Update -> Prepare / Verify / Activate
10. Rollback
11. Activate after Rollback must show safe error, not crash
12. App data -> Show must scroll
13. Break mf/active.json
14. Crash screen -> Reset MF -> Retry boot
15. App returns RUNNING
16. Settings tab saves theme/lang through Intent
17. Logs include binding/update/recovery events
```

## AI agent rules

AI executor is patch executor, not architect.

Always tell AI agent:

```txt
Do not redesign.
Do not add unrelated features.
Read .ai/idx first.
Read max 20-50 exact lines unless task explicitly requires more.
Use unified diff.
One patch fixes one issue.
Run gates.
Stop after patch.
```

Additional token rules:

```txt
Be concise.
Do not echo full code.
Use edit tools directly.
Read files in large chunks once.
Do not re-read files already in context.
Do not read README/docs unless task needs them.
Do not scan whole project.
Use exact scope and exact files.
```

Patch scope rule:

```txt
Every task must define:
- target Fractal App / block / service / file
- allowed files
- forbidden files
- gate to run
- rollback path
```

Example:

```txt
Task:
Fix db1hub.sqlite.create-table so datetime columns show only date templates.

Allowed:
apps/db1hub/blocks/sqlite-create-table/**
apps/db1hub/messages/**
apps/db1hub/tests/sqlite-create-table/**

Forbidden:
src/core/**
src/shared/ui/**
apps/pdf-editor/**
apps/explorer/**
```

## What to send in a new chat

Do not send whole project.

Send:

```txt
1. PROJECT-STATE-V-07.md
2. exact task or error
3. relevant diff
4. last 30 lines of logs/app.jsonl
5. 1-3 files only if needed
```

## Current priority

```txt
Verify v0.9 locally.
Fix only compile/runtime/base issues.
Freeze as v1-base.
```

Then:

```txt
1. block-production-checklist
2. block-ui-system
3. block-subproject-contract
4. block-versioned-blocks
5. fractal-app-ai-agent-chat
```

## Final guardrail

```txt
Do not build real Fractal Apps before foundation.
Do not build AI Agent Chat before UI system / subproject contract / versioned blocks.
Do not let AI agent invent UI, CSS, icons, messages, hotkeys, or patch scope.
Do not update the whole system when one block is broken.
```
