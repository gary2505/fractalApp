# PROJECT-STAGE-V1-13

Date: 2026-06-28  
Repo: `https://github.com/gary2505/fractalApp.git`  
Previous stage: `PROJECT-STAGE-V1-12.md`  
Current focus: `main-v1-4` layout split and project structure cleanup.

---

## SmartLog v2 freeze note (2026-07-01)

- SmartLog v2 compact pipe runtime is active (`smart_log_run_event` → `app-run.jsonl`).
- Old SmartLog v1 JSON object runtime path is disabled (`smart_log_write` only for issue/error/fatal).
- `llog.md` AI-agent temporary debug file is active (`src-tauri/src/llog.rs`).
- Temporary `T:` llog blocks must be removed after fix.
- Next block: persistent deduped SmartLog error files.
- Do NOT revive `core.boot.ok`, `health.check.ok`, `logBootOk`, `logBootErr`, `write_known_log`.

---

## new File structure

`main-v1-4` is the next main layout version.  
It must stay the **layout owner / composer** only.

The approved direction is to keep `src/main-window/` small and move panel/status/top-area files into separate folders:

## Files

```txt
src/main-window/main-v1-4.svelte
src/main-window/main-v1-4.contract.json
src/main-window/main-v1-4.etalon.json
src/main-window/manifest.json
src/main-window/versions.ts
src/App.svelte

src/main-window/   layout owners, version registry, manifest, contracts
src/top-row/       custom window header row
src/top-bar/       app toolbar row
src/p0/            left icon rail
src/p1/            hidden/toggle panel
src/p2/            files panel
src/p3/            main/orchestra panel
src/p3h1/          editor panel
src/p3h2/          terminal panel
src/p4/            AI agent panel
src/p4/chat        AI agent chat
src/p4/side-panel  AI agent chat side panel

src/sbar/          status bar/footer
```

The patch keeps `main-v1-3` untouched and adds `main-v1-4` as a new layout version.

---
Lock

## STRICT SAFE-WORK RULES

Do not write code, create files, edit files, change defaults, change routing, or generate ZIP until I explicitly say:
IMPLEMENT
Before that word, you may only audit, compare, explain, and create a plan.
Rules:

1. Do not change working behavior.
If you do not have exact latest local repo state ask it about.
2. Do not created new logic instead of extracting from proven files.
3. Do not rewrite existing logic from memory.
4. Do not change the default app version.
5. Do not used remote/visible repo context and do not guessed missing behavior.
Ask if you  do not  have last repo and do not have to do list that was confirm.
6. New versions must be additive only and must not replace or break the previous working version.
7. If you do not have the exact latest local file, stop and ask for it.
8. If behavior must be preserved, copy/extract from proven working code only.
9. Every proposed patch must first show: Result / Files / Risk / Next.
10. If there is any risk of breaking current behavior, stop and explain before coding.
11. ZIP must include only approved new/changed files.

Current rule:
NO CODING until layout audit/plan is approved.

End lock

---

## Locked Goal Block

FractalApp is not just another code editor.  
The goal is to build an **AI Development Commander**: an AI hub, AI control center, AI studio, and developer command center that is better than Cursor and VS Code for AI-assisted software creation.

Locked product direction:

1. **AI-first development center**  
   FractalApp should help AI agents plan, build, test, repair, and verify code with minimum human work.

2. **Core-Web Architecture**  
   A stable Tauri 2 core owns boot, safety, shell, logs, settings, version loading, rollback, and native access.  
   UI features are versioned web components that can be replaced or upgraded without changing the whole app.

3. **Fractal Template Development Process**  
   Development must be split into small verified blocks: app → domain → feature → flow → step → cell.  
   Each block should be easy for an AI agent to read, test, replace, and improve.

4. **One Design System**  
   DaisyUI remains the main theme and CSS foundation.  
   Do not create random custom visual systems unless approved.

5. **Contract System**  
   Important components must have contracts and etalons so AI agents can compare expected structure, IDs, behavior, and test results.

6. **Smart Logging and Full Tracing**  
   The app should support smart logs/traces for state changes, UI actions, errors, agent actions, and verification results.  
   Goal: make bugs diagnosable by AI without forcing the human to inspect everything manually.

7. **Minimum Human Involvement**  
   The human should give goals and approve important direction.  
   AI should do most implementation, checks, diagnosis, repair, and short reporting.

8. **Maximum AI Development**  
   The app should be designed so multiple AI agents can work safely in parallel, with clear contracts, small files, isolated blocks, and proof-based reports.

9. **Small Files Rule**  
   Keep files small and focused.  
   `main-v1-4` composes layout; child panels own their own small UI.  
   Avoid one large file that mixes all panels, behavior, and proof logic.

10. **Evidence-First Workflow**  
    No hallucinated workflows.  
    Before changing code, audit the current files.  
    After changing code, report what changed, what was tested, what risk remains, and what should happen next.

---

## Current Layout Lock

`main-v1-4` must own only the high-level layout:

```txt
TopRow
TopBar
MainRow
  P0
  P1 hidden/toggle panel
  P2 files
  P3 main/orchestra
    P3H1 editor
    P3H2 terminal
  P4 AI agent
    P4-chat          AI agent chat
    P4-side-panel    AI chat side panel

SBar status bar/footer
```

Panel files must stay separate and versioned:

```txt
top-row-v1-0.svelte
top-bar-v1-0.svelte
p0-v1-0.svelte
p1-v1-0.svelte
p2-v1-0.svelte
p3-v1-0.svelte
p3h1-v1-0.svelte
p3h2-v1-0.svelte
p4-v1-0.svelte
    P4-chat-v1-0.svelte 
    P4-side-panel-v1-0 

sbar-v1-0.svelte
```

Visible DOM/test IDs may stay uppercase (`P0`, `P1`, `P2`, etc.), but filenames should stay lowercase for cross-platform safety.

---

## Behavior Lock

Keep behavior and hotkeys from `main-v1-3` where possible:

```txt
Ctrl+E       toggle P1
Ctrl+B       toggle P0
Ctrl+J       toggle P3H2 terminal
Ctrl+Alt+B   toggle P4 AI panel
Esc          close popups / transient UI where applicable
```

Keep icons and window-header behavior from the previous window header patch where applicable:

```txt
Minimize
Maximize / Restore
Close
Main version switcher behavior
```

---

## Risk

1. The split ZIP cannot delete stale files from an earlier ZIP install.  
   If the earlier non-split layout ZIP was installed, delete moved child files from `src/main-window/` manually.

2. Full repo checks were not confirmed yet after install.  
   The next local step must run project checks.

3. `main-v1-4` should not replace `main-v1-3`.  
   It must be added as a new selectable version.

4. Keep scope narrow.  
   Do not build real editor/files/terminal/AI agent features yet.  
   This stage is only layout structure, version split, and proof shell.

---

## Next

1. Install `fractalApp-main-v1-4-layout-split.zip` into the repo.
2. Delete stale moved files from `src/main-window/` only if they exist.
3. Run:

```bash
pnpm check
```

4.Start the app and test:

```txt
main-v1-4 appears in version switcher
main-v1-4 opens correctly
SBar always visible
P0 toggles with Ctrl+B
P1 toggles with Ctrl+E
P3H2 toggles with Ctrl+J
P4 toggles with Ctrl+Alt+B
window header buttons still work
DaisyUI theme still controls the look
```

5.Report in this short format only:

```txt
Result:
Files:
Risk:
Next:
```
