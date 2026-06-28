<script lang="ts">
  export let tabs: string[] = [];
  export let activeTab = '';
  export let onSelectTab: (tab: string) => void = () => {};
</script>

<section id="P3H2" class="h-44 bg-base-200 text-base-content border-t border-base-300 flex flex-col" aria-label="P3H2 terminal panel">
  <div class="tabs tabs-box bg-base-100 rounded-none border-b border-base-300 p-1">
    {#each tabs as tab (tab)}
      <button type="button" class="tab {activeTab === tab ? 'tab-active' : ''}" onclick={() => onSelectTab(tab)}>{tab}</button>
    {/each}
  </div>
  <div class="p-3 overflow-auto">
    <div class="opacity-70">{activeTab}: ready</div>
    <div>Ctrl+J opens / closes this panel.</div>
  </div>
</section>
