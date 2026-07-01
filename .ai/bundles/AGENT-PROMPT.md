# filesUp AI Agent Prompt
Silent mode: fix only. Zero narration. Reply "done".
## ROLE

You are a Solo AI Coding Agent working inside VS Code on this machine. This repository is called `filesUp`.
Only YOU create and edit code here. I do NOT touch code manually, I only run commands and describe bugs.

## Output / behavior
- Be concise. Action only. No reasoning.
- Default to code edits only.
- Do not create docs, approval notes, or sign-off files unless explicitly asked.
- Do not run tests / build / check unless explicitly asked.
- Do not use regex/global replace.
- After edits, reply only: `done`.

## Session start
1. Use `.ai/bundles/llog.md` for current-session logs only; it is truncated on app restart.
2. If project was restored from backup, recover in this order:
   - `pnpm install`
   - `cd src-tauri && cargo check`
   - `pnpm run dev`
   - `pnpm run tauri:dev`
3. If asked “what happened?”, answer: read the latest bundle first.

## Project facts
- Repo: `filesUp`
- Product names: `FilesUP`, `filesUp`
- Stack: Tauri 2 + Svelte 5 (Runes) + TailwindCSS + DaisyUI
- Tooling: `pnpm` only; desktop only (no SSR / no PWA)
- Extension constant: `FILESUP_PROJECT_EXTENSION = 'flsup'`
- Kind checks: `kind === 'flsup'`
- Paths: `.flsup`, `photo.jpg.flsup`
- Backup path: `.filesUp-tmp/draw/{name}.flsup`
- Temp folder: `.filesUp-tmp`
- Store path: 
- Windows: `%APPDATA%\\filesup\\`
- Linux/macOS: `~/.config/filesup/`
Example Windows store path must be like this:
"C:\Users\va250\AppData\Roaming\filesUP\settings.json"


## UI map
- Main layout: Tabs → TopNav → P0 sidebar → P1 folder tree → P2 main workspace → P23 action panel → P3 tree/preview toggle → P4 preview toolbar → status bar
- Key files:
  - `src/lib/layout/AppLayout.svelte`
  - `src/lib/features/navbars/top-nav-bar.svelte`
  - `src/lib/features/sidepanel/side-panel.svelte`
  - `src/lib/P1/MyPCPanel.svelte`
  - `src/lib/P2/FolderTreePanel.svelte`
  - `src/lib/features/panels/p23-action-panel.svelte`
  - `src/lib/P3/FolderTreePanel.svelte`
- Session state uses write-through cache: first load reads once, cache stays hot.

## TaskFlow / QA  (do not use now)
- TaskFlow roots: `src/taskflow/tasks/`, `src/taskflow/flows/`, `src/taskflow/contracts/`, `src/taskflow/core/`
- All flows must use `runFlowWithContracts()`.
- All flows must add readable `ctx.addEvent(...)` checkpoints.
- All flows must add at least one `ctx.addContract(...)`.
- Contract shape: `{ input, expected, got, ok }`
- `ok === false` must fail the flow, write FAIL status, and make QA non-zero.
- Frontend boot entry: `src/taskflow/flows/bootFlow.ts`
- Canonical runtime files:
  - `src/taskflow/core/runtime.ts`
  - `src/taskflow/core/trace.ts`
  - `src/taskflow/core/debugBundle.ts`

## Llogging

- Canonical files:
  - `.ai/bundles/llog.md`
`Agent-llog-format-guide.md`.- `llog` format:
  - `<t_ms>|<component>|<event>|<path>|<note>`
- Use short, stable uppercase codes.
- Log meaningful checkpoints only: start / finish / fail / lock / retry / guard.
- Temporary logs use `T:<id>`.
- Monitor logs use `M:<id>` and stay commented out by default.
- Frontend call: `llog(component, event, context?, note?)`
- Rust call: `debug_bundle::log_event(component, event, context?, note?)`
- Follow the helper-block + one-line call-site rule from
- Regex-delete all // `T:<id>` call sites.

## Editing rules

- Only the agent edits code; assume no human code edits.
- Keep patches small and scoped.
- Prefer small focused files over god files.
- Target `<250` lines per file when practical.
- Keep UI thin; move behavior into flows / tasks / contracts / helpers.
- Keep headers truthful after edits.
- Reuse existing infrastructure before inventing new code:
  - `lib/system/GPS.ts`
  - `lib/services/safeInvoke.ts`
  - `lib/services/CancelToken.ts`
  - `lib/system/async/invoke.ts`
  - `lib/features/ui/warning-modals.ts`
- Remove inline sizing when possible; let CSS own sizing.
- Keep Rust `#[tauri::command]` small and typed; wrap calls in client modules and handle errors explicitly.

## Required comments
- Every `*.ts` / `*.svelte` file must start with a short truthful header comment with:
  - `FILE`
  - `USED BY`
  - `PURPOSE`
  - `TRIGGER`
  - `EVENT FLOW`
  - `FUNCTIONS`
  - `CRITICAL`
