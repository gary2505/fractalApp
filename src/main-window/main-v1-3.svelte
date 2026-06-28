<script lang="ts">
  import { onMount } from 'svelte';
  import {
    closeWindow,
    initializeWindow,
    minimizeWindow,
    startDragging,
    toggleMaximize
  } from '$lib/tauri/window';
  import PanelResizer from './PanelResizer.svelte';
  import { theme, applyTheme } from '../core/theme/theme';
  import type { ThemeMode } from '../core/theme/theme';

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
  let p2HiddenByToggle = $state(false);
  let activeP3H1Tab = $state('Editor');
  let activeP3H2Tab = $state('Terminal');
  let activeP4Tab = $state('Chat');

  // Resizable panel widths
  let p1Width = $state(168);
  let p2Width = $state(250);
  let p4Width = $state(360);

  function resizeP1(delta: number) { p1Width = Math.max(120, Math.min(400, p1Width + delta)); }
  function resizeP2(delta: number) { p2Width = Math.max(150, Math.min(500, p2Width + delta)); }
  function resizeP4(delta: number) { p4Width = Math.max(280, Math.min(600, p4Width + delta)); }
  let p3h2Height = $state(160);
  function resizeP3H2(delta: number) { p3h2Height = Math.max(80, Math.min(600, p3h2Height + delta)); }

  let activeRole = $derived(topTabs.find((tab) => tab.id === activeTab)?.role ?? 'AI Editor');
  let p0Visible = $derived(!agentFocus && sideStage === 0);
  let p1Visible = $derived(!agentFocus && activeTab === 'file-explorer' && (sideStage === 0 || sideStage === 3));
  let p2Visible = $derived(!agentFocus && sideStage !== 2 && !p2HiddenByToggle);
  let p4Visible = $derived(!p4Collapsed);

  onMount(() => {
    void initializeWindow();
    // 🔍 SEARCH: applyTheme on boot so the SBAR select matches the actual theme
    applyTheme($theme);
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
    agentFocus = false;
  }

  function toggleP4(): void {
    p4Collapsed = !p4Collapsed;
  }

  function toggleP4Sidebar(): void {
    p4SidebarOpen = !p4SidebarOpen;
  }

  // 🔍 SEARCH: theme switcher handler – wired to SBAR select
  function changeTheme(value: ThemeMode): void {
    theme.set(value);
    applyTheme(value);
  }

  function sideToggleTitle(): string {
    if (sideStage === 0) return 'Hide side panel';
    if (sideStage === 1) return 'Hide files panel';
    if (sideStage === 2) return 'Show files panel';
    return 'Show side panel';
  }

  let p3h2Hidden = $state(false);
  let p3h2Pinned = $state(true);
  let p3h2Maximized = $state(false);
  let p3h2Hover = $state(false);
  let p3h2ShowTimer: ReturnType<typeof setTimeout> | undefined;
  let p3h2HideTimer: ReturnType<typeof setTimeout> | undefined;

  function cycleP3H2(): void {
    p3h2Hidden = !p3h2Hidden;
  }

  function p3h2Title(): string {
    return p3h2Hidden ? 'Show terminal panel (Ctrl+J)' : 'Hide terminal panel (Ctrl+J)';
  }

  function closeP3H2(): void {
    p3h2Hidden = true;
  }

  function togglePinP3H2(): void {
    p3h2Pinned = !p3h2Pinned;
  }

  function toggleMaximizeP3H2(): void {
    p3h2Maximized = !p3h2Maximized;
    if (p3h2Maximized) p3h2Pinned = true;
  }

  function p3h2OnMouseEnter(): void {
    clearTimeout(p3h2HideTimer);
    if (!p3h2Pinned) {
      p3h2ShowTimer = setTimeout(() => { p3h2Hover = true; }, 150);
    }
  }

  function p3h2OnMouseLeave(): void {
    clearTimeout(p3h2ShowTimer);
    if (!p3h2Pinned) {
      p3h2HideTimer = setTimeout(() => { p3h2Hover = false; }, 300);
    }
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
  if (event.ctrlKey && !event.altKey && event.key.toLowerCase() === 'b') {
    event.preventDefault();
    p2HiddenByToggle = !p2HiddenByToggle;
  }
  if (event.ctrlKey && event.key.toLowerCase() === 'j') {
    event.preventDefault();
    cycleP3H2();
  }
  if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'b') {
    event.preventDefault();
    toggleP4();
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
          <span class="text-2xs">{tab.label}</span>
          <strong>{tab.role}</strong>
        </button>
      {/each}
    </div>

    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="top-row-drag-zone text-xs"
      data-tauri-drag-region
      aria-label="Window drag area"
      onpointerdown={handleDragPointerDown}
      ondblclick={() => void toggleMaximize()}
    >
      <span>{activeRole}</span>
    </div>

    <div class="top-row-actions">
      <button
        class="icon-btn icon-btn-narrow"
        type="button"
        title={p3h2Title()}
        aria-label={p3h2Title()}
        onclick={cycleP3H2}
      >
        {#if p3h2Hidden}
          <svg width="18" height="18" viewBox="0 0 52 52" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M46,8H6c-1.1,0-2,0.9-2,2v32c0,1.1,0.9,2,2,2h40c1.1,0,2-0.9,2-2V10C48,8.9,47.1,8,46,8z M44,40H8V12h36V40z"></path>
            <path d="M41,38H11.1c-0.6,0-1-0.4-1-1V27c0-0.6,0.4-1,1-1H41c0.6,0,1,0.4,1,1v10C42,37.6,41.6,38,41,38z"></path>
          </svg>
        {:else}
          <svg width="18" height="18" viewBox="0 0 52 52" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M46,8H6c-1.1,0-2,0.9-2,2v32c0,1.1,0.9,2,2,2h40c1.1,0,2-0.9,2-2V10C48,8.9,47.1,8,46,8z M44,40H8V12h36V40z"></path>
            <path d="M41,26H11.1c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1H41c0.6,0,1,0.4,1,1v2C42,25.6,41.6,26,41,26z"></path>
          </svg>
        {/if}
      </button>
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
    {#if p4OnLeft}
      <button class="toolbar-btn icon-btn" type="button" title={p4Collapsed ? 'Open AI chat (Ctrl+Alt+B)' : 'Close AI chat (Ctrl+Alt+B)'} onclick={toggleP4}>
        <svg width="18" height="18" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" fill={p4Collapsed ? '#FCCE38' : '#666'}>
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Weather" transform="translate(-816.000000, -48.000000)" fill-rule="nonzero">
                <g id="sparkles_fill" transform="translate(816.000000, 48.000000)">
                  <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero"></path>
                  <path d="M6.17296,13.0036 L6.34297,13.3752 L6.34297,13.3752 C7.07036,14.88 8.21624,16.1431 9.6428,17.0133 L9.90768,17.1685 L9.90768,17.1685 C10.0308,17.2377 10.0308,17.4149 9.90768,17.4842 C9.81836,17.5344 9.73005,17.5862 9.6428,17.6394 C8.21624,18.5095 7.07036,19.7727 6.34297,21.2775 L6.17296,21.649 L6.17296,21.649 C6.10635,21.7989 5.89365,21.7989 5.82704,21.649 L5.65703,21.2775 L5.65703,21.2775 C4.92964,19.7727 3.78376,18.5095 2.3572,17.6394 C2.26995,17.5862 2.18164,17.5344 2.09232,17.4842 C1.96923,17.4149 1.96923,17.2377 2.09232,17.1685 L2.3572,17.0133 L2.3572,17.0133 C3.78376,16.1431 4.92964,14.88 5.65703,13.3752 L5.82704,13.0036 L5.82704,13.0036 C5.89365,12.8538 6.10635,12.8538 6.17296,13.0036 Z M15.0779,2.72991 C15.1747,2.94774 15.2716,3.16544 15.3754,3.38009 C16.6483,6.01348 18.6536,8.22403 21.1501,9.74673 C21.3028,9.83987 21.4573,9.93043 21.6137,10.0184 C21.8291,10.1395 21.8291,10.4497 21.6137,10.5708 C21.4573,10.6588 21.3028,10.7493 21.1501,10.8425 C18.6536,12.3651 16.6483,14.5757 15.3754,17.2091 C15.2716,17.4237 15.1747,17.6414 15.0779,17.8593 C14.9613,18.1215 14.5891,18.1215 14.4725,17.8593 C14.3757,17.6414 14.2788,17.4237 14.175,17.2091 C12.9021,14.5757 10.8968,12.3651 8.40031,10.8425 C8.24761,10.7493 8.09308,10.6588 7.93676,10.5708 C7.72136,10.4497 7.72136,10.1395 7.93676,10.0184 C8.09308,9.93043 8.24761,9.83987 8.40031,9.74673 C10.8968,8.22403 12.9021,6.01348 14.175,3.38009 C14.2786,3.16578 14.3757,2.94781 14.4725,2.72991 C14.5891,2.46764 14.9613,2.46764 15.0779,2.72991 Z" fill={p4Collapsed ? '#FCCE38' : '#666'}></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </button>

      <div class="toolbar-center text-xs">
        <strong>{activeRole}</strong>
      </div>

      <button class="toolbar-btn" type="button" title={sideToggleTitle()} onclick={cycleLeftPanels}>
        ◧
      </button>
    {:else}
      <button class="toolbar-btn" type="button" title={sideToggleTitle()} onclick={cycleLeftPanels}>
        ◧
      </button>

      <div class="toolbar-center text-xs">
        <strong>{activeRole}</strong>
      </div>

      <button class="toolbar-btn icon-btn" type="button" title={p4Collapsed ? 'Open AI chat (Ctrl+Alt+B)' : 'Close AI chat (Ctrl+Alt+B)'} onclick={toggleP4}>
        <svg width="18" height="18" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" fill={p4Collapsed ? '#FCCE38' : '#666'}>
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Weather" transform="translate(-816.000000, -48.000000)" fill-rule="nonzero">
                <g id="sparkles_fill" transform="translate(816.000000, 48.000000)">
                  <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill-rule="nonzero"></path>
                  <path d="M6.17296,13.0036 L6.34297,13.3752 L6.34297,13.3752 C7.07036,14.88 8.21624,16.1431 9.6428,17.0133 L9.90768,17.1685 L9.90768,17.1685 C10.0308,17.2377 10.0308,17.4149 9.90768,17.4842 C9.81836,17.5344 9.73005,17.5862 9.6428,17.6394 C8.21624,18.5095 7.07036,19.7727 6.34297,21.2775 L6.17296,21.649 L6.17296,21.649 C6.10635,21.7989 5.89365,21.7989 5.82704,21.649 L5.65703,21.2775 L5.65703,21.2775 C4.92964,19.7727 3.78376,18.5095 2.3572,17.6394 C2.26995,17.5862 2.18164,17.5344 2.09232,17.4842 C1.96923,17.4149 1.96923,17.2377 2.09232,17.1685 L2.3572,17.0133 L2.3572,17.0133 C3.78376,16.1431 4.92964,14.88 5.65703,13.3752 L5.82704,13.0036 L5.82704,13.0036 C5.89365,12.8538 6.10635,12.8538 6.17296,13.0036 Z M15.0779,2.72991 C15.1747,2.94774 15.2716,3.16544 15.3754,3.38009 C16.6483,6.01348 18.6536,8.22403 21.1501,9.74673 C21.3028,9.83987 21.4573,9.93043 21.6137,10.0184 C21.8291,10.1395 21.8291,10.4497 21.6137,10.5708 C21.4573,10.6588 21.3028,10.7493 21.1501,10.8425 C18.6536,12.3651 16.6483,14.5757 15.3754,17.2091 C15.2716,17.4237 15.1747,17.6414 15.0779,17.8593 C14.9613,18.1215 14.5891,18.1215 14.4725,17.8593 C14.3757,17.6414 14.2788,17.4237 14.175,17.2091 C12.9021,14.5757 10.8968,12.3651 8.40031,10.8425 C8.24761,10.7493 8.09308,10.6588 7.93676,10.5708 C7.72136,10.4497 7.72136,10.1395 7.93676,10.0184 C8.09308,9.93043 8.24761,9.83987 8.40031,9.74673 C10.8968,8.22403 12.9021,6.01348 14.175,3.38009 C14.2786,3.16578 14.3757,2.94781 14.4725,2.72991 C14.5891,2.46764 14.9613,2.46764 15.0779,2.72991 Z" fill={p4Collapsed ? '#FCCE38' : '#666'}></path>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </button>
    {/if}
  </section>

  <main id="MainRow" class:agent-left={p4OnLeft} class="main-row">
    <aside id="P0" class:hidden={!p0Visible} class="panel p0">
      <div class="rail-item active">AI</div>
      <div class="rail-item text-xs">Files</div>
      <div class="rail-item text-xs">Search</div>
      <div class="rail-item text-xs">Git</div>
      <div class="rail-item text-xs">Run</div>
      <div class="rail-spacer"></div>
      <div class="rail-item text-xs">Set</div>
    </aside>

    <aside id="P1" class:hidden={!p1Visible} class="panel p1" style="width:{p1Width}px; flex:0 0 {p1Width}px;">
      <div class="panel-title text-xs">Pinned / Disks</div>
      <div class="tree-row active text-xs">Pinned</div>
      <div class="tree-row text-xs">Desktop</div>
      <div class="tree-row text-xs">Documents</div>
      <div class="tree-row text-xs">Downloads</div>
      <div class="tree-row text-xs">Local Disk C:</div>
      <div class="tree-row text-xs">Local Disk D:</div>
    </aside>

    {#if p1Visible}
      <PanelResizer direction="vertical" onResize={resizeP1} />
    {/if}

    <aside id="P2" class:hidden={!p2Visible} class="panel p2" style="width:{p2Width}px; flex:0 0 {p2Width}px;">
      <div class="panel-title">Workspace / Folder Tree</div>
      <div class="tree-row active">fractalApp</div>
      <div class="tree-row text-xs">src</div>
      <div class="tree-row indent text-xs">main-window</div>
      <div class="tree-row indent text-xs">lib</div>
      <div class="tree-row text-xs">src-tauri</div>
      <div class="tree-row text-xs">contracts</div>
    </aside>

    {#if p2Visible}
      <PanelResizer direction="vertical" onResize={resizeP2} />
    {/if}

      <section id="P3" class="panel p3" class:has-maximized={p3h2Maximized}>
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
            <h1 class="text-2xl">{activeRole}</h1>
            <p>main-v1-3 layout proof</p>
            <code>P0-P1-P2-P3-P4 / P3H1-P3H2 / P4V1-P4V2</code>
          </div>
        </div>
      </section>

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="p3h2-zone" onmouseenter={p3h2OnMouseEnter} onmouseleave={p3h2OnMouseLeave}>
        <PanelResizer direction="horizontal" onResize={(d) => resizeP3H2(-d)} />
        <section
          id="P3H2"
          class="p3h2"
          class:hidden={p3h2Hidden}
          class:maximized={p3h2Maximized}
          class:pinned={p3h2Pinned}
          class:slide-visible={p3h2Hover}
          style="--p3h2-full:{p3h2Height + 32}px"
        >
          <div class="p3h2-header">
            <div class="tab-strip small">
              {#each p3h2Tabs as tab (tab)}
                <button class:active={activeP3H2Tab === tab} type="button" onclick={() => (activeP3H2Tab = tab)}>
                  {tab}
                </button>
              {/each}
            </div>
            <div class="p3h2-actions">
              <button type="button" title={p3h2Pinned ? 'Unpin terminal' : 'Pin terminal'} onclick={togglePinP3H2}>
                <svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor" class:pin-rotated={p3h2Pinned}>
                  <polygon points="419.286,301.002 416.907,248.852 357.473,219.867 337.487,55.355 369.774,38.438 369.774,0 286.751,0 225.249,0 142.219,0 142.219,38.438 174.509,55.355 154.52,219.867 95.096,248.852 92.714,301.002 256.001,301.002"></polygon>
                  <polygon points="231.399,465.871 254.464,512 277.522,465.871 277.522,315.194 231.399,315.194"></polygon>
                </svg>
              </button>
              <button type="button" title={p3h2Maximized ? 'Restore terminal' : 'Maximize terminal'} onclick={toggleMaximizeP3H2}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 19h3v2H3v-5h2zm16 2h-5v-2h3v-3h2zM8 5H5v3H3V3h5zm13 3h-2V5h-3V3h5z"></path>
                </svg>
              </button>
              <button type="button" title="Close terminal" onclick={closeP3H2}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="p3h2-body" style="height:{p3h2Height}px">
            <div class="panel-body compact text-xs">{activeP3H2Tab}: ready</div>
          </div>
      </section>
      </div>
    </section>

    {#if p4Visible && !p4OnLeft}
      <PanelResizer direction="vertical" onResize={(d) => resizeP4(-d)} />
    {/if}

    <aside id="P4" class:hidden={!p4Visible} class="panel p4" style="width:{p4Width}px; flex:0 0 {p4Width}px;">
      <div class="p4-header">
        <div class="p4-tabs">
          {#each p4Tabs as tab (tab)}
            <button class:active={activeP4Tab === tab} type="button" onclick={() => (activeP4Tab = tab)}>
              {tab}
            </button>
          {/each}
        </div>
        <div class="p4-actions">
          <button type="button" title="Agent sidebar" onclick={toggleP4Sidebar}>
            <svg width="16" height="16" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet" fill={p4SidebarOpen ? '#FCCE38' : '#666'}>
              <path d="M22.625 2c0 15.834-8.557 30-20.625 30c12.068 0 20.625 14.167 20.625 30c0-15.833 8.557-30 20.625-30c-12.068 0-20.625-14.166-20.625-30" fill={p4SidebarOpen ? '#FCCE38' : '#666'}></path>
              <path d="M47 32c0 7.918-4.277 15-10.313 15C42.723 47 47 54.084 47 62c0-7.916 4.277-15 10.313-15C51.277 47 47 39.918 47 32z" fill={p4SidebarOpen ? '#FCCE38' : '#666'}></path>
              <path d="M51.688 2c0 7.917-4.277 15-10.313 15c6.035 0 10.313 7.084 10.313 15c0-7.916 4.277-15 10.313-15c-6.036 0-10.313-7.083-10.313-15" fill={p4SidebarOpen ? '#FCCE38' : '#666'}></path>
            </svg>
          </button>
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
          <div class="panel-title text-xs">Agent Sidebar</div>
          <div class="tree-row active text-xs">Current agent</div>
          <div class="tree-row text-xs">Plan</div>
          <div class="tree-row text-xs">Diff</div>
          <div class="tree-row text-xs">Proof</div>
          <div class="tree-row text-xs">Logs</div>
        </section>
      </div>
    </aside>
  </main>

  <footer id="SBar" class="status-bar text-xs">
    <button class="version-chip" type="button" title="Open main version switcher" onclick={onOpenSwitcher}>
      main-v1-34
    </button>
    <span class="grow"></span>
    <label><select aria-label="Language"><option>EN</option><option>RU</option></select></label>
    <label><select aria-label="Theme" bind:value={$theme} onchange={(e) => changeTheme(e.currentTarget.value as ThemeMode)}><option value="system">System</option><option value="dark">Dark</option><option value="light">Light</option></select></label>
    <span>RAM --</span>
    <span>CPU --</span>
  </footer>
</div>

<style>
  /* 🔍 SEARCH: theme-aware tokens – respond to [data-theme] set by applyTheme() */
  :global(:root),
  :global([data-theme="dark"]) {
    --v3-bg: #0f1117;
    --v3-surface: #151821;
    --v3-surface-alt: #10131b;
    --v3-panel: #11141c;
    --v3-panel-deeper: #0c0f15;
    --v3-text: #e5e7eb;
    --v3-text-muted: #94a3b8;
    --v3-text-soft: #cbd5e1;
    --v3-text-sub: #aeb6c5;
    --v3-text-dim: #8b95a7;
    --v3-border: rgba(255, 255, 255, 0.08);
    --v3-border-strong: rgba(255, 255, 255, 0.1);
    --v3-hover: rgba(255, 255, 255, 0.08);
    --v3-hover-light: rgba(255, 255, 255, 0.04);
    --v3-active-bg: rgba(99, 102, 241, 0.22);
    --v3-accent-glow: rgba(99, 102, 241, 0.25);
    --v3-accent-underline: #8b5cf6;
  }

  :global([data-theme="light"]) {
    --v3-bg: #f3f4f6;
    --v3-surface: #ffffff;
    --v3-surface-alt: #f9fafb;
    --v3-panel: #ffffff;
    --v3-panel-deeper: #f3f4f6;
    --v3-text: #111827;
    --v3-text-muted: #6b7280;
    --v3-text-soft: #374151;
    --v3-text-sub: #4b5563;
    --v3-text-dim: #9ca3af;
    --v3-border: rgba(0, 0, 0, 0.08);
    --v3-border-strong: rgba(0, 0, 0, 0.12);
    --v3-hover: rgba(0, 0, 0, 0.06);
    --v3-hover-light: rgba(0, 0, 0, 0.03);
    --v3-active-bg: rgba(99, 102, 241, 0.15);
    --v3-accent-glow: rgba(99, 102, 241, 0.12);
    --v3-accent-underline: #6366f1;
  }

  :global(html),
  :global(body),
  :global(#app) {
    height: 100%;
    margin: 0;
  }

  :global(body) {
    overflow: hidden;
    background: var(--v3-bg);
    color: var(--v3-text);
  }

  button,
  select {
    font: inherit;
  }

  .main-v1-3-shell {
    height: 100vh;
    display: grid;
    grid-template-rows: 38px 34px minmax(0, 1fr) 24px;
    background: var(--v3-bg);
    color: var(--v3-text);
  }

  .top-row,
  .top-bar,
  .status-bar {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--v3-border);
    background: var(--v3-surface);
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
    border-right: 1px solid var(--v3-border);
    background: transparent;
    color: var(--v3-text-sub);
    cursor: pointer;
    display: grid;
    place-content: center;
    gap: 1px;
    text-align: left;
  }

  .top-tab span {
    opacity: 0.68;
  }

  .top-tab strong {
    font-weight: 600;
  }

  .top-tab.active {
    color: var(--v3-text);
    background: linear-gradient(180deg, var(--v3-accent-glow), rgba(99, 102, 241, 0.07));
    box-shadow: inset 0 -2px 0 var(--v3-accent-underline);
  }

  .version-chip {
    height: 24px;
    margin-left: 8px;
    padding: 0 10px;
    border: 1px solid var(--v3-border-strong);
    border-radius: 999px;
    background: var(--v3-hover-light);
    color: var(--v3-text-soft);
    cursor: pointer;
  }

  .top-row-drag-zone {
    flex: 1;
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--v3-text-dim);
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
    color: var(--v3-text-soft);
    background: transparent;
    cursor: pointer;
  }

  .icon-btn,
  .win-btn {
    width: 42px;
    height: 38px;
  }

  .icon-btn-narrow {
    width: 30px;
  }

  .icon-btn:hover,
  .win-btn:hover,
  .toolbar-btn:hover,
  .p4-actions button:hover,
  .p4-tabs button:hover,
  .tab-strip button:hover {
    background: var(--v3-hover);
  }

  .win-btn.close:hover {
    background: #dc2626;
    color: #ffffff;
  }

  .top-bar {
    gap: 8px;
    padding: 0 10px;
    background: var(--v3-surface-alt);
  }

  .toolbar-btn {
    height: 24px;
    padding: 0 10px;
    border-radius: 6px;
    background: var(--v3-hover-light);
  }

  .toolbar-center {
    min-width: 0;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--v3-text-muted);
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
    border-right: 1px solid var(--v3-border);
    background: var(--v3-panel);
  }

  .panel.hidden {
    display: none;
  }

  .agent-left #P4 {
    order: -1;
    border-left: 0;
    border-right: 1px solid var(--v3-border-strong);
  }

  [data-agent-left='true'] .p0 { order: 4; }
  [data-agent-left='true'] .p1 { order: 3; }
  [data-agent-left='true'] .p2 { order: 2; }
  [data-agent-left='true'] .p3 { order: 1; }
  [data-agent-left='true'] .p4 { order: 0; }

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
    color: var(--v3-text-muted);
    background: var(--v3-hover-light);
  }

  .rail-item.active {
    color: var(--v3-text);
    background: var(--v3-active-bg);
  }

  .rail-spacer {
    flex: 1;
  }

  .p1 {
    min-width: 120px;
    max-width: 400px;
  }

  .p2 {
    min-width: 150px;
    max-width: 500px;
  }

  .p3 {
    flex: 1 1 auto;
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    background: var(--v3-bg);
    position: relative;
    overflow: hidden;
  }

  .p3.has-maximized {
    grid-template-rows: 0fr 1fr;
  }

  .p3.has-maximized .p3h1 {
    display: none;
  }

  .p3h1 {
    min-height: 0;
    overflow: hidden;
  }

  .p3h2-zone {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .p3h2.hidden {
    display: none;
  }

  .p3h2 {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: var(--p3h2-full, 192px);
    transition: height 0.25s ease;
  }

  .p3h2.maximized {
    position: absolute;
    inset: 0;
    z-index: 10;
    height: auto !important;
  }

  .p3h2:not(.pinned):not(.slide-visible) {
    height: 32px !important;
  }

  .p3h2-body {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: var(--v3-panel-deeper);
  }

  .p3h2-actions .pin-rotated {
    transform: rotate(45deg);
  }

  .p3h2-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    flex-shrink: 0;
    background: var(--v3-surface);
    border-bottom: 1px solid var(--v3-border);
  }

  .p3h2-actions {
    display: flex;
    align-items: center;
    gap: 2px;
    padding-right: 4px;
  }

  .p3h2-actions button {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    color: var(--v3-text-muted);
    background: transparent;
    cursor: pointer;
    border-radius: 4px;
  }

  .p3h2-actions button:hover {
    background: var(--v3-border-strong);
    color: var(--v3-text);
  }

  .p4 {
    display: flex;
    flex-direction: column;
    background: var(--v3-surface-alt);
  }

  [data-agent-left='true'] .p4 {
    flex-basis: auto;
  }

  .panel-title {
    height: 34px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    color: var(--v3-text-soft);
    font-weight: 600;
    border-bottom: 1px solid var(--v3-border);
  }

  .tree-row {
    height: 28px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    color: var(--v3-text-sub);
  }

  .tree-row.indent {
    padding-left: 28px;
  }

  .tree-row.active {
    color: var(--v3-text);
    background: var(--v3-active-bg);
  }

  .tab-strip {
    height: 34px;
    background: var(--v3-surface);
    border-bottom: 1px solid var(--v3-border);
  }

  .tab-strip.small {
    height: 30px;
  }

  .tab-strip button,
  .p4-tabs button {
    height: 100%;
    padding: 0 14px;
    border-right: 1px solid var(--v3-border);
  }

  .tab-strip button.active,
  .p4-tabs button.active {
    color: var(--v3-text);
    background: var(--v3-hover);
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
      var(--v3-bg);
  }

  .canvas-card {
    width: min(540px, 70%);
    padding: 28px;
    border: 1px solid var(--v3-border-strong);
    border-radius: 18px;
    background: var(--v3-hover-light);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.22);
  }

  .canvas-card h1 {
    margin: 0 0 6px;
  }

  .canvas-card p {
    color: var(--v3-text-muted);
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
    color: var(--v3-text-muted);
  }

  .p4-header {
    height: 36px;
    flex: 0 0 36px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--v3-border);
    background: var(--v3-surface);
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
    border-left: 1px solid var(--v3-border);
    background: var(--v3-panel-deeper);
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
    background: var(--v3-active-bg);
  }

  .chat-line {
    color: var(--v3-text-soft);
    background: var(--v3-hover-light);
  }

  .chat-line.user {
    background: rgba(56, 189, 248, 0.14);
  }

  .status-bar {
    gap: 12px;
    padding: 0 10px;
    border-top: 1px solid var(--v3-border);
    border-bottom: 0;
    color: var(--v3-text-muted);
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
    border: 1px solid var(--v3-border-strong);
    border-radius: 4px;
    color: var(--v3-text-soft);
    background: var(--v3-bg);
  }
</style>
