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

<header id="top-row" class="navbar min-h-0 h-10 bg-base-200 text-base-content border-b border-base-300 px-2 gap-2">
  <div class="flex items-center gap-1">
    {#each tabs as tab (tab.id)}
      <button
        id="top-row-tab-{tab.id}"
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
    id="top-row-drag"
    type="button"
    class="btn btn-ghost min-h-0 h-8 px-3 rounded-btn flex-1 justify-start cursor-default"
    title="Drag window"
    onpointerdown={() => void onStartDrag()}
  >
    {activeRole}
  </button>

  <div class="flex items-center gap-1">
    <button
      id="top-row-terminal-toggle"
      type="button"
      class="btn btn-ghost min-h-0 h-8 px-3 rounded-btn"
      title={p3h2Hidden ? 'Open terminal panel Ctrl+J' : 'Close terminal panel Ctrl+J'}
      onclick={onToggleP3H2}
    >
      {#if p3h2Hidden}
        <svg class="icon-app-lg" viewBox="0 0 52 52" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M46,8H6c-1.1,0-2,0.9-2,2v32c0,1.1,0.9,2,2,2h40c1.1,0,2-0.9,2-2V10C48,8.9,47.1,8,46,8z M44,40H8V12h36V40z"></path>
          <path d="M41,38H11.1c-0.6,0-1-0.4-1-1V27c0-0.6,0.4-1,1-1H41c0.6,0,1,0.4,1,1v10C42,37.6,41.6,38,41,38z"></path>
        </svg>
      {:else}
        <svg class="icon-app-lg" viewBox="0 0 52 52" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M46,8H6c-1.1,0-2,0.9-2,2v32c0,1.1,0.9,2,2,2h40c1.1,0,2-0.9,2-2V10C48,8.9,47.1,8,46,8z M44,40H8V12h36V40z"></path>
          <path d="M41,26H11.1c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1H41c0.6,0,1,0.4,1,1v2C42,25.6,41.6,26,41,26z"></path>
        </svg>
      {/if}
    </button>
    <button
      id="top-row-switch-side"
      type="button"
      class="icon-app-base"
      title="Switch Agent side Ctrl+E"
      onclick={onSwitchAgentSide}
    >
      <svg class="icon-app-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 3L4 7l4 4M4 7h16M16 21l4-4-4-4m4 4H4"/>
      </svg>
    </button>
    <button id="top-row-minimize" type="button" class="icon-app-base" title="Minimize" onclick={() => void onMinimize()}>
      <svg class="icon-app-md" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="10" width="14" height="2" rx="1"/></svg>
    </button>
    <button id="top-row-maximize" type="button" class="icon-app-base" title="Maximize / Restore" onclick={() => void onToggleMaximize()}>
      <svg class="icon-app-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>
    </button>
    <button id="top-row-close" type="button" class="icon-app-base" title="Close" onclick={() => void onClose()}>
      <svg class="icon-app-md" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z"/></svg>
    </button>
  </div>
</header>
