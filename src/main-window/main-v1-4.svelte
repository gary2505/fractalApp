<script lang="ts">
  import { onMount } from 'svelte';

  import TopRow from '../top-row/top-row-v1-0.svelte';
  import TopBar from '../top-bar/top-bar-v1-0.svelte';
  import P0 from '../p0/p0-v1-0.svelte';
  import P1 from '../p1/p1-v1-0.svelte';
  import P2 from '../p2/p2-v1-0.svelte';
  import P3 from '../p3/p3-v1-0.svelte';
  import P4 from '../p4/p4-v1-0.svelte';
  import SBar from '../sbar/sbar-v1-0.svelte';
  import { closeWindow, initializeWindow, minimizeWindow, startDragging, toggleMaximize } from '$lib/tauri/window';

  type LangMode = 'EN' | 'RU';
  type ThemeMode = 'system' | 'dark' | 'light';

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

  let activeTopTab: TopTab['id'] = 'ai-editor';
  let activeP4Tab = p4Tabs[0];
  let leftPanelMode = 0;
  let p2HiddenByToggle = false;
  let p3h2Hidden = false;
  let p4Visible = true;
  let p4OnLeft = false;
  let p4v2Visible = false;
  let lang: LangMode = 'EN';
  let theme: ThemeMode = 'system';

  $: activeTab = topTabs.find((tab) => tab.id === activeTopTab);
  $: activeRole = activeTab?.role ?? 'AI Editor';
  $: p0Visible = leftPanelMode === 0 || leftPanelMode === 3;
  $: p1Visible = activeTopTab === 'file-explorer' && (leftPanelMode === 0 || leftPanelMode === 1);
  $: p2Visible = !p2HiddenByToggle;
  $: leftToggleLabel = ['Hide P0', 'Hide P0 + P1', 'Hide P1', 'Show P0 + P1'][leftPanelMode] ?? 'Show P0 + P1';
  $: status = `${activeRole} / ${p4Visible ? 'AI chat open' : 'AI chat closed'}`;

  onMount(() => {
    void initializeWindow();

    function onKeydown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      if (event.ctrlKey && key === 'e') {
        event.preventDefault();
        toggleAgentSide();
        return;
      }

      if (event.ctrlKey && !event.altKey && key === 'b') {
        event.preventDefault();
        p2HiddenByToggle = !p2HiddenByToggle;
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
    return () => window.removeEventListener('keydown', onKeydown);
  });

  function selectTopTab(id: string) {
    const nextTab = topTabs.find((tab) => tab.id === id);
    if (!nextTab) return;
    activeTopTab = nextTab.id;
  }

  function selectRole(id: string) {
    const nextTab = topTabs.find((tab) => tab.id === id);
    if (nextTab) selectTopTab(nextTab.id);
  }

  function cycleLeftPanels() {
    leftPanelMode = (leftPanelMode + 1) % 4;
  }

  function cycleP3H2() {
    p3h2Hidden = !p3h2Hidden;
  }

  function toggleAgentSide() {
    p4OnLeft = !p4OnLeft;
    p4Visible = true;
  }

  function toggleP4() {
    p4Visible = !p4Visible;
    if (p4Visible) p4v2Visible = false;
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
    {leftToggleLabel}
    {p2Visible}
    {p4Visible}
    {p4OnLeft}
    {p3h2Hidden}
    onToggleLeftPanels={cycleLeftPanels}
    onToggleP2={() => (p2HiddenByToggle = !p2HiddenByToggle)}
    onToggleP3H2={cycleP3H2}
    onSwitchAgentSide={toggleAgentSide}
    onToggleP4={toggleP4}
  />

  <section id="MainRow" class="flex-1 min-h-0 bg-base-100 text-base-content flex overflow-hidden">
    {#if p4Visible && p4OnLeft}
      <P4 tabs={p4Tabs} activeTab={activeP4Tab!} sidebarVisible={p4v2Visible} onSelectTab={(tab: string) => (activeP4Tab = tab)} onToggleSidebar={() => (p4v2Visible = !p4v2Visible)} onClose={closeP4} />
    {/if}

    {#if p0Visible}
      <P0 {activeRole} onSelectRole={selectRole} />
    {/if}

    {#if p1Visible}
      <P1 />
    {/if}

    {#if p2Visible}
      <P2 />
    {/if}

    <P3 {activeRole} {p3h2Hidden} />

    {#if p4Visible && !p4OnLeft}
      <P4 tabs={p4Tabs} activeTab={activeP4Tab!} sidebarVisible={p4v2Visible} onSelectTab={(tab: string) => (activeP4Tab = tab)} onToggleSidebar={() => (p4v2Visible = !p4v2Visible)} onClose={closeP4} />
    {/if}
  </section>

  <SBar {versionId} {lang} {theme} {status} onChangeLang={(value) => (lang = value)} onChangeTheme={(value) => (theme = value)} />
</div>
