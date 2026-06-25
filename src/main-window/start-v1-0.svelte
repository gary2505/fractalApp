<script lang="ts">
  import {
    getDefaultMainWindowVersionId,
    getLatestMainWindowVersion,
    getNextMainWindowVersion,
    getPreviousMainWindowVersion,
    getStartWindowVersion,
    mainWindowVersions,
    START_WINDOW_VERSION,
    type MainWindowVersionId,
    type StartWindowVersionId
  } from './versions';

  export let currentMainVersionId: MainWindowVersionId;
  export let currentStartVersionId: StartWindowVersionId = START_WINDOW_VERSION;
  export let onOpen: (id: MainWindowVersionId) => void;
  export let onOpenLatest: () => void;
  export let onUpdateForward: () => void;
  export let onRollbackBack: () => void;
  export let onSetDefault: (id: MainWindowVersionId) => void;
  export let onClose: () => void;

  $: defaultMainVersionId = getDefaultMainWindowVersionId();
  $: latestMainVersionId = getLatestMainWindowVersion().id;
  $: previousMainVersion = getPreviousMainWindowVersion(currentMainVersionId);
  $: nextMainVersion = getNextMainWindowVersion(currentMainVersionId);
  $: currentStartVersion = getStartWindowVersion(currentStartVersionId);
</script>

<svelte:head>
  <title>fractalApp Recovery Launcher</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-base-200 p-6 text-base-content">
  <section class="w-full max-w-4xl rounded-box border border-base-300 bg-base-100 p-6 shadow-xl">
    <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="text-sm font-semibold uppercase tracking-wide opacity-60">fractalApp</div>
        <h1 class="text-2xl font-bold">Recovery Launcher</h1>
        <p class="mt-1 max-w-2xl text-sm opacity-70">
          Safe start window for opening, updating, and rolling back versioned main windows.
        </p>
      </div>

      <button class="btn btn-sm btn-ghost" type="button" onclick={onClose}>Close</button>
    </div>

    <div class="mb-5 grid gap-3 md:grid-cols-3">
      <div class="rounded-box border border-base-300 bg-base-200 p-3">
        <div class="text-xs opacity-60">Running main</div>
        <div class="font-mono text-sm font-semibold">{currentMainVersionId}</div>
      </div>

      <div class="rounded-box border border-base-300 bg-base-200 p-3">
        <div class="text-xs opacity-60">Default main</div>
        <div class="font-mono text-sm font-semibold">{defaultMainVersionId}</div>
      </div>

      <div class="rounded-box border border-base-300 bg-base-200 p-3">
        <div class="text-xs opacity-60">Start window</div>
        <div class="font-mono text-sm font-semibold">{currentStartVersion.id}</div>
      </div>
    </div>

    <div class="mb-6 flex flex-wrap gap-2">
      <button class="btn btn-primary btn-sm" type="button" onclick={onOpenLatest}>
        Open latest: {latestMainVersionId}
      </button>

      <button class="btn btn-sm" type="button" onclick={() => onOpen('main-v1-0')}>
        Open main-v1-0
      </button>

      <button class="btn btn-sm" type="button" disabled={!nextMainVersion} onclick={onUpdateForward}>
        Update forward
      </button>

      <button class="btn btn-sm" type="button" disabled={!previousMainVersion} onclick={onRollbackBack}>
        Rollback back
      </button>

      <button class="btn btn-outline btn-sm" type="button" onclick={() => onSetDefault(currentMainVersionId)}>
        Set running as default
      </button>
    </div>

    <div class="overflow-hidden rounded-box border border-base-300">
      <div class="grid grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-base-300 bg-base-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide opacity-70">
        <div>Version</div>
        <div>Status</div>
        <div>Default</div>
        <div>Actions</div>
      </div>

      {#each mainWindowVersions as version}
        <div class="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-b border-base-300 px-3 py-3 last:border-b-0">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-mono text-sm font-semibold">{version.id}</span>
              {#if version.id === currentMainVersionId}
                <span class="badge badge-primary badge-sm">running</span>
              {/if}
              {#if version.id === latestMainVersionId}
                <span class="badge badge-accent badge-sm">latest</span>
              {/if}
            </div>
            <div class="mt-1 text-xs opacity-70">{version.notes}</div>
          </div>

          <div>
            <span class="badge badge-outline badge-sm">{version.status}</span>
          </div>

          <div class="text-center">
            {#if version.id === defaultMainVersionId}
              <span class="badge badge-success badge-sm">yes</span>
            {:else}
              <span class="text-xs opacity-50">no</span>
            {/if}
          </div>

          <div class="flex justify-end gap-2">
            <button class="btn btn-xs" type="button" onclick={() => onOpen(version.id)}>Open</button>
            <button class="btn btn-xs btn-outline" type="button" onclick={() => onSetDefault(version.id)}>
              Set default
            </button>
          </div>
        </div>
      {/each}
    </div>

    <div class="mt-4 rounded-box border border-base-300 bg-base-200 p-3 text-xs opacity-70">
      Shortcut: Ctrl + Alt + Backspace opens this launcher. Future start windows should be added as new files,
      for example start-v1-1, instead of editing {START_WINDOW_VERSION}.
    </div>
  </section>
</div>
