# Fractal App Permissions

Status: `foundation`

## Goal

Fractal Apps must not access native power directly.
All native access goes through:

```txt
Component iframe
-> CoreBridge
-> Policy Engine
-> Core command
-> Rust command
-> Result
```

## Principle

```txt
least privilege
explicit permissions
no silent permission expansion
no direct Tauri/Rust/filesystem access
```

## Permission naming

Use short stable names:

```txt
fs.read
fs.write
app-data.read
app-data.write
dialog.open
dialog.save
settings.read
settings.write
log.write
session.read
session.write
update.prepare
update.activate
rollback.run
db.sqlite.schema.read
db.sqlite.schema.write
pdf.page.read
pdf.annotation.write
```

## Permission ownership

Fractal App manifest declares high-level app permissions.
Block manifest declares block-specific permissions.
Policy Engine grants only intersection of app + block + user/session policy.

## Forbidden by default

```txt
core.*
policy.*
manifest.write
rollback.write
update.remote
fs.write-all
fs.read-all
process.spawn
network.raw
native.dialog.unscoped
```

## Allow examples

Explorer file list:

```json
[
  "fs.read",
  "dialog.open",
  "session.write"
]
```

AI Agent Chat patch planner:

```json
[
  "app-data.read",
  "app-data.write",
  "log.write"
]
```

DB1Hub SQLite create table:

```json
[
  "db.sqlite.schema.read",
  "db.sqlite.schema.write",
  "log.write"
]
```

## Deny examples

A PDF thumbnail block must not request:

```txt
fs.write-all
core.manifest.write
rollback.run
```

A DB create-table block must not request:

```txt
src/shared/ui write access
apps/pdf-editor write access
```

## AI patch safety

Every patch task must include:

```txt
allowed files
forbidden files
permissions needed
gate to run
rollback path
```

If the task needs more permissions, agent must stop and ask for approval.

Agent must not silently:

```txt
expand permissions
disable gates
modify policy engine
edit CoreBridge contract
change shared UI from feature task
```
