# Next

Current target: **v1-base** (frozen, tagged 2026-06-21).

Next step: **block-production-checklist**

```txt
pnpm install
pnpm gate
pnpm smoke
pnpm tauri dev
```

## block-production-checklist

Full checklist: [`docs/BLOCK-PRODUCTION-CHECKLIST.md`](./BLOCK-PRODUCTION-CHECKLIST.md)

Quick gate: `pnpm gate:block`

Summary blocks:

- [ ] Security (CSP, iframe sandbox, secret scan, dependency audit)
- [ ] Permissions (policy engine, capability restrictions)
- [ ] IPC / CoreBridge boundaries (single entry point, postMessage protocol)
- [ ] Update Signing (hash verify, replace local-dev-signature)
- [ ] Rollback (prev→active restore, candidate clear)
- [ ] Logs (44 known IDs, JSONL format, no sensitive data)
- [ ] Crash Recovery (crash screen, safe mode, repair + reset)
- [ ] Accessibility (keyboard nav, ARIA, i18n, screen reader)
- [ ] Performance / Memory budgets (bundle ≤500KB, binary ≤50MB, idle ≤100MB)
- [ ] AI Patch Safety (patch rules, gates, agent constraints)
- [ ] Context / Token Rules (.ai/idx, 20-50 line chunks, one patch per issue)
- [ ] Release Checklist (cross-platform smoke, signing, CHANGELOG, git tag)

After checklist passes, first real UI starts from:

```txt
pnpm cmp:new explorer-shell
```

## Archived (done)
