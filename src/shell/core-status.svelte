<script lang="ts">
  import { coreInfo } from '../core/boot/boot';
  import { coreState } from '../core/state/state';
  import { t } from '../core/i18n/i18n';
</script>

<section class="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
  <h2 class="mb-3 text-sm font-semibold">{$t('core.status')}</h2>
  <div class="space-y-2 text-sm">
    <div class="flex justify-between gap-3">
      <span class="opacity-70">{$t('core.state')}</span>
      <span class="badge badge-primary">{$coreState}</span>
    </div>
    {#if $coreInfo}
      <div class="flex justify-between gap-3">
        <span class="opacity-70">{$t('core.version')}</span>
        <span>{$coreInfo.version}</span>
      </div>
      <div class="flex justify-between gap-3">
        <span class="opacity-70">{$t('core.platform')}</span>
        <span>{$coreInfo.platform}</span>
      </div>
      <div class="pt-2">
        <div class="mb-1 opacity-70">{$t('core.dataDir')}</div>
        <code class="block break-all rounded bg-base-200 p-2 text-xs">{$coreInfo.app_data_dir}</code>
      </div>
    {/if}
  </div>
</section>
