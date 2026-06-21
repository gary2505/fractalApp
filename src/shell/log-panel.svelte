<script lang="ts">
  import { onMount } from 'svelte';
  import { readLastLogs } from '../core/log/log';
  import { t } from '../core/i18n/i18n';
  import type { LogRow } from '../core/log/log';

  let rows: LogRow[] = [];
  let error = '';

  async function refresh() {
    try {
      rows = await readLastLogs(50);
      error = '';
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
  }

  onMount(() => {
    void refresh();
  });
</script>

<section class="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
  <div class="mb-3 flex items-center justify-between gap-2">
    <h2 class="text-sm font-semibold">{$t('log.title')}</h2>
    <button class="btn btn-xs" type="button" onclick={refresh}>{$t('action.refresh')}</button>
  </div>
  {#if error}
    <div class="alert alert-error text-xs">{error}</div>
  {:else if rows.length === 0}
    <div class="text-sm opacity-70">{$t('log.empty')}</div>
  {:else}
    <div class="core-scroll max-h-72 space-y-2 overflow-auto pr-1">
      {#each rows as row}
        <div class="rounded bg-base-200 p-2 text-xs">
          <div class="flex justify-between gap-2">
            <span class="font-mono font-semibold">{row.id}</span>
            <span class="opacity-60">{row.level}</span>
          </div>
          <div class="mt-1 opacity-70">{row.msg}</div>
        </div>
      {/each}
    </div>
  {/if}
</section>
