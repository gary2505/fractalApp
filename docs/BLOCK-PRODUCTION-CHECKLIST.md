# Block Production Checklist — fractalApp v1-base

> Frozen baseline verification before any real-feature work begins.
> Every block must pass before building the first real UI template.

---

## 1. Security

- [ ] **CSP audit** — `tauri.conf.json` CSP is strict: `default-src 'self'`, no `eval()`, no remote script hosts
- [ ] **No raw HTML injection** — all component HTML is compiled into `include_str!()` at Rust build time, no runtime HTML interpolation
- [ ] **iframe sandbox** — all components load in sandbox iframes; `cmp-host.svelte` enforces `postMessage`-only bridge (no direct DOM access to parent)
- [ ] **No eval in components** — grep all `cmp/**/index.html` for `eval(`, `Function(`, `innerHTML`; none present
- [ ] **CORS** — components cannot fetch external origins; CSP blocks it
- [ ] **Secret scanning** — no API keys, tokens, or secrets in committed source (pass `mcp_github_mcp_se_run_secret_scanning`)
- [ ] **Dependency audit** — `pnpm audit` returns 0 critical/high; `cargo audit` clean

## 2. Permissions

- [ ] **Tauri capability is minimal** — `capabilities/default.json` has only `core:default`, no `fs:allow-read`, `shell:open`, or `clipboard`
- [ ] **Component capabilities are declarative** — each component manifest lists only its needed commands (e.g., settings component has `settings_load`, `settings_save`, `settings_apply_intent`)
- [ ] **Policy engine blocks unauthorized commands** — `policy.ts` has:
  - Core commands: full set (init, settings, session, log, manifest, update, rollback, health, recovery)
  - Component commands: restricted subset (log, session, settings load/save)
  - Settings component exception: `settings_apply_intent`
- [ ] **No component can call update/rollback/health/recovery** — these are core-only commands
- [ ] **No component calls `@tauri-apps/api` directly** — enforced by `gate:arch` (grep check)

## 3. IPC / CoreBridge Boundaries

- [ ] **Single Tauri invoke entry point** — all Rust calls go through `bridgeInvoke()` in `src/core/bridge/bridge.ts`
- [ ] **No Tauri import outside bridge** — `gate:arch` passes (only `bridge.ts` imports `@tauri-apps/api`)
- [ ] **CoreBridge protocol** — components use `postMessage` with `{ source: 'fractal.component', type: 'bridge.request' }`, core replies with `{ source: 'fractal.core', type: 'bridge.response' }`
- [ ] **Policy check on every invoke** — `checkPolicy()` runs before every `invoke()` call in `bridgeInvoke`
- [ ] **Trace IDs on all bridge calls** — `makeTraceId()` generates unique trace IDs for Intent tracking
- [ ] **Error boundary** — all bridge errors caught and converted via `toError()` — no raw Rust panics reach UI
- [ ] **Type-safe commands** — `BridgeCommand` union type enforces all 19 valid command names

## 4. Update Signing

- [ ] **Hash verification** — every component read (`component_read`) compares SHA-256 hash against manifest; mismatch → error `CMP_HASH`
- [ ] **Signature field exists** — all component manifests have `signature` and `publicKeyId` fields (currently `local-dev-signature`)
- [ ] **Verify step blocks unsigned** — `update_verify_candidate` calls `verify_manifest_component()` before writing to `verified.json`
- [ ] **No switch without verify** — `update_switch_verified` requires `verified.json` to have a valid welcome component
- [ ] **PRODUCTION BLOCKER** — `local-dev-signature` must be replaced with real Ed25519/ECDSA signing before any real deployment
- [ ] **Key management plan** — document how signing keys are stored, rotated, and revoked

## 5. Rollback

- [ ] **Active → prev saved on switch** — `update_switch_verified` writes current `active.json` to `prev.json` before overwriting
- [ ] **Rollback restores prev** — `rollback_restore_prev` swaps `prev.json` → `active.json`, clears `candidate.json` and `verified.json`
- [ ] **Rollback refuses if no prev** — returns error `NO_PREV` when `prev.json` has no welcome component
- [ ] **Candidate cleared after rollback** — no stale candidate remains
- [ ] **Rollback is a core-only command** — policy blocks components from calling `rollback_restore_prev`
- [ ] **Rollback log audit** — `rollback.ok` / `rollback.err` log IDs are written

