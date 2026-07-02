# PROJECT-STAGE-V1-13

Date: 2026-07-01  
Repo: `https://github.com/gary2505/fractalApp.git`  
Current stage: `Phase 4 — P4 AI Chat Panel Skeleton`  
Current app version: `main-v1-4`

---

## Current Focus

Build the first usable skeleton of the **P4 AI Agent Panel**.

P4 is not just a simple chat box.  
P4 is the future **AI Agent Control Center** for FractalApp.

This stage must stay small and safe:

```txt
P4
  P4 header
  P4 provider/model placeholder
  P4 chat area
  P4 input area
  P4 run/stop placeholder actions
  P4 side panel placeholder
```

No real AI backend integration in this stage.

---

## Product Direction

FractalApp is an **AI Development Commander**: an AI hub, AI control center, AI studio, and developer command center for AI-assisted software creation.

The app should help AI agents plan, build, test, repair, and verify code with minimum human work.

Core principles:

1. Stable Tauri 2 Core owns boot, safety, logs, settings, version loading, rollback, and native access.
2. UI features are versioned web components.
3. Development is split into small verified blocks.
4. DaisyUI remains the theme and CSS foundation.
5. Important components should have simple contracts and etalons.
6. Logs and traces must help AI debug without noisy output.
7. Files must stay small and focused.
8. Every task must end with evidence: changed files, checks, risk, next step.

---

## Current Layout Contract

`main-v1-4` owns only the high-level layout composition:

```txt
TopRow
TopBar
MainRow
  P0
  P1
  P2
  P3
    P3H1
    P3H2
  P4
    P4 Chat
    P4 Side Panel
SBar
```

`main-v1-4` must stay a layout composer only.  
Panel UI and behavior should live in panel files.

---

## Current Panel Files

Expected current panel structure:

```txt
src/main-window/main-v1-4.svelte

src/top-row/top-row-v1-0.svelte
src/top-bar/top-bar-v1-0.svelte

src/p0/p0-v1-0.svelte
src/p1/p1-v1-0.svelte
src/p2/p2-v1-0.svelte
src/p3/p3-v1-0.svelte
src/p3h1/p3h1-v1-0.svelte
src/p3h2/p3h2-v1-0.svelte

src/p4/p4-v1-0.svelte
src/p4/chat/p4-chat-v1-0.svelte
src/p4/side-panel/p4-side-panel-v1-0.svelte

src/sbar/sbar-v1-0.svelte
```

Visible DOM/test IDs may stay uppercase: `P0`, `P1`, `P2`, `P3`, `P4`.  
Filenames should stay lowercase for cross-platform safety.

---

## Behavior Contract

Keep current hotkeys:

```txt
Ctrl+B       toggle P0
Ctrl+E       toggle P1
Ctrl+J       toggle P3H2 terminal
Ctrl+Alt+B   toggle P4 AI panel
Esc          close transient UI where applicable
```

Keep current window header behavior:

```txt
Minimize
Maximize / Restore
Close
Main version switcher
```

---

## Logging Contract

Keep logging quiet and compact.

Runtime SmartLog format stays pipe-only:

```txt
H|2|YYMMDDTHH:mmZ|fractalApp|main-v1-4|dev
0|AP|BT||
<ms>|UI|AI||open=1
<ms>|AP|EN||
```

Temporary AI-agent debug logs use:

```txt
.ai/bundles/llog.md
```

Rules:
- Do not add noisy logs.
- Do not log per loop item.
- Temporary `T:<id>` logs must be removed after the fix.
- Monitor `M:<id>` logs stay commented out by default.

---

## Phase 4 Scope

Build the P4 AI Chat Panel skeleton only.

Required UI:

```txt
P4 Header
  title: AI Agent
  provider/model placeholder
  close/collapse action if existing panel system supports it

P4 Chat Area
  empty state
  message list placeholder
  user/assistant message style placeholders

P4 Input Area
  textarea/input placeholder
  Send placeholder
  Run placeholder
  Stop placeholder
  Attach/context placeholder if simple

P4 Side Panel
  task/context placeholder
  agent status placeholder
  no real agent logic
```

Required behavior:
- P4 opens/closes with `Ctrl+Alt+B`.
- P4 toggle logs one compact `UI|AI` row.
- P4 layout does not break P0/P1/P2/P3/P3H2/SBar.
- P4 can be visually empty but must look intentional.

---

## Do Not

Do not:
- build real AI provider integration
- call OpenAI/Claude/local models
- add agent orchestration
- add LogViewer
- redesign the whole layout
- change default app version
- touch `main-v1-3`
- add noisy runtime logs
- create large mixed files
- move unrelated panels
- change SmartLog format
- change `llog.md` rules

---

## Implementation Plan

1. Audit current P4 files.
2. Keep `main-v1-4` as composer.
3. Put P4 UI in `src/p4/`.
4. Put chat UI in `src/p4/chat/`.
5. Put side panel UI in `src/p4/side-panel/`.
6. Use DaisyUI/Tailwind classes already used by the app.
7. Keep placeholder logic simple.
8. Run checks.
9. Report only current result and next step.

---

## Checks

Run:

```bash
pnpm check
```

Run:

```bash
cd src-tauri && cargo check
```

Manual test:

```txt
main-v1-4 opens
P4 opens/closes with Ctrl+Alt+B
P4 skeleton displays correctly
P0 toggles with Ctrl+B
P1 toggles with Ctrl+E
P3H2 toggles with Ctrl+J
SBar stays visible
window buttons still work
runtime log remains pipe-only
```

---

## Final Report Format

```txt
Result:
Files:
Checks:
Risk:
Next:
```
