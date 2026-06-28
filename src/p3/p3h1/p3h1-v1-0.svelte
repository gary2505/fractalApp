<script lang="ts">
  export let tabs: string[] = [];
  export let activeTab = '';
  export let activeRole = 'AI Editor';
  export let onSelectTab: (tab: string) => void = () => {};
</script>

<section id="P3H1" class="flex-1 min-h-0 bg-base-100 text-base-content flex flex-col" aria-label="P3H1 editor panel">
  <div class="tabs tabs-box bg-base-200 rounded-none border-b border-base-300 p-1">
    {#each tabs as tab (tab)}
      <button type="button" class="tab {activeTab === tab ? 'tab-active' : ''}" onclick={() => onSelectTab(tab)}>{tab}</button>
    {/each}
    <button type="button" class="tab ml-auto" title="More editor tabs">⋯</button>
  </div>
  <div class="flex-1 min-h-0 p-4 overflow-auto">
    <div class="mockup-code bg-base-200 text-base-content border border-base-300">
      <pre data-prefix="#"><code>{activeRole}</code></pre>
      <pre data-prefix="1"><code>main-v1-4 layout owner</code></pre>
      <pre data-prefix="2"><code>P0 P1 P2 P3 P4 / P3H1 P3H2 / P4V1 P4V2</code></pre>
      <pre data-prefix="3"><code>{activeTab}: ready</code></pre>
    </div>
  </div>
</section>
