# Svelte runes

Rules:
- `$state` for local mutable state
- `$derived` for pure derived values only
- no state mutation inside `$derived`
- no state mutation inside template expression
- use `$effect` for side effects
- cleanup timers/listeners in effect cleanup

Avoid:
- duplicate source of truth
- derived values that write back
- component-local state fighting controller state
