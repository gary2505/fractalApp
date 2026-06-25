# Version Registry UI v1

Purpose: add a new version switchboard start window and a next main window version so launcher can move forward/back.

This ZIP is incremental and assumes the previous `main-window-versions` patch already works.

Changed/new files:

- `src/App.svelte`
- `src/main-window/versions.ts`
- `src/main-window/start-v1-1.svelte`
- `src/main-window/main-v1-1.svelte`

Behavior:

- `Ctrl + Alt + Backspace` now opens the latest start window: `start-v1-1`.
- `start-v1-1` lists both start windows and main windows.
- User can open latest start/main, update forward, rollback back, set default.
- `main-v1-0` remains the known working main version.
- `main-v1-1` is registered as the next candidate main version.
- Old working files should not be edited for future updates; add `start-v1-2`, `main-v1-2`, etc. and update registry.

Not checked here, by user request:

- `pnpm check`
- `pnpm tauri:dev`
