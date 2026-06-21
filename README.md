# fractalApp

Production-first baseline for a small Core-Web-Fractal desktop app.

Version: `1.0.0` — **v1-base** (frozen baseline)

Tag: `v1-base` — verified build, no feature additions. Next step: block-production-checklist.

Stack:

```txt
Tauri 2
Svelte 5
Vite
Tailwind CSS 4
DaisyUI 5
pnpm
```

## Run

```bash
pnpm install
pnpm tauri dev
```

or:

```bash
pnpm dev
```

## Local check

```bash
pnpm idx:build
pnpm gate:base
pnpm smoke
pnpm gate
```

`pnpm gate` also runs `svelte-check` and tests.

## App data

The Rust core uses the OS app-data folder and creates real files under:

```txt
<data-dir>/fractalApp/
  logs/app.jsonl
  set/settings.json
  sess/session.json
  mf/active.json
  mf/prev.json
  mf/candidate.json
  mf/verified.json
  cmp/welcome/1.0.0/index.html
  cmp/welcome/1.0.1/index.html
  cmp/explorer/1.0.0/index.html
  cmp/editor/1.0.0/index.html
  cmp/chat/1.0.0/index.html
  cmp/terminal/1.0.0/index.html
  cmp/settings/1.0.0/index.html
  cmp/settings/1.0.1/index.html
```

Examples:

```txt
Windows: %APPDATA%/fractalApp
macOS: ~/Library/Application Support/fractalApp
Linux: ~/.local/share/fractalApp or XDG_DATA_HOME/fractalApp
```

## v0.8 UI template phase

This version starts the first UI template after base architecture.

Added in v0.8:

```txt
Settings component v1.0.1
iframe-to-CoreBridge request/response protocol
settings.apply Intent
settings_apply_intent Rust command
StatePatch result for theme/language changes
Core shell updates after component settings save
settings workflow files under src/wf/settings
gate:bind checks the settings template path
```

Baseline included:

```txt
Core boot shell
Core state machine
Safe / Crash screens with recovery actions
CoreBridge + Policy Engine
real app-data storage
real settings/session/log files
language switch: English / Spanish / Chinese / Russian / Japanese
theme switch: light / dark / system
manifest-driven components
sandbox iframe component host
Welcome / Explorer / Editor / Chat / Terminal / Settings component shells
local update / rollback proof
health / recovery commands
Fractal Binding proof
Fractal Patch rules
generated AI indexes
baseline gates
```

Not included yet:

```txt
real file explorer
real code editor
real AI chat backend
real terminal process execution
PDF/image tools
remote update server
production signing service
final UI polish
```

## Local update proof

```txt
Prepare  -> writes cmp/welcome/1.0.1 and mf/candidate.json
Verify   -> checks hash, local signature placeholder, health marker, writes verified.json
Activate -> moves active.json to prev.json and verified.json to active.json
Rollback -> restores prev.json to active.json and clears pending candidate/verified
```

No remote server is used yet. The binary is not updated.

## Health / recovery proof

```txt
Check     -> validates app-data, JSON files, manifests, and component hashes
Repair    -> recreates missing dirs/files/components without deleting user data
Reset MF  -> recreates active.json from bundled component seeds and clears candidate/verified
```

## v0.7 fix pack

Fixed from first real test:

```txt
Rollback clears stale candidate/verified manifests
Activate without verified candidate returns clear NO_VERIFIED error
App-data panel is scrollable
Crash screen has Repair / Reset MF / Retry boot actions
```

## Current rule

Do not build the real editor yet. The next goal is UI Template v1 stability.

Test this first:

```txt
1. open Settings tab
2. change theme/language inside iframe component
3. click Save through Intent
4. Core shell theme/language updates
5. reload app and confirm settings survive
6. check logs for bind.intent.recv / bind.patch.ok / bind.audit.ok
```

See:

```txt
docs/BASELINE.md
docs/LOCAL-CHECK.md
docs/NEXT.md
```

## v0.9 Component SDK / Template Kit

Added in v0.9:

```txt
cmp/_template/1.0.0
src/core/cmp/sdk
src/shared/schema/component.schema.ts
src/shared/schema/intent.schema.ts
src/shared/schema/patch.schema.ts
scripts/cmp-new.mjs
docs/COMPONENT-TEMPLATE.md
pnpm cmp:new <component-id> [version]
pnpm gate:cmp
```

This phase makes future UI components repeatable.
It does not add real Explorer/Editor/PDF features yet.

Create a component:

```bash
pnpm cmp:new explorer-panel
```

Then add it to `mf/active.json` only after health and bridge proof pass.
