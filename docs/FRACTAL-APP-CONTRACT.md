# Fractal App Contract

Status: `foundation`
Block: `block-subproject-contract`
Preferred name: `Fractal App Contract`

## Goal

Define how every Fractal App is created, isolated, versioned, tested, updated, and rolled back.

A Fractal App is a product subsystem such as:

```txt
ai-agent-chat
explorer
db1hub
pdf-editor
code-editor
terminal
```

This contract prevents agents from inventing structure, permissions, UI, messages, icons, hotkeys, and gates per feature.

## Core rule

```txt
Fractal App Component
-> CoreBridge
-> Policy
-> Allowed Service
-> Result
```

Fractal Apps must not call Tauri, Rust, filesystem, app-data, native dialogs, global settings, or update/rollback logic directly.

## Required files

Each Fractal App must include:

```txt
apps/<app-id>/
  app.manifest.json
  subproject-state.md
  blocks/
  messages/
  hotkeys/
  tests/
```

Optional later:

```txt
  icons/
  workflows/
  services/
  docs/
  gates/
```

## Required ownership

Each Fractal App owns:

```txt
manifest
state file
workflow blocks
messages
hotkeys
tests
gates
docs
```

Each Fractal App shares:

```txt
CoreBridge
Policy Engine
Shared UI
Design tokens
Message registry
Hotkey registry
Icon registry
Result/Error format
Logging
Fractal Patch rules
```

## Forbidden direct access

Fractal Apps must not directly:

```txt
call Tauri/Rust
read filesystem
write filesystem
read/write app-data
open native dialogs
change global settings
change Core manifest
change rollback files
change other Fractal Apps
change shared/ui unless explicitly allowed
```

## Patch scope rule

Every AI task must define:

```txt
target Fractal App
target block/service/file
allowed files
forbidden files
gate to run
rollback path
```

## Naming

Use three names:

```txt
Canonical ID: ai-agent-chat.context-gate
Folder name: context-gate
Component name: ContextGateBlock
```

Rules:

```txt
canonical id: 3-4 parts max
folder name: 2-4 words max
component: clear PascalCase
no random abbreviations
no final/new/v2 in source file names
version lives in manifest
rename = migration
```

## Versioning

Fractal App version is stored in `app.manifest.json`.
Important blocks store their own version in `block.manifest.json`.

Update only the smallest broken unit.

Bad:

```txt
update whole db1hub
update whole fractalApp
```

Good:

```txt
update db1hub.sqlite.create-table 0.3.2 -> 0.3.3
```

## UI rules

Every Fractal App must use Shared UI foundation:

```txt
src/shared/ui
src/shared/design
src/shared/icons
src/shared/messages
src/shared/hotkeys
src/shared/input
```

No feature-local custom popup, modal, snackbar, icon system, hotkey system, message hardcoding, or random CSS.

## Gate rule

A Fractal App is not accepted unless:

```txt
manifest is valid
permissions are declared
messages exist EN/RU
hotkeys are registered or explicitly empty
gates are listed
native access goes through CoreBridge contract
patch scope is clear
```

## Fast iteration rule

During foundation build:

```txt
run targeted checks only
no repeated cargo clean
no full rebuild after every small patch
full validation once at block end
```
