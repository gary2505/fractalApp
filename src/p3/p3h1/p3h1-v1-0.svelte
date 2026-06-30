<script lang="ts">
  import { onMount } from 'svelte';

  export let tabs: string[] = [];
  export let activeTab = '';
  export let activeRole = 'AI Editor';
  export let onSelectTab: (tab: string) => void = () => {};

  let isFullscreen = false;
  // 🔍 SEARCH: p3h1 fullscreen — isolates only the p3h1 panel
  let p3h1El: HTMLElement;

  function toggleFullscreen() {
    if (!isFullscreen) {
      p3h1El?.requestFullscreen().then(() => {
        isFullscreen = true;
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        isFullscreen = false;
      }).catch(() => {});
    }
  }

  function onFullscreenChange() {
    isFullscreen = !!document.fullscreenElement;
  }

  onMount(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  });
</script>

<section id="p3h1" class="flex-1 min-h-0 bg-base-100 text-base-content flex flex-col" aria-label="P3H1 editor panel" bind:this={p3h1El}>
  <div class="tabs tabs-box bg-base-200 rounded-none border-b border-base-300 p-1 flex items-center">
    <div id="p3h1-header-left" class="flex items-center">
      {#each tabs as tab (tab)}
        <button id="p3h1-tab-{tab.toLowerCase()}" type="button" class="tab {activeTab === tab ? 'tab-active' : ''}" onclick={() => onSelectTab(tab)}>{tab}</button>
      {/each}
    </div>
    <div id="p3h1-header-right" class="flex items-center ml-auto">
      <button id="p3h1-fullscreen" type="button" class="tab" title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Full Screen'} onclick={toggleFullscreen}>
        {#if isFullscreen}
          <svg class="icon-app-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
          </svg>
        {:else}
          <svg class="icon-app-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        {/if}
      </button>
      <button id="p3h1-more-action" type="button" class="tab" title="More Actions">⋯</button>
    </div>
  </div>
  <div class="flex-1 min-h-0 p-4 overflow-auto">
    <div class="mockup-code bg-base-200 text-base-content border border-base-300">
      <pre data-prefix="#"><code>{activeRole}</code></pre>
      <pre data-prefix="1"><code>main-v1-4 layout owner</code></pre>
      <pre data-prefix="2"><code>p0 p1 p2 p3 p4 / p3h1 p3h2 / p4v1 p4v2</code></pre>
      <pre data-prefix="3"><code>{activeTab}: ready</code></pre>
    </div>
  </div>
</section>
