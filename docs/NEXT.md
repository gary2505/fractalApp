# Next

Current target: freeze `v0.9` as `v1-base` after local compile/runtime fixes.

Do next:

```txt
pnpm install
pnpm gate
pnpm smoke
pnpm tauri dev
```

Fix only:

```txt
compile errors
runtime boot errors
gate errors
manifest/component loading errors
```

Do not add yet:

```txt
real explorer
real editor
real AI chat
real terminal process
PDF/image tools
remote update server
```

After `v1-base`, first real UI should start from:

```txt
pnpm cmp:new explorer-shell
```
