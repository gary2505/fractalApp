# ZIP Manifest: block-versioned-blocks

This ZIP contains only new files for the `block-versioned-blocks` foundation step.

## Safe Install Rule

```txt
Do not overwrite existing files.
If any file already exists, stop and review conflict.
```

## Files

```txt
docs/VERSIONED-BLOCKS.md
docs/BLOCK-MANIFEST.md
docs/BLOCK-NAMING.md
docs/BLOCK-UPDATE-ROLLBACK.md
docs/BLOCK-GATES.md
docs/BLOCK-AI-PATCH-RULES.md
apps/_template/blocks/_template/**
.ai/gates/gate-versioned-blocks.mjs
```

## Not included

```txt
package.json changes
Core changes
real Fractal Apps
AI Chat features
DB1Hub/PDF/Explorer features
```

## Standalone Check

```txt
node .ai/gates/gate-versioned-blocks.mjs
```