## 6. Logs

- [ ] **Known log ID enforcement** — Rust `log_write` rejects unknown log IDs (hardcoded `LOG_IDS` array, 44 IDs)
- [ ] **Log IDs match TS/Rust** — `src/core/log/log-ids.ts` and `src-tauri/src/core.rs` `LOG_IDS` are identical
- [ ] **Structured log format** — JSONL with: `time`, `id`, `level`, `traceId`, `workflowId`, `componentId`, `sessionId`, `msg`, `data`
- [ ] **Log file location** — `<app-data>/fractalApp/logs/app.jsonl`
- [ ] **Log read limit** — `log_read_last` caps at 200 rows, reads in reverse then re-reverses
- [ ] **All critical flows log** — boot, state transitions, manifest load/validate, bridge calls, policy decisions, component load, binding intents, update/rollback steps, health checks, recovery, AI patches all have log IDs
- [ ] **No sensitive data in logs** — audit that `data` field never contains passwords, tokens, or PII

## 7. Crash Recovery

- [ ] **Crash screen renders** — `CrashScreen.svelte` displays on `coreState === 'CRASH'`
- [ ] **Safe mode renders** — `SafeScreen.svelte` displays on `coreState === 'SAFE_MODE'`
- [ ] **State machine guard** — `canRecover()` returns true only for `ROLLBACK` and `SAFE_MODE` states
- [ ] **Recovery repair** — `recovery_repair` recreates missing directories, seed components, default settings/session, and empty log file
- [ ] **Recovery reset manifest** — `recovery_reset_manifest` rewrites all 4 manifest files (active, prev, candidate, verified) to safe defaults
- [ ] **Crash logs persist** — crash writes `core.boot.err` log before entering CRASH state
- [ ] **No data loss on repair** — repair only creates missing files, never overwrites existing ones

## 8. Accessibility

- [ ] **Keyboard navigation** — `shell-tabs.svelte` tabs are `<button>` elements, focusable and operable via Tab/Enter
- [ ] **ARIA labels** — tabs use `aria-label={$t('shell.tabs')}`
- [ ] **i18n coverage** — all UI strings go through `$t()`; locales exist for en, es, zh, ru, ja
- [ ] **Color contrast** — DaisyUI themes provide sufficient contrast in light and dark modes
- [ ] **Focus visible** — interactive elements have visible focus indicators (DaisyUI default)
- [ ] **Screen reader** — verify all shell panels announce their state changes (health status, crash message, etc.)
- [ ] **Keyboard shortcuts** — document if any exist; ensure no single-key shortcuts that could trap keyboard users

## 9. Performance / Memory Budgets

- [ ] **Component size budget** — each component HTML ≤ 50 KB uncompressed
- [ ] **Total frontend bundle** — `dist/` ≤ 500 KB (JS + CSS + assets, uncompressed)
- [ ] **Rust binary size** — `src-tauri/target/release/fractalApp` ≤ 50 MB
- [ ] **Memory baseline** — app idle ≤ 100 MB RAM (check after boot, before any component interaction)
- [ ] **No memory leaks** — verify no growth after 100x component reload cycles
- [ ] **Startup time** — cold boot ≤ 3 seconds to first paint
- [ ] **Log file rotation** — `app.jsonl` should not grow unbounded (currently no rotation — add before production)

## 10. AI Patch Safety

- [ ] **Patch rules enforced** — `.ai/patch/README.md` defines: one issue per patch, read `.ai/idx` first, unified diff only, no full-file rewrites, no unrelated files
- [ ] **Gate after every patch** — `pnpm gate` must pass before commit (enforced by `AGENTS.md` workflow: `Read .ai/idx first → Exact 20-50 line chunks → One patch fixes one issue → Run gates after patch`)
- [ ] **Agent constraints** — `AGENTS.md` defines: no monolith, no direct Tauri import outside bridge, no business logic in UI, all commands pass Policy Engine, all important actions write known log IDs
- [ ] **Component creation safety** — new components must start from `cmp/_template/1.0.0`, must prove `load → health.ready → CoreBridge → Intent → Policy → Patch → Audit` before manifest activation
- [ ] **No architectural drift** — `AGENTS.md` stop lines prevent: real explorer, real editor, real chat, terminal process, PDF/image tools, remote updater before v1-base checklist passes
- [ ] **Index freshness** — `pnpm idx:build` must be re-run after any file change (74 symbols tracked)

