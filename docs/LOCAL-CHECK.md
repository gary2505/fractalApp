# Local check

Run after unzip.

```bash
pnpm install
pnpm idx:build
pnpm gate:base
pnpm gate
pnpm tauri dev
```

Expected app-data root:

- Windows: `%APPDATA%/fractalApp`
- macOS: `~/Library/Application Support/fractalApp`
- Linux: `~/.local/share/fractalApp`

If app-data becomes broken, use Health panel:

1. Check
2. Repair
3. Reset MF
