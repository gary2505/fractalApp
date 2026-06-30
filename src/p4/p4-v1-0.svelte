<script lang="ts">
  export let tabs: string[] = [];
  export let activeTab = '';
  export let sidebarVisible = false;
  export let onSelectTab: (tab: string) => void = () => {};
  export let onToggleSidebar: () => void = () => {};
  export let onClose: () => void = () => {};
</script>

<aside id="p4" class="w-72 bg-base-100 text-base-content border-l border-base-300 flex flex-col" aria-label="P4 AI agent panel">
  <div class="tabs tabs-box bg-base-200 rounded-none border-b border-base-300 p-1">
    {#each tabs as tab (tab)}
      <button id="p4-tab-{tab.toLowerCase()}" type="button" class="tab {activeTab === tab ? 'tab-active' : ''}" onclick={() => onSelectTab(tab)}>{tab}</button>
    {/each}
    <button id="p4-sidebar-toggle" type="button" class="icon-app-base ml-auto" title="P4 Agent sidebar" onclick={onToggleSidebar}>
      <svg class="icon-app-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
    </button>
    <button id="p4-close" type="button" class="icon-app-base" title="Close AI chat panel" onclick={onClose}>
      <svg class="icon-app-md" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z"/></svg>
    </button>
  </div>
  <div class="flex flex-1 min-h-0">
    <section id="p4v1" class="flex-1 min-w-0 p-3 overflow-auto" aria-label="P4V1 agent chat">
      <div class="font-semibold">{activeTab}</div>
      <div class="chat chat-start">
        <div class="chat-bubble chat-bubble-neutral">Agent: ready for small verified patches.</div>
      </div>
      <div class="chat chat-end">
        <div class="chat-bubble">User: vibe coding workspace.</div>
      </div>
    </section>
    {#if sidebarVisible}
      <section id="p4v2" class="w-24 bg-base-200 border-l border-base-300 p-2 flex flex-col gap-2" aria-label="P4V2 agent sidebar">
        <div class="font-semibold">Agent Sidebar</div>
        <button id="p4v2-plan" type="button" class="btn btn-ghost min-h-0 h-8 px-2">Plan</button>
        <button id="p4v2-diff" type="button" class="btn btn-ghost min-h-0 h-8 px-2">Diff</button>
        <button id="p4v2-proof" type="button" class="btn btn-ghost min-h-0 h-8 px-2">Proof</button>
        <button id="p4v2-logs" type="button" class="btn btn-ghost min-h-0 h-8 px-2">Logs</button>
      </section>
    {/if}
  </div>
</aside>
