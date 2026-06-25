# Version Switcher Interaction Fix

Purpose: fix the simple version switcher using interaction proof.

Changed/new files:

```txt
src/App.svelte
src/main-window/versions.ts
src/main-window/start-v1-1.svelte
src/main-window/main-v1-2.svelte
VERSION-SWITCHER-INTERACTION-FIX-MANIFEST.md
```

Interaction contract:

```txt
1. Ctrl + Alt + Backspace opens switcher.
2. X closes switcher.
3. Esc closes switcher.
4. Switcher shows only main versions: v1-0, v1-1, v1-2.
5. Click v1-0 opens main-v1-0 and makes it default.
6. Click v1-1 opens main-v1-1 and makes it default.
7. Click v1-2 opens main-v1-2 and makes it default.
8. main-v1-2 shows only label v1-2.
```

Not checked:

```txt
pnpm check
pnpm tauri dev
```
