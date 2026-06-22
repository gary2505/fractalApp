# Fractal App Manifest

Status: `foundation`

## App manifest path

```txt
apps/<app-id>/app.manifest.json
```

## Required fields

```json
{
  "id": "ai-agent-chat",
  "name": "AI Agent Chat",
  "version": "0.1.0",
  "type": "fractal-app",
  "entry": "./index.ts",
  "stateFile": "./subproject-state.md",
  "permissions": [],
  "blocks": [],
  "messages": {
    "en": "./messages/messages.en.json",
    "ru": "./messages/messages.ru.json"
  },
  "hotkeys": {
    "en": "./hotkeys/hotkeys.en.json",
    "ru": "./hotkeys/hotkeys.ru.json"
  },
  "gates": [],
  "rollback": {
    "enabled": true,
    "previousVersion": null
  }
}
```

## Field rules

`id`

```txt
lowercase kebab-case
stable forever
rename requires migration
```

`version`

```txt
semver
stored only in manifest
not in folder or file names
```

`permissions`

```txt
explicit list
least privilege
must match Policy Engine allowlist
```

`blocks`

```txt
list of block manifest paths or block IDs
large workflows must be blocks
```

`messages`

```txt
EN/RU required
no hardcoded UI text in Fractal App components
```

`hotkeys`

```txt
EN/RU labels required
conflicts checked by shared hotkey registry
```

`rollback`

```txt
enabled for production blocks
previousVersion may be null for first version
```

## Block manifest path

```txt
apps/<app-id>/blocks/<block-folder>/block.manifest.json
```

## Block manifest example

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

## Validation checklist

```txt
id is stable
version is semver
permissions are explicit
entry exists
messages paths exist
hotkey paths exist
gates are listed
rollback policy exists
no direct native access declared
```
