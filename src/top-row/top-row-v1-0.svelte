<script lang="ts">
  export type TopTab = {
    id: string;
    label: string;
    role: string;
  };

  export let tabs: TopTab[] = [];
  export let activeTabId = '';
  export let activeRole = '';
  export let p3h2Hidden = false;
  export let onSelectTab: (id: string) => void = () => {};
  export let onToggleP3H2: () => void = () => {};
  export let onSwitchAgentSide: () => void = () => {};
  export let onMinimize: () => void | Promise<void> = () => {};
  export let onToggleMaximize: () => void | Promise<void> = () => {};
  export let onClose: () => void | Promise<void> = () => {};
  export let onStartDrag: () => void | Promise<void> = () => {};
</script>

<header id="TopRow" class="navbar min-h-0 h-10 bg-base-200 text-base-content border-b border-base-300 px-2 gap-2">
  <div class="flex items-center gap-1">
    {#each tabs as tab (tab.id)}
      <button
        type="button"
        class="btn btn-ghost min-h-0 h-8 px-3 rounded-btn {activeTabId === tab.id ? 'btn-active' : ''}"
        aria-pressed={activeTabId === tab.id}
        title={tab.role}
        onclick={() => onSelectTab(tab.id)}
      >
        <span>{tab.label}</span>
        <span class="opacity-70">{tab.role}</span>
      </button>
    {/each}
  </div>

  <button
    type="button"
    class="btn btn-ghost min-h-0 h-8 px-3 rounded-btn flex-1 justify-start cursor-default"
    title="Drag window"
    onpointerdown={() => void onStartDrag()}
  >
    {activeRole}
  </button>

  <div class="flex items-center gap-1">
    <button
      type="button"
      class="btn btn-ghost min-h-0 h-8 px-3 rounded-btn"
      title={p3h2Hidden ? 'Open terminal panel Ctrl+J' : 'Close terminal panel Ctrl+J'}
      onclick={onToggleP3H2}
    >
      {#if p3h2Hidden}▣{:else}▤{/if}
    </button>
    <button
      type="button"
      class="btn btn-ghost min-h-0 h-8 px-3 rounded-btn"
      title="Switch Agent side Ctrl+E"
      onclick={onSwitchAgentSide}
    >
      ⇄
    </button>
    <button type="button" class="btn btn-ghost min-h-0 h-8 px-3 rounded-btn" title="Minimize" onclick={() => void onMinimize()}>−</button>
    <button type="button" class="btn btn-ghost min-h-0 h-8 px-3 rounded-btn" title="Maximize / Restore" onclick={() => void onToggleMaximize()}>□</button>
    <button type="button" class="btn btn-ghost min-h-0 h-8 px-3 rounded-btn" title="Close" onclick={() => void onClose()}>×</button>
  </div>
</header>