- Every non-trivial function needs a short doc comment:
  - What
  - Why
  - Input
  - Output
  - Side effects
- Every critical changed block must include:
  - `// 🔍 SEARCH: "keyword" - purpose`
  - `// Intent: constraint + decision + side effect`
- Use strong keywords such as:
  - `selection state`
  - `history commit`
  - `popup close guard`
  - `hit test order`
  - `keyboard shortcuts`
  - `folder scan`

## Change timestamps — searchable edit trail

Every block the agent adds or modifies **must** include a timestamp tag on the same line as (or directly above) the `// 🔍 SEARCH:` comment.

### Tag format
```
// 🕐 CHANGED: YYYY-MM-DD HH:MM — <one-line reason>
```
- Date/time is UTC, `YYYY-MM-DD HH:MM` (minutes only, no seconds).
- Reason is one short phrase — what was changed and why (no full sentences).
- Always paired with the nearest `// 🔍 SEARCH:` comment.

### Example (TypeScript / Svelte)
```ts
// 🕐 CHANGED: 2026-06-03 14:30 — fix double-load guard in openPdf
// 🔍 SEARCH: "pdf-v2 same-path guard" - skip duplicate load on remount
// Intent: _modLoadingPath never cleared after load; forceReloadPdf() resets it explicitly
if (_modLoadingPath === path) return;
```

### Example (Rust)
```rust
// 🕐 CHANGED: 2026-06-03 14:31 — add read_file_bytes for IPC binary read
// 🔍 SEARCH: "read_file_bytes" - read whole file, return base64 for IPC transport
#[tauri::command]
pub async fn read_file_bytes(path: String) -> Result<String, String> {
```

### How to find recent changes
- **Last hour:** `grep -r "CHANGED: 2026-06-03 1[4-5]:" src/`
- **Last day:** `grep -r "CHANGED: 2026-06-03" src/ src-tauri/`
- **By keyword:** `grep -r "CHANGED:" src/ | grep "pdf-v2"`
- **In VS Code Search:** search `🕐 CHANGED: 2026-06-03` across workspace with `files to include: src/**,src-tauri/**`

### Rules
- One `🕐 CHANGED:` tag per logical change block (not per line).
- When editing an existing tagged block, **update** the existing timestamp — do not stack duplicate tags.
- When a block has no tag yet, add one on first edit.
- File-level header comments (`FILE / USED BY / PURPOSE`) do **not** need the tag.

## Naming / imports
- Folders: lowercase only.
- Files: kebab-case only, one dot before extension.
- Types / interfaces: PascalCase.
- Functions / variables: camelCase.
- Constants: UPPER_SNAKE_CASE.
- Prefer barrel imports from `index.ts` when available.
- If an import breaks, fix in this order:
  1. Normalize to kebab-case.
  2. Apply known rename map.
  3. Prefer barrel import.
  4. Update re-exports if needed.
- Known rename map:
  - `shared/validate/folder-name-validation.ts` → `shared/validate/naming/validate-folder-name.ts`
  - `shared/validate/name-policy.ts` → `shared/validate/naming/policy.ts`
  - `shared/validate/pinned-validation.ts` → `shared/validate/pinning/validate-pinned.ts`
- Do not create files directly in `shared/validate/` root; use named subfolders.
- Treat typo paths as invalid, e.g. `body-croll-lock.ts` → `body-scroll-lock.ts`.

## User-facing text / i18n
- Never hardcode final user-facing errors or warnings.
- Use `src/lib/shared/ui/message-catalog.ts`.
- Add keys to `src/lib/features/languages/en.json` and mirror locales when possible.
- Use stable keys:
  - `errors.<domain>.<action>_failed`
  - `warnings.<domain>.<event>`
- Normalize technical errors before showing UI text.
- When adding a new warning case, update `README/Warnies-list.md`.
- `warning-modals.ts` should use catalog/i18n keys, not hardcoded English text.

## Svelte 5 / Runes best practice
- State: `let x: Type = $state(initial)`
- Derived: `$derived(...)` / `$derived.by(...)`
- Effects: `$effect(...)` for side effects only
- Props: `let { ... } = $props()`
- Bindable props: `$bindable()`
- Snippets: `{@render children()}`
- Events: `onclick=...` (not `on:click`)
- If a value is read by the template or by `$derived`, it must be `$state()` or `$derived()` — never plain `let`.
- Never write plain `let` inside `$effect` and then read it from `$derived`.
- Never read and write the same reactive state in one `$effect`.
- All reactive setter paths must be idempotent: `if (current === next) return;`
- Use `untrack(...)` only as a rare escape hatch.
- If you see `effect_update_depth_exceeded` / `Maximum update depth exceeded`, inspect effect read/write cycles first.
- Known hot files for loop bugs:
  - `src/lib/P3/Preview/P3-preview.svelte`
  - `src/lib/P3/Preview/drawing/style-popup.svelte`
  - `src/lib/P3/Preview/drawing/drawing-canvas.svelte`
  - `src/lib/P3/Preview/drawing/drawing-controller.svelte.ts`

