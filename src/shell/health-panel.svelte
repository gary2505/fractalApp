<script lang="ts">
  import { onMount } from 'svelte';
  import { healthCheck, repairAppData, resetManifest, type HealthReport } from '../core/health/health';

  let report: HealthReport | null = null;
  let message = '';
  let busy = false;

  onMount(() => refresh());

  async function run(task: () => Promise<HealthReport>, okMessage: string) {
    busy = true;
    message = '';
    try {
      report = await task();
      message = okMessage;
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    } finally {
      busy = false;
    }
  }

  function refresh() {
    return run(healthCheck, 'health checked');
  }
</script>

<section class="rounded-box border border-base-300 bg-base-100 p-3 shadow-sm">
  <div class="mb-2 flex items-center justify-between gap-2">
    <h2 class="font-semibold">Health / Recovery</h2>
    {#if report}
      <span class:badge-success={report.ok} class:badge-error={!report.ok} class="badge badge-sm">
        {report.ok ? 'OK' : 'Needs repair'}
      </span>
    {/if}
  </div>

  <div class="mb-2 grid grid-cols-3 gap-2">
    <button class="btn btn-xs" disabled={busy} onclick={refresh}>Check</button>
    <button class="btn btn-xs" disabled={busy} onclick={() => run(repairAppData, 'app-data repaired')}>Repair</button>
    <button class="btn btn-xs btn-warning" disabled={busy} onclick={() => run(resetManifest, 'manifest reset')}>Reset MF</button>
  </div>

  {#if message}
    <p class="mb-2 text-xs opacity-70">{message}</p>
  {/if}

  {#if report}
    <p class="mb-2 break-all text-xs opacity-70">{report.root}</p>
    <div class="max-h-36 space-y-1 overflow-auto text-xs">
      {#each report.items as item}
        <div class="flex items-start gap-2">
          <span
            class:badge-success={item.level === 'ok'}
            class:badge-warning={item.level === 'warn'}
            class:badge-error={item.level === 'err'}
            class="badge badge-xs mt-0.5"
          >
            {item.level}
          </span>
          <div>
            <div class="font-medium">{item.label}</div>
            <div class="opacity-70">{item.message}</div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>
