<script lang="ts">
  export let activeRole = 'AI Editor';
  export let onSelectRole: (id: string) => void = () => {};

  const railItems = [
    { id: 'ai-editor', label: 'AI' },
    { id: 'file-explorer', label: 'Files' },
    { id: 'analysis', label: 'Search' },
    { id: 'review', label: 'Git' },
    { id: 'run', label: 'Run' },
    { id: 'settings', label: 'Set' }
  ];
</script>

<aside id="P0" class="w-16 bg-base-200 text-base-content border-r border-base-300 p-1 flex flex-col items-stretch gap-1" aria-label="P0 side rail">
  {#each railItems as item (item.id)}
    <button
      type="button"
      class="btn btn-ghost min-h-0 h-10 px-1 rounded-btn"
      title={item.label}
      aria-label={item.label}
      onclick={() => onSelectRole(item.id)}
    >
      {item.label}
    </button>
  {/each}
  <div class="mt-auto badge badge-outline justify-center w-full" title={activeRole}>P0</div>
</aside>
