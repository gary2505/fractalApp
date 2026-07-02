# Best Practices & Runes Rules (filesUp)

## Svelte 5 Runes
- Reactivity: `let x: Type = $state(initial)` — NOT `$state<Type>(...)`
- Derived: `$derived(expr)` or `$derived.by(() => { ... })` for multi-step
- Effects: `$effect(() => { ... })` — deps auto-tracked by reads
- Props: `let { ... } = $props()`, bindable via `$bindable()`
- Snippets: `children` from `$props()`, render with `{@render children()}`
- Events: `onclick=...` (NOT `on:click`)
- CRITICAL: Never write plain `let` inside `$effect` and read from `$derived` — variable must be `$state()` or `$derived()` to be reactive

## Dialog Pattern (MANDATORY: Global Host + Stores)
- Mount dialogs in Tab1Layout (top-level), NEVER inside panels
- Use Svelte stores for open/close control
- Panels call store functions, never direct refs

## Performance
- Index-based sorting, not item reordering
- .reverse() for ASC↔DESC toggle (O(N) vs O(N log N))
- Remove inline attributes, let CSS control sizing

## Existing Infra to Reuse
- GPS: Global Processing Service (sliding-window timeouts) — lib/system/GPS.ts
- safeInvoke: Safe IPC wrapper + CancelToken — lib/services/safeInvoke.ts
- CancelToken: Cooperative cancellation — lib/services/CancelToken.ts
- invokeWithId: Adds request_id to invoke — lib/system/async/invoke.ts
- warning-modals.ts: Centralized warning modals (use message-catalog.ts + i18n, not hardcoded text)

## Tauri
- Keep Rust #[tauri::command] small/typed
- Wrap calls in client module, handle errors explicitly

## Version evolution — don't drop features
- When creating a new version of a component (v1-3 → v1-4), diff the old version's imports, state vars, functions, and template side-by-side.
- `PanelResizer` + resizable widths (p1Width/p2Width/p4Width + resize handlers) are frequently dropped during rewrites — verify they're ported.
- Checklist for porting interactive UI: imports → state vars → handler functions → template wiring → resizer components between panels.
