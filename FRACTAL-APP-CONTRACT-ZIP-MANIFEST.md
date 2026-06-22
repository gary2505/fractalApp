# Fractal App Contract ZIP Manifest

ZIP: `fractalApp-block-fractal-app-contract-new-files.zip`

Contains only new files for `block-subproject-contract` / `Fractal App Contract`.

No existing project files should be overwritten.

## Files

```txt
docs/FRACTAL-APP-CONTRACT.md
docs/FRACTAL-APP-MANIFEST.md
docs/FRACTAL-APP-PERMISSIONS.md
docs/FRACTAL-APP-GATES.md
apps/_template/app.manifest.json
apps/_template/index.ts
apps/_template/subproject-state.md
apps/_template/blocks/_template-block/block.manifest.json
apps/_template/blocks/_template-block/index.ts
apps/_template/blocks/_template-block/gate.ts
apps/_template/blocks/_template-block/ui/template-block.svelte
apps/_template/messages/messages.en.json
apps/_template/messages/messages.ru.json
apps/_template/hotkeys/hotkeys.en.json
apps/_template/hotkeys/hotkeys.ru.json
apps/_template/tests/template-contract.test.md
apps/_template/tests/gate-notes.md
.ai/gates/gate-fractal-app-contract.mjs
```

## Install rule

If any file already exists, stop and report conflict.

## Optional check

```txt
node .ai/gates/gate-fractal-app-contract.mjs
```
