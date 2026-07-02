<script lang="ts">
  import { onMount } from 'svelte';

  import TopRow from '../top-row/top-row-v1-0.svelte';
  import TopBar from '../top-bar/top-bar-v1-0.svelte';
  import P0 from '../p0/p0-v1-0.svelte';
  import P1 from '../p1/p1-v1-0.svelte';
  import P2 from '../p2/p2-v1-0.svelte';
  import P3 from '../p3/p3-v1-0.svelte';
  import P4 from '../p4/p4-v1-0.svelte';
  import SBar from '../status-bar/status-bar-v1-0.svelte';
  import { closeWindow, initializeWindow, minimizeWindow, startDragging, toggleMaximize } from '$lib/tauri/window';
  import { applyTheme } from '../core/theme/theme';
  import { logPanelToggle } from '../core/log/smart-log-app-flow';
  import PanelResizer from './PanelResizer.svelte';

  type LangMode = 'EN' | 'RU';
  type ThemeMode = 'dark' | 'light';

  type TopTab = {
    id: 'ai-editor' | 'file-explorer' | 'analysis' | 'review';
    label: string;
    role: string;
  };

  const versionId = 'main-v1-4';
  const topTabs: TopTab[] = [
    { id: 'ai-editor', label: 'Tab 1', role: 'AI Editor' },
    { id: 'file-explorer', label: 'Tab 2', role: 'File Explorer' },
    { id: 'analysis', label: 'Tab 3', role: 'Analysis' },
    { id: 'review', label: 'Tab 4', role: 'Review' }
  ];
  const p4Tabs = ['Chat', 'Chat 2', 'Chat 3'];

  let activeTopTab: TopTab['id'] = $state('ai-editor');
  let activeP4Tab = $state(p4Tabs[0]);
  let leftPanelMode = $state(0);
  let p2HiddenByToggle = $state(false);
  let p3h2Hidden = $state(false);
  let p3h2Pinned = $state(true);
  let p3h2Maximized = $state(false);
  let p3h2Hover = $state(false);
  let p3h2ShowTimer: ReturnType<typeof setTimeout> | undefined;
  let p3h2HideTimer: ReturnType<typeof setTimeout> | undefined;
  let p3h2Height = $state(160);
  let p1Width = $state(168);
  let p2Width = $state(250);
  let p4Width = $state(360);
  let p4Visible = $state(true);
  let p4OnLeft = $state(false);
  let p4v2Visible = $state(false);
  let lang: LangMode = $state('EN');
  let theme: ThemeMode = $state('dark');

  let activeTab = $derived(topTabs.find((tab) => tab.id === activeTopTab));
  let activeRole = $derived(activeTab?.role ?? 'AI Editor');
  let p0Visible = $derived(leftPanelMode === 0 || leftPanelMode === 3);
  let p1Visible = $derived(activeTopTab === 'file-explorer' && (leftPanelMode === 0 || leftPanelMode === 1));
  let p2Visible = $derived(!p2HiddenByToggle);
  let leftToggleLabel = $derived((() => {
    if (leftPanelMode === 0) return 'Hide side panel';
    if (leftPanelMode === 1) return 'Show side panel';
    if (leftPanelMode === 2) return 'Hide files panel';
    return 'Show files panel';
  })());
  let panelToggleTitle = $derived((() => {
    if (leftPanelMode === 0) return 'Hide side panel';
    if (leftPanelMode === 1) return 'Show side panel';
    if (leftPanelMode === 2) return 'Hide files panel';
    return 'Show files panel';
  })());
  onMount(() => {
    applyTheme(theme);
    void initializeWindow();

    function onKeydown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      if (event.ctrlKey && key === 'e') {
        event.preventDefault();
        toggleAgentSide();
        void logPanelToggle('P1', !p4OnLeft);
        return;
      }

      if (event.ctrlKey && !event.altKey && key === 'b') {
        event.preventDefault();
        p2HiddenByToggle = !p2HiddenByToggle;
        void logPanelToggle('P0', !p2HiddenByToggle);
        return;
      }

      if (event.ctrlKey && key === 'j') {
        event.preventDefault();
        cycleP3H2();
        return;
      }

      if (event.ctrlKey && event.altKey && key === 'b') {
        event.preventDefault();
        toggleP4();
        return;
      }

      if (event.key === 'Escape' && p4v2Visible) {
        event.preventDefault();
        p4v2Visible = false;
        return;
      }

      if (event.key === 'Home' && !isEditingTarget(event.target)) {
        event.preventDefault();
        selectTopTab(topTabs[0]!.id);
        return;
      }

      if (event.key === 'End' && !isEditingTarget(event.target)) {
        event.preventDefault();
        selectTopTab(topTabs[topTabs.length - 1]!.id);
      }
    }

    window.addEventListener('keydown', onKeydown);

    function onP2Close() {
      p2HiddenByToggle = true;
    }
    window.addEventListener('p2-close', onP2Close);

    return () => {
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('p2-close', onP2Close);
    };
  });

  function selectTopTab(id: string) {
    const nextTab = topTabs.find((tab) => tab.id === id);
    if (!nextTab) return;
    activeTopTab = nextTab.id;
  }

  function cycleLeftPanels() {
    leftPanelMode = (leftPanelMode + 1) % 4;
  }

  function cycleP3H2() {
    p3h2Hidden = !p3h2Hidden;
    void logPanelToggle('P3H2', !p3h2Hidden);
  }

  function closeP3H2() {
    p3h2Hidden = true;
  }

  function togglePinP3H2() {
    p3h2Pinned = !p3h2Pinned;
  }

  function toggleMaximizeP3H2() {
    p3h2Maximized = !p3h2Maximized;
    if (p3h2Maximized) p3h2Pinned = true;
  }

  function p3h2OnMouseEnter() {
    clearTimeout(p3h2HideTimer);
    if (!p3h2Pinned) {
      p3h2ShowTimer = setTimeout(() => { p3h2Hover = true; }, 150);
    }
  }

  function p3h2OnMouseLeave() {
    clearTimeout(p3h2ShowTimer);
    if (!p3h2Pinned) {
      p3h2HideTimer = setTimeout(() => { p3h2Hover = false; }, 300);
    }
  }

  function resizeP1(delta: number) { p1Width = Math.max(120, Math.min(400, p1Width + delta)); }
  function resizeP2(delta: number) { p2Width = Math.max(150, Math.min(500, p2Width + delta)); }
  function resizeP4(delta: number) { p4Width = Math.max(280, Math.min(600, p4Width + delta)); }
  function resizeP3H2(delta: number) {
    p3h2Height = Math.max(80, Math.min(600, p3h2Height + delta));
  }

  function toggleAgentSide() {
    p4OnLeft = !p4OnLeft;
    p4Visible = true;
  }

  function toggleP4() {
    p4Visible = !p4Visible;
    if (p4Visible) p4v2Visible = false;
    void logPanelToggle('P4', p4Visible);
  }

  function closeP4() {
    p4Visible = false;
    p4v2Visible = false;
  }

  function isEditingTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
  }
