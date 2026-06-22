# PROJECT-STATE-06-21

Project: `fractalApp`  
Date: `2026-06-21`  
Current goal: build and freeze a `Core-Web-Fractal Architecture Base App`, then develop future UI/features as small logical blocks.

## Current target

```txt
v1-base = architecture proof project
not final UI
not full IDE
not PDF editor yet
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
+ Isolated versioned Svelte Web Components
+ Fractal verified workflows
+ Fractal Binding
+ Fractal Patch
+ Optional native extensions later
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

Do not add new foundation systems until v1-base is stable.

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
real file explorer
real terminal
real AI chat
real code editor
remote updates
native extensions
large UI polish
new architecture redesign
```

## Main folders

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

Expected gates:

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

## Current validation checklist

Before freezing v1-base, test:

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

## Next work mode

Use small logical blocks, not large bricks.

Good block size:

```txt
1 workflow
1 component
1 service
1 gate
1 fix-pack
```

Example future blocks:

```txt
block-settings-ui
block-explorer-shell
block-file-virtualization
block-pdf-viewer
block-ai-chat
```

## Next planned phase after v1-base

First real UI block should be:

```txt
block-explorer-shell
```

But only after base compile/runtime is stable.

Recommended order:

```txt
1. Freeze v1-base
2. Push to GitHub
3. Start new chat with this PROJECT-STATE file
4. Work by blocks
5. For each block: plan -> patch -> gate -> test -> update PROJECT-STATE
```

## AI agent rules

AI executor is patch executor, not architect.

Always tell AI agent:

```txt
Do not redesign.
Do not add unrelated features.
Read .ai/idx first.
Read max 20-50 exact lines.
Use unified diff.
One patch fixes one issue.
Run gates.
Stop after patch.
```

## What to send in a new chat

Do not send whole project.

Send:

```txt
1. PROJECT-STATE-06-21.md
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
