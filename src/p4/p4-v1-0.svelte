<script lang="ts">
  export let tabs: string[] = [];
  export let activeTab = '';
  export let sidebarVisible = false;
  export let onSelectTab: (tab: string) => void = () => {};
  export let onToggleSidebar: () => void = () => {};
  export let onClose: () => void = () => {};
</script>

<aside id="P4" class="w-72 bg-base-100 text-base-content border-l border-base-300 flex flex-col" aria-label="P4 AI agent panel">
  <div class="tabs tabs-box bg-base-200 rounded-none border-b border-base-300 p-1">
    {#each tabs as tab (tab)}
      <button type="button" class="tab {activeTab === tab ? 'tab-active' : ''}" onclick={() => onSelectTab(tab)}>{tab}</button>
    {/each}
    <button type="button" class="tab ml-auto" title="P4 Agent sidebar" onclick={onToggleSidebar}>◧</button>
    <button type="button" class="tab" title="Close AI chat panel" onclick={onClose}>×</button>
  </div>
  <div class="flex flex-1 min-h-0">
    <section id="P4V1" class="flex-1 min-w-0 p-3 overflow-auto" aria-label="P4V1 agent chat">
      <div class="font-semibold">{activeTab}</div>
      <div class="chat chat-start">
        <div class="chat-bubble chat-bubble-neutral">Agent: ready for small verified patches.</div>
      </div>
      <div class="chat chat-end">
        <div class="chat-bubble">User: vibe coding workspace.</div>
      </div>
    </section>
    {#if sidebarVisible}
      <section id="P4V2" class="w-24 bg-base-200 border-l border-base-300 p-2 flex flex-col gap-2" aria-label="P4V2 agent sidebar">
        <div class="font-semibold">Agent Sidebar</div>
        <button type="button" class="btn btn-ghost min-h-0 h-8 px-2">Plan</button>
        <button type="button" class="btn btn-ghost min-h-0 h-8 px-2">Diff</button>
        <button type="button" class="btn btn-ghost min-h-0 h-8 px-2">Proof</button>
        <button type="button" class="btn btn-ghost min-h-0 h-8 px-2">Logs</button>
      </section>
    {/if}
  </div>
</aside>
