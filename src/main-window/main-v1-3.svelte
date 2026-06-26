<script lang="ts">
  import { onMount } from 'svelte';
  import {
    closeWindow,
    initializeWindow,
    minimizeWindow,
    startDragging,
    toggleMaximize
  } from '$lib/tauri/window';

  type TopTabId = 'ai-editor' | 'file-explorer' | 'analysis' | 'review-tools';
  type SideStage = 0 | 1 | 2 | 3;

  type TopTab = {
    id: TopTabId;
    label: string;
    role: string;
  };

  let { onOpenSwitcher = () => {} } = $props<{ onOpenSwitcher?: () => void }>();

  const topTabs: TopTab[] = [
    { id: 'ai-editor', label: 'Tab 1', role: 'AI Editor' },
    { id: 'file-explorer', label: 'Tab 2', role: 'File Explorer' },
    { id: 'analysis', label: 'Tab 3', role: 'Analysis' },
    { id: 'review-tools', label: 'Tab 4', role: 'Review / Tools' }
  ];

  const p3h1Tabs = ['Editor', 'Diff', 'Preview'];
  const p3h2Tabs = ['Terminal', 'Problems', 'Output', 'Debug'];
  const p4Tabs = ['Chat', 'Chat 2', 'Chat 3'];

  let activeTab = $state<TopTabId>('ai-editor');
  let sideStage = $state<SideStage>(3);
  let p4Collapsed = $state(false);
  let p4OnLeft = $state(false);
  let agentFocus = $state(false);
  let p4SidebarOpen = $state(false);
  let activeP3H1Tab = $state('Editor');
  let activeP3H2Tab = $state('Terminal');
  let activeP4Tab = $state('Chat');

  let activeRole = $derived(topTabs.find((tab) => tab.id === activeTab)?.role ?? 'AI Editor');
  let p0Visible = $derived(!agentFocus && (sideStage === 0 || sideStage === 2 || sideStage === 3));
  let p1Visible = $derived(!agentFocus && activeTab === 'file-explorer' && (sideStage === 0 || sideStage === 3));
  let p2Visible = $derived(!agentFocus);
  let p4Visible = $derived(!p4Collapsed);
  let p3h2Tall = $derived(activeTab === 'analysis' || activeTab === 'review-tools');

  onMount(() => {
    void initializeWindow();
  });

  function selectTopTab(id: TopTabId): void {
    activeTab = id;

    if (id === 'file-explorer') {
      sideStage = 3;
      p4Collapsed = true;
      agentFocus = false;
      return;
    }

    p4Collapsed = false;
    if (id === 'analysis' || id === 'review-tools') {
      p4SidebarOpen = true;
    }
  }

  function cycleLeftPanels(): void {
    agentFocus = false;
    sideStage = ((sideStage + 1) % 4) as SideStage;
  }

  function toggleAgentSide(): void {
    p4OnLeft = !p4OnLeft;
    p4Collapsed = false;

    if (p4OnLeft) {
      p4SidebarOpen = true;
      agentFocus = true;
    } else {
      agentFocus = false;
    }
  }

  function toggleP4(): void {
    p4Collapsed = !p4Collapsed;
  }

  function toggleP4Sidebar(): void {
    p4SidebarOpen = !p4SidebarOpen;
  }

  function sideToggleTitle(): string {
    if (sideStage === 0) return 'Hide P0';
    if (sideStage === 1) return 'Hide P0+P1';
    if (sideStage === 2) return 'Hide P1';
    return 'Show P0+P1';
  }

  function handleDragPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    void startDragging();
  }
</script>

<svelte:window onkeydown={(event) => {
  if (event.ctrlKey && event.key.toLowerCase() === 'e') {
    event.preventDefault();
    toggleAgentSide();
  }
}} />

