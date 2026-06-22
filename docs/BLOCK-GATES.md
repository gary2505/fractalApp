# Block Gates

Each Versioned Block must have a small gate.

## Gate Goal

```txt
Catch block-level errors without running the whole project every time.
```

## Gate Types

```txt
manifest gate
scope gate
type/check gate
test gate
message/i18n gate
hotkey gate
permission gate
```

## Fast Mode

During early foundation work:

```txt
Run targeted block gate per small patch.
Do not run cargo clean.
Do not run full rebuild after every file.
Run full validation once at block end or before freeze.
```

## Required Gate Checks

```txt
block.manifest.json exists
id matches folder/app rules
version exists
entry exists
gates list exists
rollback metadata exists
permissions are explicit
no TODO placeholders in public files
```

## Agent Output

After each block patch, agent reports:

```txt
changed files
block id
old version
new version
gate result
rollback path
```
