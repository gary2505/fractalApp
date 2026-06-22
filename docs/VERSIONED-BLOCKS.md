# Versioned Blocks

`block-versioned-blocks` defines how fractalApp updates the smallest safe unit instead of rewriting a whole app.

## Goal

```txt
Update only the broken block.
Do not update the whole fractalApp.
Do not update the whole Fractal App when one workflow is broken.
```

Example:

```txt
Broken: db1hub.sqlite.create-table
Patch:  db1hub.sqlite.create-table v0.3.2 -> v0.3.3
Not:    rewrite all DB1Hub
```

## What is a Versioned Block

A Versioned Block is a separately identifiable unit with:

```txt
id
version
owner Fractal App
entry file
permissions
dependencies
gates
rollback metadata
```

Use Versioned Blocks for:

```txt
workflow blocks
complex reusable components
shared UI components
services with public API
agent workflows
integration adapters
```

Usually do not version:

```txt
tiny private helpers
one-use local wrappers
CSS-only wrappers
small internal functions
```

## Rule

```txt
If other blocks depend on it, version it.
If it has public API, version it.
If it can be updated/rolled back separately, version it.
```

## Required Block Files

```txt
block.manifest.json
index.ts
README.md
gate.ts or tests/
```

Optional folders:

```txt
ui/
workflow/
service/
messages/
hotkeys/
tests/
```

## Agent Rule

Before editing any block, AI agent must identify:

```txt
canonical block id
current version
allowed files
forbidden files
gate to run
rollback path
```

No block patch can silently change Core, Shared UI, or another Fractal App.
