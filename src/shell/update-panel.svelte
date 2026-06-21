<script lang="ts">
  import { prepareLocalCandidate, verifyCandidate, switchVerified } from '../core/update/update';
  import { restorePreviousActive } from '../core/rollback/rollback';
  import { t } from '../core/i18n/i18n';
  import type { UpdateStep } from '../core/update/update';

  export let onChanged: () => void = () => {};

  let busy = false;
  let message = '';
  let error = '';

  async function runStep(action: () => Promise<UpdateStep>, reloadHost = false) {
    busy = true;
    error = '';
    try {
      const result = await action();
      message = `${result.message}${result.activeVersion ? ` (${result.activeVersion})` : ''}`;
      if (reloadHost) onChanged();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      busy = false;
    }
  }
</script>

<section class="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
  <div class="mb-3 flex items-center justify-between gap-2">
    <h2 class="text-sm font-semibold">{$t('update.title')}</h2>
    {#if busy}<span class="loading loading-spinner loading-sm"></span>{/if}
  </div>

  <div class="grid grid-cols-2 gap-2">
    <button class="btn btn-sm" disabled={busy} onclick={() => runStep(prepareLocalCandidate)}>
      {$t('update.prepare')}
    </button>
    <button class="btn btn-sm" disabled={busy} onclick={() => runStep(verifyCandidate)}>
      {$t('update.verify')}
    </button>
    <button class="btn btn-sm btn-primary" disabled={busy} onclick={() => runStep(switchVerified, true)}>
      {$t('update.activate')}
    </button>
    <button class="btn btn-sm btn-warning" disabled={busy} onclick={() => runStep(restorePreviousActive, true)}>
      {$t('update.rollback')}
    </button>
  </div>

  {#if message}
    <div class="mt-3 rounded-box bg-base-200 p-2 text-xs">{message}</div>
  {/if}
  {#if error}
    <div class="mt-3 alert alert-error py-2 text-xs">{error}</div>
  {/if}
</section>
