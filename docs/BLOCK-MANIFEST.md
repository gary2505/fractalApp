# Block Manifest

Each important block must have `block.manifest.json`.

## Minimal Schema

```json
{
  "id": "db1hub.sqlite.create-table",
  "name": "SQLite Create Table",
  "version": "0.3.2",
  "fractalApp": "db1hub",
  "type": "workflow-block",
  "entry": "./index.ts",
  "permissions": ["db.sqlite.schema.read"],
  "dependsOn": {
    "corebridge": "1.x",
    "ui-system": "1.x"
  },
  "gates": ["gate:db1hub:sqlite-create-table"],
  "rollback": {
    "enabled": true,
    "previousVersion": "0.3.1"
  }
}
```

## Required Fields

```txt
id
name
version
fractalApp
type
entry
permissions
dependsOn
gates
rollback
```

## Type Values

Allowed examples:

```txt
workflow-block
ui-block
service-block
agent-block
adapter-block
shared-block
```

## Version Rule

Use semantic versioning:

```txt
patch: bug fix, no public API change
minor: new compatible behavior
major: breaking public API change
```

## Dependency Rule

A block may depend on stable APIs only:

```txt
corebridge
ui-system
message-registry
hotkey-registry
icon-registry
allowed Fractal App services
```

A block must not depend on random files from another block.
