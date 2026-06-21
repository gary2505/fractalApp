<script lang="ts">
  import { savePathIntent, restorePathIntent } from '../wf/rl/bind';
  import { t } from '../core/i18n/i18n';

  let pathValue = '';
  let restoredPath = '';
  let lastTrace = '';
  let error = '';
  let busy = false;

  async function savePath() {
    busy = true;
    error = '';
    try {
      const patch = await savePathIntent(pathValue);
      restoredPath = patch.changes.lastPath ?? '';
      lastTrace = patch.traceId;
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      busy = false;
    }
  }

  async function restorePath() {
    busy = true;
    error = '';
    try {
      const patch = await restorePathIntent();
      restoredPath = patch.changes.lastPath ?? '';
      pathValue = restoredPath;
      lastTrace = patch.traceId;
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      busy = false;
    }
  }
</script>

<section class="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
  <div class="mb-3 flex items-center justify-between gap-2">
    <h2 class="text-sm font-semibold">{$t('binding.title')}</h2>
    {#if busy}<span class="loading loading-spinner loading-sm"></span>{/if}
  </div>

  <div class="space-y-2">
    <input
      class="input input-bordered input-sm w-full"
      placeholder={$t('binding.pathPlaceholder')}
      bind:value={pathValue}
      disabled={busy}
    />
    <div class="grid grid-cols-2 gap-2">
      <button class="btn btn-sm" type="button" disabled={busy} onclick={savePath}>
        {$t('binding.savePath')}
      </button>
      <button class="btn btn-sm" type="button" disabled={busy} onclick={restorePath}>
        {$t('binding.restorePath')}
      </button>
    </div>
  </div>

  {#if restoredPath}
    <div class="mt-3 rounded-box bg-base-200 p-2 text-xs">
      <div class="opacity-70">{$t('binding.restoredPath')}</div>
      <code class="break-all">{restoredPath}</code>
    </div>
  {/if}

  {#if lastTrace}
    <div class="mt-2 text-xs opacity-70">traceId: {lastTrace}</div>
  {/if}

  {#if error}
    <div class="mt-3 alert alert-error py-2 text-xs">{error}</div>
  {/if}
</section>
