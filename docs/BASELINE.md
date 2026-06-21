# fractalApp baseline — v1-base (frozen)

This project has passed the base-project stop line and is now frozen as `v1-base`.

Tag: `v1-base` | Date: 2026-06-21 | Next: block-production-checklist

## Still not allowed

Do not build the real editor UI yet.
Do not build a full IDE yet.
Do not add PDF/image tools yet.
Do not add remote updater yet.

## Current baseline includes

- Tauri 2 + Svelte 5 + DaisyUI
- cross-platform app-data root
- settings, session, logs
- language switch: en, es, zh, ru, ja
- theme switch: light, dark, system
- Core state machine
- Safe and Crash screens
- manifest-driven components
- sandbox iframe host
- CoreBridge + Policy base
- local update and rollback proof
- health and recovery commands
- Fractal Binding proof
- Fractal Patch rules
- generated AI indexes
- basic gates

## v1-base frozen baseline includes

- All v0.8 additions (below)
- Component manifest maxCoreVersion bumped to 1.x
- Version tags aligned: package.json, Cargo.toml, tauri.conf.json all 1.0.0
- GitHub remote: https://github.com/gary2505/fractalApp.git

## v0.8 adds

- Settings component v1.0.1
- iframe-to-CoreBridge protocol
- settings.apply Intent
- Rust settings_apply_intent command
- StatePatch return from settings flow
- Core shell updates after component save
- settings workflow files

## Not included yet

- real file explorer
- real code editor
- real AI chat backend
- terminal process execution
- PDF/image tools
- remote update server
- production signing service
