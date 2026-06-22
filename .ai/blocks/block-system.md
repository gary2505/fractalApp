# Block: system

Task: install `block-system` into fractalApp.

Rules:
- new files only
- do not overwrite silently
- no package.json changes
- no Core redesign
- no cargo clean

Before copy, check:
- `src/system`
- `.ai/blocks/block-system.md`

Adds:
- `src/system/async`
- `src/system/input`
- `src/system/runtime`
- `src/system/diag`

After copy:
- run smallest safe TypeScript check
- fix only local import errors inside this block

Next:
- Settings Popup v1
