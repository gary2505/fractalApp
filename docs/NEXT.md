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

- [ ] verify all gates pass clean
- [ ] verify smoke test passes
- [ ] verify tauri dev boots without errors
- [ ] verify all 6 components load in shell
- [ ] verify settings.apply intent round-trip
- [ ] verify manifest swap (active ↔ candidate)
- [ ] verify rollback from candidate → verified
- [ ] audit log IDs present for all core flows
- [ ] sign components (replace local-dev-signature)
- [ ] production CSP review
- [ ] bundle size check
- [ ] Windows/macOS/Linux smoke

After checklist passes, first real UI starts from:

```txt
pnpm cmp:new explorer-shell
```

## Archived (done)