## 11. Context / Token Rules

- [ ] **Agent reads `.ai/idx` first** — every AI session starts with index lookup (`sym.json`, `log.json`, `term.json`, `wf.json`)
- [ ] **Read 20-50 line chunks only** — no full-file reads in patch workflow
- [ ] **Unified diff output** — patches are minimal, targeted
- [ ] **One patch per issue** — no bundling unrelated changes
- [ ] **No redesign** — agent rules say "You are a patch executor, not architect"
- [ ] **Golden rune log** — `.ai/golden/rl.jsonl` tracks known-good AI patch patterns
- [ ] **GitHub link stored** — `.ai/giHub-link.md` contains canonical repo URL

## 12. Release Checklist

- [ ] **Version alignment** — `package.json`, `Cargo.toml`, `tauri.conf.json` all report same version
- [ ] **All gates pass** — `pnpm gate` = idx:build + gate:base + gate:arch + gate:ctx + gate:log + gate:mf + gate:policy + gate:bind + gate:patch + check + test (0 errors)
- [ ] **svelte-check clean** — 0 errors, 0 warnings
- [ ] **vitest passes** — all tests pass (currently 5/5)
- [ ] **Smoke test** — `pnpm smoke` passes
- [ ] **Tauri dev boots** — `pnpm tauri dev` launches without errors
- [ ] **All 6 components load** — welcome, explorer, editor, chat, terminal, settings visible in shell tabs
- [ ] **Settings round-trip** — change theme/lang in settings component → save → verify core state updates
- [ ] **Manifest swap** — prepare candidate → verify → switch → confirm active.json updated
- [ ] **Rollback proof** — switch then rollback → confirm original active restored
- [ ] **Health panel** — all items show green "ok"
- [ ] **Crash recovery** — force crash state → verify crash screen → repair → verify recovery
- [ ] **Git tag** — annotated tag created (`git tag -a v1.x -m "..."`)
- [ ] **GitHub release** — release created with tag, release notes, and binary artifacts (when applicable)
- [ ] **Cross-platform smoke** — Windows, macOS, Linux all tested
- [ ] **CHANGELOG updated** — notable changes since last tag documented
- [ ] **No uncommitted changes** — `git status` clean

---

## Gate Script: `gate-block`

A minimal gate that verifies key invariants without a full build:

```bash
pnpm gate:arch     # no direct Tauri import outside bridge
pnpm gate:policy   # policy engine has correct command sets
pnpm gate:bind     # binding workflow files present
pnpm gate:patch    # patch rules documented
pnpm gate:log      # log IDs match between TS and Rust
```

Run: `pnpm gate:block` (add to `package.json` scripts).

## Status

| Block | Status | Notes |
|---|---|---|
| Security | ⬜ | CSP, iframe sandbox, no eval, secret scan needed |
| Permissions | ✅ | Policy engine and gate:arch verify |
| IPC / CoreBridge | ✅ | Single entry point, postMessage protocol |
| Update Signing | ⚠️ | local-dev-signature — needs real keys |
| Rollback | ✅ | prev → active swap proven |
| Logs | ✅ | 44 known log IDs, JSONL format |
| Crash Recovery | ✅ | Crash + Safe screens, repair + reset |
| Accessibility | ⬜ | Keyboard nav, ARIA labels present — screen reader test needed |
| Performance | ⬜ | Budgets defined but not measured |
| AI Patch Safety | ✅ | Rules and gates in place |
| Context / Token Rules | ✅ | `.ai/idx` and AGENTS.md enforced |
| Release Checklist | ⬜ | Cross-platform smoke, signing, CHANGELOG needed |
