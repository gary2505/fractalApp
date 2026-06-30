<script lang="ts">
  export let tabs: string[] = [];
  export let activeTab = '';
  export let p3h2Pinned = false;
  export let p3h2Maximized = false;
  export let p3h2Hover = false;
  export let p3h2Height = 160;
  export let onSelectTab: (tab: string) => void = () => {};
  export let onCloseP3H2: () => void = () => {};
  export let onTogglePinP3H2: () => void = () => {};
  export let onToggleMaximizeP3H2: () => void = () => {};
</script>

<section
  id="p3h2"
  class="bg-base-200 text-base-content border-t border-base-300 flex flex-col overflow-hidden"
  class:maximized={p3h2Maximized}
  class:pinned={p3h2Pinned}
  class:slide-visible={p3h2Hover}
  style="--p3h2-full:{p3h2Height + 32}px"
  aria-label="P3H2 terminal panel"
>
  <div class="p3h2-header flex items-center justify-between shrink-0 bg-base-100 border-b border-base-300">
    <div class="tabs tabs-box bg-base-100 rounded-none border-0 p-1">
      {#each tabs as tab (tab)}
        <button id="p3h2-tab-{tab.toLowerCase()}" type="button" class="tab {activeTab === tab ? 'tab-active' : ''}" onclick={() => onSelectTab(tab)}>{tab}</button>
      {/each}
    </div>
    <div class="p3h2-actions flex items-center gap-0.5 pr-1">
      <button id="p3h2-pin-toggle" type="button" class="icon-app-base" title={p3h2Pinned ? 'Unpin terminal' : 'Pin terminal'} onclick={onTogglePinP3H2}>
        <svg class="icon-app-md" viewBox="0 0 512 512" fill="currentColor" class:pin-rotated={p3h2Pinned}>
          <polygon points="419.286,301.002 416.907,248.852 357.473,219.867 337.487,55.355 369.774,38.438 369.774,0 286.751,0 225.249,0 142.219,0 142.219,38.438 174.509,55.355 154.52,219.867 95.096,248.852 92.714,301.002 256.001,301.002"></polygon>
          <polygon points="231.399,465.871 254.464,512 277.522,465.871 277.522,315.194 231.399,315.194"></polygon>
        </svg>
      </button>
      <button id="p3h2-maximize-toggle" type="button" class="icon-app-base" title={p3h2Maximized ? 'Restore terminal' : 'Maximize terminal'} onclick={onToggleMaximizeP3H2}>
        <svg class="icon-app-md" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 19h3v2H3v-5h2zm16 2h-5v-2h3v-3h2zM8 5H5v3H3V3h5zm13 3h-2V5h-3V3h5z"></path>
        </svg>
      </button>
      <button id="p3h2-close" type="button" class="icon-app-base" title="Close terminal" onclick={onCloseP3H2}>
        <svg class="icon-app-md" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z"></path>
        </svg>
      </button>
    </div>
  </div>
  <div class="p-3 overflow-auto flex-1 min-h-0" style="height:{p3h2Height}px">
    <div class="opacity-70">{activeTab}: ready</div>
    <div>Ctrl+J opens / closes this panel.</div>
  </div>
</section>

<style>
  .p3h2-header {
    height: 32px;
  }

  .p3h2-actions .pin-rotated {
    transform: rotate(45deg);
  }

  section {
    height: var(--p3h2-full, 192px);
    transition: height 0.25s ease;
  }

  section.maximized {
    position: absolute;
    inset: 0;
    z-index: 10;
    height: auto !important;
  }

  section:not(.pinned):not(.slide-visible) {
    height: 32px !important;
    overflow: hidden;
  }
</style>
