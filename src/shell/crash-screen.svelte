<script lang="ts">
  import { repairCoreStorage, resetCoreManifest } from '../core/recovery/recovery';

  export let message = '';

  let busy = false;
  let status = '';
  let error = '';

  async function runRecovery(action: () => Promise<unknown>, done: string) {
    busy = true;
    status = '';
    error = '';
    try {
      await action();
      status = done;
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      busy = false;
    }
  }

  function retryBoot() {
    window.location.reload();
  }
</script>

<main class="flex min-h-0 flex-1 items-center justify-center p-6">
  <section class="max-w-xl rounded-box border border-error bg-base-100 p-6 shadow-sm">
    <h1 class="text-xl font-semibold text-error">Crash screen</h1>
    <p class="mt-3 text-sm opacity-80">
      A fatal error stopped normal boot. Core fallback UI is still available.
    </p>

    {#if message}
      <pre class="mt-4 max-h-40 overflow-auto rounded bg-base-200 p-3 text-xs">{message}</pre>
    {/if}

    <div class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
      <button class="btn btn-sm" disabled={busy} onclick={() => runRecovery(repairCoreStorage, 'repair completed')}>Repair</button>
      <button class="btn btn-sm btn-warning" disabled={busy} onclick={() => runRecovery(resetCoreManifest, 'manifest reset completed')}>Reset MF</button>
      <button class="btn btn-sm btn-primary" disabled={busy} onclick={retryBoot}>Retry boot</button>
    </div>

    {#if busy}
      <div class="mt-3 text-xs opacity-70">recovery running...</div>
    {/if}
    {#if status}
      <div class="alert alert-success mt-3 py-2 text-xs">{status}. Click Retry boot.</div>
    {/if}
    {#if error}
      <div class="alert alert-error mt-3 py-2 text-xs">{error}</div>
    {/if}
  </section>
</main>
