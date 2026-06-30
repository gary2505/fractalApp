<script lang="ts">
  import P3H1 from '../p3/p3h1/p3h1-v1-0.svelte';
  import P3H2 from '../p3/p3h2/p3h2-v1-0.svelte';
  import PanelResizer from '../main-window/PanelResizer.svelte';

  export let activeRole = 'AI Editor';
  export let p3h2Hidden = false;
  export let p3h2Pinned = false;
  export let p3h2Maximized = false;
  export let p3h2Hover = false;
  export let p3h2Height = 160;
  export let onCloseP3H2: () => void = () => {};
  export let onTogglePinP3H2: () => void = () => {};
  export let onToggleMaximizeP3H2: () => void = () => {};
  export let onResizeP3H2: (delta: number) => void = () => {};
  export let onP3H2MouseEnter: () => void = () => {};
  export let onP3H2MouseLeave: () => void = () => {};

  const p3h1Tabs = ['Editor', 'Preview', 'Diff', 'Plan'];
  const p3h2Tabs = ['Terminal', 'Problems', 'Logs', 'Proof'];

  let activeP3H1Tab = p3h1Tabs[0]!;
  let activeP3H2Tab = p3h2Tabs[0]!;
</script>

<main id="p3" class="flex-1 min-w-0 bg-base-100 text-base-content overflow-hidden" class:has-maximized={p3h2Maximized} aria-label="P3 main orchestra panel">
  <P3H1 tabs={p3h1Tabs} activeTab={activeP3H1Tab} {activeRole} onSelectTab={(tab: string) => (activeP3H1Tab = tab)} />
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="p3h2-zone" onmouseenter={onP3H2MouseEnter} onmouseleave={onP3H2MouseLeave}>
    <PanelResizer direction="horizontal" onResize={(d: number) => onResizeP3H2(-d)} />
    {#if !p3h2Hidden}
      <P3H2 tabs={p3h2Tabs} activeTab={activeP3H2Tab} {p3h2Pinned} {p3h2Maximized} {p3h2Hover} {p3h2Height} onSelectTab={(tab: string) => (activeP3H2Tab = tab)} {onCloseP3H2} {onTogglePinP3H2} {onToggleMaximizeP3H2} />
    {/if}
  </div>
</main>

<style>
  main {
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    position: relative;
  }

  main.has-maximized {
    grid-template-rows: 0fr 1fr;
  }

  main.has-maximized :global(.p3h1) {
    display: none;
  }

  .p3h2-zone {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
</style>
