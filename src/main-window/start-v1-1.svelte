<script lang="ts">
  import type { MainWindowVersionId, WindowVersion } from './versions';

  export let activeVersionId: MainWindowVersionId;
  export let versions: WindowVersion<MainWindowVersionId>[];
  export let onSelectVersion: (versionId: MainWindowVersionId) => void;
  export let onClose: () => void;

  function selectVersion(versionId: MainWindowVersionId) {
    onSelectVersion(versionId);
  }

  function close() {
    onClose();
  }
</script>

<svelte:window
  on:keydown={(event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  }}
/>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-base-300/60 p-6 text-base-content">
  <section class="w-full max-w-sm rounded-box border border-base-300 bg-base-100 p-4 shadow-xl">
    <div class="mb-4 flex items-center justify-between gap-3">
      <div>
        <div class="text-xs font-semibold uppercase tracking-wide opacity-60">fractalApp</div>
        <h1 class="text-xl font-bold">Main versions</h1>
      </div>

      <button class="btn btn-sm btn-ghost" type="button" aria-label="Close" on:click={close}>✕</button>
    </div>

    <div class="space-y-2">
      {#each versions as version}
        <button
          class="btn w-full justify-between"
          class:btn-primary={version.id === activeVersionId}
          class:btn-outline={version.id !== activeVersionId}
          type="button"
          on:click={() => selectVersion(version.id)}
        >
          <span>{version.shortLabel}</span>
          {#if version.id === activeVersionId}
            <span class="badge badge-sm">active</span>
          {/if}
        </button>
      {/each}
    </div>

    <p class="mt-4 text-xs opacity-60">Click version = open it and make it default. Esc or ✕ closes this switcher.</p>
  </section>
</div>
