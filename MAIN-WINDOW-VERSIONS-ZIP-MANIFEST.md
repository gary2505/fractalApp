# Main Window Versions v1

Purpose: add a tiny stable top-level App shell, move current UI into `main-v1-0`, and add `start-v1-0` recovery launcher opened by `Ctrl+Alt+Backspace`.

Changed files:

- `src/App.svelte`
- `src/main-window/versions.ts`
- `src/main-window/main-v1-0.svelte`
- `src/main-window/start-v1-0.svelte`

Behavior:

- Current app UI is preserved as `main-v1-0`.
- `App.svelte` becomes a small boot/start shell.
- `Ctrl+Alt+Backspace` opens the recovery launcher.
- Launcher can open latest, open `main-v1-0`, set default, and later move forward/back when new versions are added.
- Start window is versioned too: future launcher changes should create `start-v1-1` or `start-v1-2`, not edit `start-v1-0`.

Not checked here:

- `pnpm check`
- `pnpm tauri:dev`
