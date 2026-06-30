# Find all panels and IDs

Searched for text `"panel"`, no results

Searched for regex `"id".*:.*".*panel|"panel` (`**/apps/**/app.manifest.json`), no results

Searched for regex `panel` (`**/mf/*.json`), no results

Searched for files matching `**/apps/*/app.manifest.json`, 2 matches

Searched for files matching `**/apps/*/app-state.md`, 1 match

Searched for files matching `**/apps/*/app-state.schema.json`, 1 match

Searched for files matching `**/*panel*`, 6 matches

Read [](file:///v%3A/fractalApp/apps/_template/app.manifest.json)

Read [](file:///v%3A/fractalApp/apps/ai-agent-chat/app-state.md)

Read [](file:///v%3A/fractalApp/apps/ai-agent-chat/app.manifest.json)

Read [](file:///v%3A/fractalApp/mf/verified.json)

Read [](file:///v%3A/fractalApp/mf/prev.json)

Read [](file:///v%3A/fractalApp/apps/ai-agent-chat/app-state.schema.json)

Read [](file:///v%3A/fractalApp/apps/ai-agent-chat/app.ts)

Read [](file:///v%3A/fractalApp/src/shell/update-panel.svelte)

Read [](file:///v%3A/fractalApp/src/shell/log-panel.svelte)

Read [](file:///v%3A/fractalApp/src/shell/health-panel.svelte)

Read [](file:///v%3A/fractalApp/src/shell/binding-panel.svelte)

Read [](file:///v%3A/fractalApp/src/shell/app-data-panel.svelte)

Read [](file:///v%3A/fractalApp/src/main-window/PanelResizer.svelte)

Read [](file:///v%3A/fractalApp/mf/active.json)

Read [](file:///v%3A/fractalApp/mf/candidate.json)

Read [](file:///v%3A/fractalApp/src/main-window)

Read [](file:///v%3A/fractalApp/src/shell)

Searched for regex `panel` (`**/src/**/*.svelte`), 100 results

Searched for regex `panel` (`**/src/**/*.ts`), 8 results

Searched for regex `panel` (`**/docs/*.md`), 9 results

Read [](file:///v%3A/fractalApp/BLOCK-MANIFEST.json)

Read [](file:///v%3A/fractalApp/src/main-window/main-v1-4.svelte)

Read [](file:///v%3A/fractalApp/src/main-window/main-v1-3.svelte#1-1), lines 1 to 500

Read [](file:///v%3A/fractalApp/src/main-window/main-v1-0.svelte)

Read [](file:///v%3A/fractalApp/src/main-window/manifest.json)

Read [](file:///v%3A/fractalApp/src/p0)

Read [](file:///v%3A/fractalApp/src/p1)

Read [](file:///v%3A/fractalApp/src/p2)

Read [](file:///v%3A/fractalApp/src/p3)

Read [](file:///v%3A/fractalApp/src/p4)

Read [](file:///v%3A/fractalApp/src/shell/cmp-host.svelte#1-1), lines 1 to 100

Read [](file:///v%3A/fractalApp/src/shell/shell-tabs.svelte)

Read [](file:///v%3A/fractalApp/src/p0/p0-v1-0.svelte)

Read [](file:///v%3A/fractalApp/src/p4/p4-chat)

Read [](file:///v%3A/fractalApp/src/p4/p4-side-panel)

Read [](file:///v%3A/fractalApp/src/main-window/main-v1-0.svelte#100-100), lines 100 to 137

Read [](file:///v%3A/fractalApp/src/p4/p4-v1-0.svelte)

Read [](file:///v%3A/fractalApp/src/p3/p3-v1-0.svelte#1-1), lines 1 to 50

Searched for text `panel|Panel|PANEL` (`**/src/main-window/**`), 20 results

Read [](file:///v%3A/fractalApp/src/main-window/main-v1-4.svelte#1-1), lines 1 to 150

Read [](file:///v%3A/fractalApp/mf/active.json#1-1), lines 1 to 50

Read [](file:///v%3A/fractalApp/apps/ai-agent-chat/app.manifest.json)

Read [](file:///v%3A/fractalApp/BLOCK-MANIFEST.json)

Read [](file:///v%3A/fractalApp/src/main-window/main-v1-4.svelte#150-150), lines 150 to 240

Read [](file:///v%3A/fractalApp/src/shell)

Read [](file:///v%3A/fractalApp/apps)

Searched for text `P3H1|P3H2|p3h1|p3h2` (`**/src/p3/**`), 20 results

Here is the complete list of panels and their IDs:

---

## Layout Panels (structural UI)

| Panel ID | File | Description
| **P0** | p0-v1-0.svelte | Side rail — icon shortcuts |
| **P1** | p1-v1-0.svelte | Pinned / Disks sidebar |
| **P2** | p2-v1-0.svelte | Workspace / Folder Tree |
| **P3** | p3-v1-0.svelte | Main orchestra (wraps P3H1 + P3H2) |
| **P3H1** | p3h1-v1-0.svelte | Editor area (Editor, Preview, Diff, Plan tabs) |
| **P3H2** | p3h2-v1-0.svelte | Bottom terminal panel (Terminal, Problems, Logs, Proof tabs) |
| **P4** | p4-v1-0.svelte | AI Agent chat panel (Chat, Chat 2, Chat 3 tabs) |
| **P4V1** | inline in `p4-v1-0.svelte` | Agent chat area (sub-section of P4) |
| **P4V2** | inline in `p4-v1-0.svelte` | Agent sidebar (Plan, Diff, Proof, Logs — sub-section of P4) |

### Shell Dev-Tool Panels

| Panel ID | File |
| **CoreStatus** | core-status.svelte |
| **UpdatePanel** | update-panel.svelte |
| **BindingPanel** | binding-panel.svelte |
| **AppDataPanel** | app-data-panel.svelte |
| **HealthPanel** | health-panel.svelte |
| **LogPanel** | log-panel.svelte |
| **CmpHost** | cmp-host.svelte |
| **ShellTabs** | shell-tabs.svelte |
| **SafeScreen** | safe-screen.svelte |
| **CrashScreen** | crash-screen.svelte |

### MF Component Panels (registered in active.json)

| Component ID | Version(s) | Path |
| **welcome** | 1.0.0 / 1.0.1 | welcome |
| **explorer** | 1.0.0 | explorer |
| **editor** | 1.0.0 | editor |
| **chat** | 1.0.0 | chat |
| **terminal** | 1.0.0 | terminal |
| **settings** | 1.0.0 / 1.0.1 | settings |

### Apps (fractal apps)

| App ID | Status | Blocks |
| **ai-agent-chat** | skeleton | 10 blocks (chat-popup, context-gate, token-budget, model-router, parallel-runner, patch-planner, patch-review, gate-runner, error-memory, rule-improvement-proposals) |
| **_template** | template | 1 block |

### Utility

| Panel | File |
| **PanelResizer** | PanelResizer.svelte — drag handle between panels |

### Top-level tabs (top-row, via main-v1-4.svelte)

| Tab ID | Role |
| **ai-editor** | AI Editor |
| **file-explorer** | File Explorer |
| **analysis** | Analysis |
| **review** | Review |

---

**Total: 9 layout panels, 10 shell panels, 6 MF components, 2 apps, 4 top tabs.**
