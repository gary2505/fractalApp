<script lang="ts">
  import { uiZIndex } from '../../design';
  import { uiSnackbars } from './snackbar-store';

  const variantClass = {
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
    info: 'alert-info',
  } as const;
</script>

<div
  class="fixed bottom-4 right-4 flex w-[min(420px,calc(100vw-32px))] flex-col gap-2"
  style:z-index={uiZIndex.snackbar}
  aria-live="polite"
  aria-relevant="additions removals"
>
  {#each $uiSnackbars as item (item.id)}
    <div class={`alert shadow-lg ${variantClass[item.variant]}`}>
      <span>{item.message}</span>
      <button class="btn btn-ghost btn-xs" type="button" onclick={() => uiSnackbars.remove(item.id)} aria-label="Close">✕</button>
    </div>
  {/each}
</div>
