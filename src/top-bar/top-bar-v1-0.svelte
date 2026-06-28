<script lang="ts">
  export let leftToggleLabel = 'Hide P0';
  export let p2Visible = true;
  export let p4Visible = true;
  export let p4OnLeft = false;
  export let p3h2Hidden = false;
  export let onToggleLeftPanels: () => void = () => {};
  export let onToggleP2: () => void = () => {};
  export let onToggleP3H2: () => void = () => {};
  export let onSwitchAgentSide: () => void = () => {};
  export let onToggleP4: () => void = () => {};
</script>

<section id="TopBar" class="bg-base-100 text-base-content border-b border-base-300 px-2 py-1 flex items-center gap-2">
  <button type="button" class="btn btn-outline min-h-0 h-8 px-3 rounded-btn" title="Cycle P0/P1 visibility" onclick={onToggleLeftPanels}>
    {leftToggleLabel}
  </button>
  <button type="button" class="btn btn-outline min-h-0 h-8 px-3 rounded-btn" title="Toggle files panel Ctrl+B" onclick={onToggleP2}>
    {p2Visible ? 'Close files' : 'Open files'}
  </button>
  <button type="button" class="btn btn-outline min-h-0 h-8 px-3 rounded-btn" title="Toggle terminal Ctrl+J" onclick={onToggleP3H2}>
    {p3h2Hidden ? 'Open terminal' : 'Close terminal'}
  </button>
  <button type="button" class="btn btn-outline min-h-0 h-8 px-3 rounded-btn" title="Switch Agent side Ctrl+E" onclick={onSwitchAgentSide}>
    Agent {p4OnLeft ? 'left' : 'right'} ⇄
  </button>
  <button type="button" class="btn btn-outline min-h-0 h-8 px-3 rounded-btn" title="Open AI chat panel / Close AI chat panel Ctrl+Alt+B" onclick={onToggleP4}>
    {p4Visible ? 'Close AI chat panel' : 'Open AI chat panel'}
  </button>
  <div class="divider divider-horizontal mx-0"></div>
  <span class="opacity-70">main-v1-4 layout blocks</span>
</section>
