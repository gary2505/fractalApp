<script lang="ts">
  import P3H1 from '../p3/p3h1/p3h1-v1-0.svelte';
  import P3H2 from '../p3/p3h2/p3h2-v1-0.svelte';

  export let activeRole = 'AI Editor';
  export let p3h2Hidden = false;

  const p3h1Tabs = ['Editor', 'Preview', 'Diff', 'Plan'];
  const p3h2Tabs = ['Terminal', 'Problems', 'Logs', 'Proof'];

  let activeP3H1Tab = p3h1Tabs[0]!;
  let activeP3H2Tab = p3h2Tabs[0]!;
</script>

<main id="P3" class="flex-1 min-w-0 bg-base-100 text-base-content flex flex-col" aria-label="P3 main orchestra panel">
  <P3H1 tabs={p3h1Tabs} activeTab={activeP3H1Tab} {activeRole} onSelectTab={(tab: string) => (activeP3H1Tab = tab)} />
  {#if !p3h2Hidden}
    <P3H2 tabs={p3h2Tabs} activeTab={activeP3H2Tab} onSelectTab={(tab: string) => (activeP3H2Tab = tab)} />
  {/if}
</main>
