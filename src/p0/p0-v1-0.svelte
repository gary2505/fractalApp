<script lang="ts">
  const railItems = [
    { id: 'file-explorer', label: 'Files' },
    { id: 'analysis', label: 'Search' },
    { id: 'review', label: 'Git' },
    { id: 'run', label: 'Run' },
    { id: 'settings', label: 'Set' }
  ];
</script>

<aside id="p0" class="w-16 bg-base-200 text-base-content border-r border-base-300 p-1 flex flex-col items-stretch gap-1" aria-label="P0 side rail">
  {#each railItems as item (item.id)}
    <button
      id="p0-rail-{item.id}"
      type="button"
      class="btn btn-ghost min-h-0 h-10 px-1 rounded-btn"
      title={item.label}
      aria-label={item.label}
    >
      {item.label}
    </button>
  {/each}
  <div class="mt-auto flex flex-col items-center gap-1">
    <button id="p0-log" type="button" class="icon-app-base" title="Log">
      <svg class="icon-app-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    </button>
    <button id="p0-refresh" type="button" class="icon-app-base" title="Refresh">
      <svg class="icon-app-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
    </button>
    <button id="p0-settings" type="button" class="icon-app-base" title="Settings">
      <svg class="icon-app-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    </button>
  </div>
</aside>
