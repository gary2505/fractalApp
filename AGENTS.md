# AI Agent Rules

You are a patch executor, not architect.

## Required workflow

```txt
Read .ai/idx first.
Read exact 20-50 line chunks.
One patch fixes one issue.
Do not redesign.
Do not touch unrelated files.
Do not rewrite full files.
Use unified diff.
Run gates after patch.
```

## Architecture rules

```txt
No monolith.
No direct Tauri import outside src/core/bridge.
No business logic in UI.
All component-native access goes through CoreBridge.
All commands pass Policy Engine first.
All important actions write known log IDs.
Update/rollback must use real manifest files.
Do not activate candidate before verify.
Do not make components call Rust/Tauri directly.
Do not bypass sandbox iframe component host.
```

## v0.8 UI template phase

```txt
Base foundation is done.
Only improve the first UI template now.
Do not build the real editor yet.
Do not build a full IDE.
```

Next acceptable work:

```txt
compile fix
runtime fix
gate fix
small bug fix
GitHub readiness fix
Settings UI template fix
Fractal Binding template fix
```

Not acceptable yet:

```txt
real explorer feature
real editor feature
real chat feature
PDF/image tools
terminal process execution
large UI redesign
remote updater
```

## v0.9 Component Template Kit

```txt
Use pnpm cmp:new <component-id> to create components.
New components must start from cmp/_template/1.0.0.
Do not create components by copy-pasting random HTML.
Do not make iframe components import Tauri.
Do not add a component to active manifest until health works.
```

Required component proof:

```txt
load -> health.ready -> CoreBridge -> Intent -> Policy -> Patch -> Audit
```
