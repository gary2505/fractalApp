<script lang="ts">
  import P3H1 from '../p3/p3h1/p3h1-v1-0.svelte';
  import P3H2 from '../p3/p3h2/p3h2-v1-0.svelte';
  import PanelResizer from '../main-window/PanelResizer.svelte';

  let {
    activeRole = 'AI Editor',
    p3h2Hidden = false,
    p3h2Pinned = false,
    p3h2Maximized = false,
    p3h2Hover = false,
    p3h2Height = 160,
    onCloseP3H2 = () => {},
    onTogglePinP3H2 = () => {},
    onToggleMaximizeP3H2 = () => {},
    onResizeP3H2 = (_delta: number) => {},
    onP3H2MouseEnter = () => {},
    onP3H2MouseLeave = () => {}
  }: {
    activeRole?: string;
    p3h2Hidden?: boolean;
    p3h2Pinned?: boolean;
    p3h2Maximized?: boolean;
    p3h2Hover?: boolean;
    p3h2Height?: number;
    onCloseP3H2?: () => void;
    onTogglePinP3H2?: () => void;
    onToggleMaximizeP3H2?: () => void;
    onResizeP3H2?: (_delta: number) => void;
    onP3H2MouseEnter?: (e: MouseEvent) => void;
    onP3H2MouseLeave?: (e: MouseEvent) => void;
  } = $props();

  const p3h1Tabs = ['Home', 'Editor', 'Preview', 'Diff', 'Plan'];
  const p3h2Tabs = ['Terminal', 'Problems', 'Logs', 'Proof'];

  let activeP3H1Tab = $state(p3h1Tabs[0]!);
  let activeP3H2Tab = $state(p3h2Tabs[0]!);
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
