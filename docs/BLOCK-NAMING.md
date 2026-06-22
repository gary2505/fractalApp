# Block Naming

Use short, stable names that are clear for AI and humans.

## Three Names

Every Versioned Block has:

```txt
canonical id
folder name
component/export name
```

Example:

```txt
canonical id: db1hub.sqlite.create-table
folder:       sqlite-create-table
export:       SqliteCreateTableBlock
```

## Good Names

```txt
db1hub.sqlite.create-table
db1hub.mssql.create-index
pdf.thumbnail-rail
pdf.highlight-tool
explorer.file-list
ai-chat.token-budget
ui.modal
```

## Bad Names

```txt
ctb
block3
final-table
table-v2-new
better-ui
super-component
```

## Rules

```txt
Canonical ID: 3-4 parts max
Folder name: 2-4 words max
Export name: clear PascalCase
No random abbreviations
No version in file name
Version lives in manifest only
Rename = migration
```

AI agent must search by canonical id before editing.
