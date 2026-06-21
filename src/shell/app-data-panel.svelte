<script lang="ts">
  import { onMount } from 'svelte';
  import { readAppDataStatus, type AppDataStatus } from '../core/app-data/app-data';
  import { t } from '../core/i18n/i18n';

  let status: AppDataStatus | null = null;
  let error = '';
  let open = false;

  async function refresh() {
    error = '';
    try {
      status = await readAppDataStatus();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
  }

  onMount(() => void refresh());
</script>

<section class="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
  <div class="flex items-center justify-between gap-2">
    <h2 class="text-sm font-semibold">{$t('appdata.title')}</h2>
    <button class="btn btn-xs" type="button" onclick={() => (open = !open)}>
      {open ? $t('action.hide') : $t('action.show')}
    </button>
  </div>

  {#if open}
    <button class="btn btn-xs mt-3" type="button" onclick={refresh}>{$t('action.refresh')}</button>
    {#if error}
      <div class="alert alert-error mt-3 py-2 text-xs">{error}</div>
    {:else if status}
      <dl class="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1 text-xs">
        <div><dt class="opacity-60">{$t('appdata.root')}</dt><dd class="break-all">{status.root}</dd></div>
        <div><dt class="opacity-60">{$t('appdata.manifest')}</dt><dd class="break-all">{status.manifestFile}</dd></div>
        <div><dt class="opacity-60">{$t('appdata.session')}</dt><dd class="break-all">{status.sessionFile}</dd></div>
        <div><dt class="opacity-60">{$t('appdata.components')}</dt><dd class="break-all">{status.componentRoot}</dd></div>
      </dl>
    {/if}
  {/if}
</section>
