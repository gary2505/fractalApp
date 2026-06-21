# Component Template Kit

Goal: create future UI components without changing Core architecture.

Use:

```bash
pnpm cmp:new explorer-panel
```

This creates:

```txt
cmp/explorer-panel/1.0.0/index.html
cmp/explorer-panel/1.0.0/manifest.json
```

## Required component rules

```txt
component loads in sandbox iframe
component uses postMessage only
component never imports @tauri-apps/api
component has manifest.json
component has health.ready marker
component declares capabilities
component actions create Intent
state changes happen through Core workflow
```

## Template flow

```txt
UI event
-> make Intent
-> CoreBridge v1 postMessage
-> Policy Engine
-> workflow command
-> State Patch
-> Audit log
```

## Files

```txt
cmp/_template/1.0.0/
src/core/cmp/sdk/
src/shared/schema/component.schema.ts
scripts/cmp-new.mjs
```

## Stop line

Do not build real feature logic inside a new component first.
First prove:

```txt
load
health
bridge
intent
patch
audit
```
