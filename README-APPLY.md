# SmartLog v2 compact package

Copy these files into your local `fractalApp` repo, preserving paths.

Included real files only. No `.patch` files.

## Files

- `src-tauri/src/smart_log.rs`
- `src/core/log/smart-log-app-flow.ts`
- `src/App.svelte`

## Important

This ZIP does not include a full replacement `src-tauri/src/core.rs` because I could not safely fetch the exact full latest 35 KB file into the sandbox as a writable artifact. Do not overwrite your local `core.rs` with a partial file.

After copying these files, make these three tiny local edits in your existing `src-tauri/src/core.rs` to stop legacy noisy `app.jsonl` writes:

1. In `init_app()`, remove this line:

```rust
write_known_log("core.boot.ok", "info", "app data initialized")?;
```

2. In `app_data_status()`, remove this line:

```rust
write_known_log("appdata.status.ok", "debug", "app data status read")?;
```

3. In `health_check()`, replace this:

```rust
let log_id = if report.ok { "health.check.ok" } else { "health.check.err" };
write_known_log(log_id, if report.ok { "info" } else { "warn" }, "health check completed")?;
```

with this:

```rust
if !report.ok {
    write_known_log("health.check.err", "warn", "health check completed")?;
}
```

## Test

```bash
pnpm check
cd src-tauri && cargo check
```

Start app once. Target `logs/app-run.jsonl`:

```json
["H",2,"...","fractalApp","main-v1-4","dev",["ms","ev","v"],{...}]
[42,"boot"]
["END",8122]
```

No huge `app.jsonl` should be pasted to AI. Use compact run/error files only.
