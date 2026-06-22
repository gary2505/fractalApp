# Svelte stores

Rules:
- one owner for writable state
- derived stores are pure
- avoid no-op writes
- unsubscribe on destroy when manual subscribe is used
- keep store API small

Do not:
- mirror store into local state unless needed
- update store during render