## Dialog pattern
- All dialogs use Global Host + Stores.
- Mount dialogs at top level in `Tab1Layout`.
- Panels call store helpers; never use panel-scoped dialog refs.
- Do not keep dialogs trapped inside panel stacking contexts.

## Performance / UI rules
- Use index-based sorting, not full item reordering.
- Prefer `.reverse()` for ASC ↔ DESC toggle when possible.
- For hot paths, guard + microtask / rAF scheduling; avoid direct re-entrant ticks.
- Size system:
  - rows: `32 / 36 / 52 / 64`
  - icons: `16 / 20 / 24 / 32`
  - fonts: `10 / 12 / 14 / 16`
  - thumbnails only for `M+`

## Drawing rules
- Jitter thresholds use fixed screen px, not normalized deltas.
- Convert to doc space only for min-size checks: `docPxThreshold = screenPxThreshold / zoomScale`
- Preserve selection-first behavior.
- Keep tiny-line suppression in both move and commit paths.
- Keep geometry-edit handle activation out of single-click selection path.
- Hotkeys:
  - `Ctrl/Cmd` = command
  - `Shift` = add / constrain
  - `Alt` = alternate / subtract
  - `Shift+Alt` = intersect / advanced selection
  - `Ctrl/Cmd+Shift` = stronger command variant
  - `Tab` = focus / UI only

## Commands
- `pnpm install`
- `cd src-tauri && cargo check`
- `pnpm run dev` → Vite dev server
- `pnpm run tauri:dev` → desktop app
- `pnpm run build`
- `pnpm run check`
- `pnpm run qa`
- `pnpm run lint`
- `pnpm run test:contracts`

## Always remember
- Read the latest bundle first.
- Keep code searchable.
- Leave a clear trail.
- Do not break `flsup` handling.

## Now working  on scrolling  huge folder with 200,000 items

 200,000-item folder — by the numbers
Stage	What happens	Items
IPC call #1	Rust returns first page	256
DOM rows rendered	VirtualListHost visible window	≤ 120
JS nodes in memory (max)	Frontend cache ceiling	2,048
Rust cache (backend)	Active folder LRU	8,192
Scroll trigger fires	When lastVisible >= loadedCount - 96	fetch next 256
IPC call #2	Items 257–512 appended	256
Eviction fires	When in-memory exceeds 2,048	drop oldest 256
Total IPC calls to see all 200K	200,000 ÷ 256	~782 lazy fetches
Thumb position source	firstVisibleIndex / 200,000	exact, no jump
Caption	"120 of 200,000"	real backend total
renderKey resets	Only on new path / sort / rename	0 resets on scroll
First paint: 256 IPC rows → 120 DOM nodes → user sees file list in ~150ms.
Memory ceiling: never exceeds 2,048 nodes in JS regardless of folder size.
Scroll: continuous, no jump, thumb ratio always scrollTop / (200,000 × 36px).

## Settings rules

Persisted settings file locations:
- Windows: `%APPDATA%\\filesup\\settings.json`
- Linux/macOS: `~/.config/filesup/settings.json`
Windows store path must be like this:
"C:\Users\va250\AppData\Roaming\filesUP\settings.json"

## Hard rules

1. Never use `localStorage` for app settings/state.
2. Never use `localStorage.clear()` for reset logic.
3. All persisted settings must go through `src/lib/features/settings/settings.ts`.
4. Rust `src-tauri/src/settings.rs` is the disk-backed source of truth.
5. If a value must survive restart, it must be stored in canonical settings.
6. Only truly ephemeral runtime-only values may stay out of settings — use Svelte `$state` only.
7. Hidden internal UI-state keys must still live in canonical settings, using hidden entries in `settings_group.json`.
8. When editing important logic blocks, leave:
   - `// 🔍 SEARCH:`
   - `// CRITICAL for next agent:`
   
## Best dev rule
Never update $state inside:
- $derived(...)
- $derived.by(...)
- $inspect(...)
- template expressions
- functions called during rendering

Only update $state inside:
- event handlers
- explicit callbacks
- lifecycle/effect code when really needed

Good pattern:
function enterEditMode(preset: PdfPreset) {
  draftPreset = structuredClone(preset);
  editMode = true;
}
## TAb1 layout
src\lib\layout\tabs\Tab1Layout.svelte
Panel	CSS	Default width	Min	Max
P0 (Sidebar)	flex: 0 0 3%	3%	50px	80px
P1 (MyPC)	flex: 0 0 16%	16%	140px	240px
P2 (Folder Tree)	flex: 1 1 0%	equal share	300px	—
P23 (Actions)	flex: 0 0 7%	7%	80px	120px
P3 (File View)	flex: 1 1 0%	equal share	300px	—
P4 (ToolBar)	flex: 0 0 auto; width: 50px	50px	50px	80px