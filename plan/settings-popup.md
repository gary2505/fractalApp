# Settings Popup v1

## Goal

Build first real vertical UI slice.

```txt
Settings Popup v1
```

## Read first

```txt
.ai/start.md
.ai/idx/map.md
.ai/skills/ui/popup.md
.ai/skills/ui/focus.md
.ai/skills/ui/snackbar.md
.ai/skills/svelte/runes.md
.ai/skills/system/use.md
.ai/skills/code/naming.md
.ai/skills/code/paths.md
.ai/skills/testing/small-check.md
```

## Scope

```txt
appearance
theme switch
language switch
save/cancel
snackbar
focus restore
Escape close
```

## Allowed

```txt
src/settings/*
src/shared/ui/* if existing component needs small extension
src/shared/messages/*
src/shared/design/*
src/system/input/* only for existing click/key helpers
```

## Forbidden

```txt
no AI Chat
no Explorer
no PDF
no DB1Hub
no real provider logic
no direct Tauri/Rust call from Web Component
no random CSS
no hardcoded user text
no long names
```

## Expected behavior

```txt
open from settings trigger
Escape closes
outside click closes if popup policy allows
focus returns to opener
Tab stays usable
theme change previews or stages clearly
language change works
Save persists
Cancel reverts staged changes
snackbar uses message key
```

## Tests

Small checks first:

```txt
pnpm check
```

Manual check:

```txt
open popup
press Escape
open again
change theme
Cancel
open again
change language
Save
reload app if session exists
check console has no errors
```

## Metrics

Check these:

```txt
hardcoded user text: 0 new warning/error labels
random local CSS colors: 0
new long names: 0
direct Tauri calls in UI: 0
full repo scan needed: no
```

## Done

```txt
all expected behavior works
small check passes or exact failure reported
no forbidden scope touched
```

## Rollback

```txt
remove src/settings changes
revert touched shared ui/message/design files
no Core rollback needed
```