</script>

<svelte:head>
  <title>fractalApp {versionId}</title>
</svelte:head>

<div class="h-screen min-h-0 bg-base-100 text-base-content flex flex-col overflow-hidden">
  <TopRow
    tabs={topTabs}
    activeTabId={activeTopTab}
    {activeRole}
    {p3h2Hidden}
    onSelectTab={selectTopTab}
    onToggleP3H2={cycleP3H2}
    onSwitchAgentSide={toggleAgentSide}
    onMinimize={minimizeWindow}
    onToggleMaximize={toggleMaximize}
    onClose={closeWindow}
    onStartDrag={startDragging}
  />

  <TopBar
    activeRole={activeRole}
    panelToggleTitle={panelToggleTitle}
    {p4Visible}
    {p4OnLeft}
    onToggleLeftPanels={cycleLeftPanels}
    onToggleP4={toggleP4}
  />

  <section id="main-row" class="flex-1 min-h-0 bg-base-100 text-base-content flex overflow-hidden">
    {#if p4Visible && p4OnLeft}
      <div style="width:{p4Width}px; flex:0 0 {p4Width}px;" class="overflow-hidden [&>aside]:w-full!">
        <P4 tabs={p4Tabs} activeTab={activeP4Tab!} sidebarVisible={p4v2Visible} onSelectTab={(tab: string) => (activeP4Tab = tab)} onToggleSidebar={() => (p4v2Visible = !p4v2Visible)} onClose={closeP4} />
      </div>
      <PanelResizer direction="vertical" onResize={(d) => resizeP4(-d)} />
    {/if}

    {#if p0Visible}
      <P0 />
    {/if}

    {#if p1Visible}
      <div style="width:{p1Width}px; flex:0 0 {p1Width}px;" class="overflow-hidden [&>aside]:w-full!">
        <P1 />
      </div>
      <PanelResizer direction="vertical" onResize={resizeP1} />
    {/if}

    {#if p2Visible}
      <div style="width:{p2Width}px; flex:0 0 {p2Width}px;" class="overflow-hidden [&>aside]:w-full!">
        <P2 />
      </div>
      <PanelResizer direction="vertical" onResize={resizeP2} />
    {/if}

    <P3 {activeRole} {p3h2Hidden} {p3h2Pinned} {p3h2Maximized} {p3h2Hover} {p3h2Height} onCloseP3H2={closeP3H2} onTogglePinP3H2={togglePinP3H2} onToggleMaximizeP3H2={toggleMaximizeP3H2} onResizeP3H2={resizeP3H2} onP3H2MouseEnter={p3h2OnMouseEnter} onP3H2MouseLeave={p3h2OnMouseLeave} />

    {#if p4Visible && !p4OnLeft}
      <PanelResizer direction="vertical" onResize={(d) => resizeP4(-d)} />
      <div style="width:{p4Width}px; flex:0 0 {p4Width}px;" class="overflow-hidden [&>aside]:w-full!">
        <P4 tabs={p4Tabs} activeTab={activeP4Tab!} sidebarVisible={p4v2Visible} onSelectTab={(tab: string) => (activeP4Tab = tab)} onToggleSidebar={() => (p4v2Visible = !p4v2Visible)} onClose={closeP4} />
      </div>
    {/if}
  </section>

  <SBar {versionId} {lang} {theme} onChangeLang={(value) => (lang = value)} onChangeTheme={(value) => { theme = value; applyTheme(value); }} />
</div>