<div class="main-v1-3-shell" data-agent-left={p4OnLeft} data-agent-focus={agentFocus}>
  <header id="TopRow" class="top-row">
    <div class="top-tabs" aria-label="Main window role tabs">
      {#each topTabs as tab (tab.id)}
        <button
          class:active={activeTab === tab.id}
          class="top-tab"
          type="button"
          title={tab.role}
          onclick={() => selectTopTab(tab.id)}
        >
          <span>{tab.label}</span>
          <strong>{tab.role}</strong>
        </button>
      {/each}
    </div>

    <button class="version-chip" type="button" title="Open main version switcher" onclick={onOpenSwitcher}>
      main-v1-3
    </button>

    <div
      class="top-row-drag-zone"
      data-tauri-drag-region
      aria-label="Window drag area"
      onpointerdown={handleDragPointerDown}
      ondblclick={() => void toggleMaximize()}
    >
      <span>{activeRole}</span>
    </div>

    <div class="top-row-actions">
      <button
        class="icon-btn"
        type="button"
        title="Switch Agent side Ctrl+E"
        aria-label="Switch Agent side Ctrl+E"
        onclick={toggleAgentSide}
      >
        ⇄
      </button>
      <button class="win-btn" type="button" title="Minimize" aria-label="Minimize" onclick={() => void minimizeWindow()}>
        −
      </button>
      <button class="win-btn" type="button" title="Maximize or restore" aria-label="Maximize or restore" onclick={() => void toggleMaximize()}>
        □
      </button>
      <button class="win-btn close" type="button" title="Close" aria-label="Close" onclick={() => void closeWindow()}>
        ×
      </button>
    </div>
  </header>

  <section id="TopBar" class="top-bar">
    <button class="toolbar-btn" type="button" title={sideToggleTitle()} onclick={cycleLeftPanels}>
      ◧ {sideToggleTitle()}
    </button>

    {#if p4OnLeft}
      <button class="toolbar-btn" type="button" title="Toggle agent focus panels" onclick={() => (agentFocus = !agentFocus)}>
        {agentFocus ? 'Show P0-P1-P2' : 'Hide P0-P1-P2'}
      </button>
    {/if}

    <div class="toolbar-center">
      <span>Workspace</span>
      <span>/</span>
      <strong>{activeRole}</strong>
      <span class="muted">Ctrl+E switches agent side</span>
    </div>

    <button class="toolbar-btn" type="button" title="Collapse or expand P4" onclick={toggleP4}>
      {p4Collapsed ? 'Expand P4' : 'Collapse P4'}
    </button>
  </section>

  <main id="MainRow" class:agent-left={p4OnLeft} class="main-row">
    <aside id="P0" class:hidden={!p0Visible} class="panel p0">
      <div class="rail-item active">AI</div>
      <div class="rail-item">Files</div>
      <div class="rail-item">Search</div>
      <div class="rail-item">Git</div>
      <div class="rail-item">Run</div>
      <div class="rail-spacer"></div>
      <div class="rail-item">Set</div>
    </aside>

    <aside id="P1" class:hidden={!p1Visible} class="panel p1">
      <div class="panel-title">Pinned / Disks</div>
      <div class="tree-row active">Pinned</div>
      <div class="tree-row">Desktop</div>
      <div class="tree-row">Documents</div>
      <div class="tree-row">Downloads</div>
      <div class="tree-row">Local Disk C:</div>
      <div class="tree-row">Local Disk D:</div>
    </aside>

    <aside id="P2" class:hidden={!p2Visible} class="panel p2">
      <div class="panel-title">Workspace / Folder Tree</div>
      <div class="tree-row active">fractalApp</div>
      <div class="tree-row">src</div>
      <div class="tree-row indent">main-window</div>
      <div class="tree-row indent">lib</div>
      <div class="tree-row">src-tauri</div>
      <div class="tree-row">contracts</div>
    </aside>

    <section id="P3" class="panel p3">
      <section id="P3H1" class="p3h1">
        <div class="tab-strip">
          {#each p3h1Tabs as tab (tab)}
            <button class:active={activeP3H1Tab === tab} type="button" onclick={() => (activeP3H1Tab = tab)}>
              {tab}
            </button>
          {/each}
          <button class="overflow-tab" type="button" title="More open files">⋯</button>
        </div>
        <div class="workspace-canvas">
          <div class="canvas-card">
            <h1>{activeRole}</h1>
            <p>main-v1-3 layout proof</p>
            <code>P0-P1-P2-P3-P4 / P3H1-P3H2 / P4V1-P4V2</code>
          </div>
        </div>
      </section>

      <section id="P3H2" class:tall={p3h2Tall} class="p3h2">
        <div class="tab-strip small">
          {#each p3h2Tabs as tab (tab)}
            <button class:active={activeP3H2Tab === tab} type="button" onclick={() => (activeP3H2Tab = tab)}>
              {tab}
            </button>
          {/each}
        </div>
        <div class="panel-body compact">{activeP3H2Tab}: ready</div>
      </section>
    </section>

    <aside id="P4" class:hidden={!p4Visible} class="panel p4">
      <div class="p4-header">
        <div class="p4-tabs">
          {#each p4Tabs as tab (tab)}
            <button class:active={activeP4Tab === tab} type="button" onclick={() => (activeP4Tab = tab)}>
              {tab}
            </button>
          {/each}
        </div>
        <div class="p4-actions">
          <button type="button" title="Agent sidebar" onclick={toggleP4Sidebar}>☷</button>
          <button type="button" title="Close P4" onclick={() => (p4Collapsed = true)}>×</button>
        </div>
      </div>

      <div class="p4-main">
        <section id="P4V1" class="p4v1">
          <div class="chat-card">{activeP4Tab}</div>
          <div class="chat-line agent">Agent: ready for small verified patches.</div>
          <div class="chat-line user">User: vibe coding workspace.</div>
        </section>

        <section id="P4V2" class:hidden={!p4SidebarOpen} class="p4v2">
          <div class="panel-title">Agent Sidebar</div>
          <div class="tree-row active">Current agent</div>
          <div class="tree-row">Plan</div>
          <div class="tree-row">Diff</div>
          <div class="tree-row">Proof</div>
          <div class="tree-row">Logs</div>
        </section>
      </div>
    </aside>
  </main>

  <footer id="SBar" class="status-bar">
    <span>fractalApp</span>
    <span>main-v1-3</span>
    <span>{activeRole}</span>
    <span class="grow"></span>
    <label>Lang <select aria-label="Language"><option>EN</option><option>RU</option></select></label>
    <label>Theme <select aria-label="Theme"><option>System</option><option>Dark</option><option>Light</option></select></label>
    <span>RAM --</span>
    <span>CPU --</span>
  </footer>
</div>

<style>
  :global(html),
  :global(body),
  :global(#app) {
    height: 100%;
    margin: 0;
  }

  :global(body) {
    overflow: hidden;
    background: #0f1117;
    color: #e5e7eb;
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  button,
  select {
    font: inherit;
  }

  .main-v1-3-shell {
    height: 100vh;
    display: grid;
    grid-template-rows: 38px 34px minmax(0, 1fr) 24px;
    background: #0f1117;
    color: #e5e7eb;
  }

  .top-row,
  .top-bar,
  .status-bar {
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: #151821;
  }

  .top-row {
    user-select: none;
  }

  .top-tabs {
    height: 100%;
    display: flex;
    align-items: stretch;
  }

  .top-tab {
    min-width: 132px;
    padding: 0 12px;
    border: 0;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    background: transparent;
    color: #aeb6c5;
    cursor: pointer;
    display: grid;
    place-content: center;
    gap: 1px;
    text-align: left;
  }

  .top-tab span {
    font-size: 10px;
    opacity: 0.68;
  }

  .top-tab strong {
    font-size: 12px;
    font-weight: 600;
  }

  .top-tab.active {
    color: #ffffff;
    background: linear-gradient(180deg, rgba(99, 102, 241, 0.25), rgba(99, 102, 241, 0.07));
    box-shadow: inset 0 -2px 0 #8b5cf6;
  }

  .version-chip {
    height: 24px;
    margin-left: 8px;
    padding: 0 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    color: #cbd5e1;
    cursor: pointer;
  }

  .top-row-drag-zone {
    flex: 1;
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8b95a7;
    font-size: 12px;
  }

  .top-row-actions,
  .p4-actions,
  .p4-tabs,
  .tab-strip {
    display: flex;
    align-items: center;
  }

  .icon-btn,
  .win-btn,
  .toolbar-btn,
  .p4-actions button,
  .p4-tabs button,
  .tab-strip button {
    border: 0;
    color: #cbd5e1;
    background: transparent;
    cursor: pointer;
  }

  .icon-btn,
  .win-btn {
    width: 42px;
    height: 38px;
  }

  .icon-btn:hover,
  .win-btn:hover,
  .toolbar-btn:hover,
  .p4-actions button:hover,
  .p4-tabs button:hover,
  .tab-strip button:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .win-btn.close:hover {
    background: #dc2626;
    color: #ffffff;
  }

  .top-bar {
    gap: 8px;
    padding: 0 10px;
    background: #10131a;
  }

  .toolbar-btn {
    height: 24px;
    padding: 0 10px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.04);
  }

  .toolbar-center {
    min-width: 0;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #94a3b8;
    font-size: 12px;
  }

  .muted {
    opacity: 0.62;
  }

  .main-row {
    min-height: 0;
    display: flex;
    overflow: hidden;
  }

  .panel {
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    background: #11141c;
  }

  .panel.hidden {
    display: none;
  }

  .agent-left #P4 {
    order: -1;
    border-left: 0;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }

  .p0 {
    width: 52px;
    flex: 0 0 52px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 0;
    gap: 8px;
  }

  .rail-item {
    width: 36px;
    height: 34px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    color: #94a3b8;
    font-size: 11px;
    background: rgba(255, 255, 255, 0.03);
  }

  .rail-item.active {
    color: #ffffff;
    background: rgba(99, 102, 241, 0.34);
  }

  .rail-spacer {
    flex: 1;
  }

  .p1 {
    width: 168px;
    flex: 0 0 168px;
  }

  .p2 {
    width: 250px;
    flex: 0 0 250px;
  }

  .p3 {
    flex: 1 1 auto;
    display: grid;
    grid-template-rows: minmax(0, 1fr) 160px;
    background: #0f1117;
  }

  .p3h1,
  .p3h2 {
    min-height: 0;
    overflow: hidden;
  }

  .p3h2 {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background: #0c0f15;
  }

  .p3h2.tall {
    min-height: 220px;
  }

  .p4 {
    width: 360px;
    flex: 0 0 360px;
    display: flex;
    flex-direction: column;
    background: #10131b;
  }

  [data-agent-left='true'] .p4 {
    width: 460px;
    flex-basis: 460px;
  }

  .panel-title {
    height: 34px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    color: #cbd5e1;
    font-weight: 600;
    font-size: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .tree-row {
    height: 28px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    color: #aeb6c5;
    font-size: 12px;
  }

  .tree-row.indent {
    padding-left: 28px;
  }

  .tree-row.active {
    color: #ffffff;
    background: rgba(99, 102, 241, 0.22);
  }

  .tab-strip {
    height: 34px;
    background: #151821;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .tab-strip.small {
    height: 30px;
  }

  .tab-strip button,
  .p4-tabs button {
    height: 100%;
    padding: 0 14px;
    border-right: 1px solid rgba(255, 255, 255, 0.06);
  }

  .tab-strip button.active,
  .p4-tabs button.active {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
    box-shadow: inset 0 -2px 0 #38bdf8;
  }

  .overflow-tab {
    margin-left: auto;
  }

  .workspace-canvas {
    height: calc(100% - 34px);
    display: grid;
    place-items: center;
    background:
      radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.18), transparent 38%),
      #0f1117;
  }

  .canvas-card {
    width: min(540px, 70%);
    padding: 28px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.22);
  }

  .canvas-card h1 {
    margin: 0 0 6px;
    font-size: 28px;
  }

  .canvas-card p {
    color: #94a3b8;
  }

  .canvas-card code {
    display: block;
    padding: 10px;
    border-radius: 10px;
    color: #c4b5fd;
    background: rgba(0, 0, 0, 0.24);
  }

  .panel-body.compact {
    padding: 12px;
    color: #94a3b8;
    font-size: 12px;
  }

  .p4-header {
    height: 36px;
    flex: 0 0 36px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: #151821;
  }

  .p4-actions button {
    width: 34px;
    height: 36px;
  }

  .p4-main {
    min-height: 0;
    flex: 1;
    display: flex;
  }

  .p4v1 {
    min-width: 0;
    flex: 1 1 auto;
    padding: 12px;
    overflow: auto;
  }

  .p4v2 {
    width: 150px;
    flex: 0 0 150px;
    border-left: 1px solid rgba(255, 255, 255, 0.08);
    background: #0d1017;
  }

  .p4v2.hidden {
    display: none;
  }

  .chat-card,
  .chat-line {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 12px;
  }

  .chat-card {
    font-weight: 700;
    background: rgba(99, 102, 241, 0.24);
  }

  .chat-line {
    color: #cbd5e1;
    background: rgba(255, 255, 255, 0.05);
  }

  .chat-line.user {
    background: rgba(56, 189, 248, 0.14);
  }

  .status-bar {
    gap: 12px;
    padding: 0 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 0;
    color: #94a3b8;
    font-size: 12px;
  }

  .status-bar .grow {
    flex: 1;
  }

  .status-bar label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .status-bar select {
    height: 20px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 4px;
    color: #cbd5e1;
    background: #0f1117;
  }
</style>
