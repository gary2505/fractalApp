<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import { uiZIndex } from '../../design';

  type Props = {
    open: boolean;
    title?: string;
    closeOnBackdrop?: boolean;
    ariaLabel?: string;
    onclose?: () => void;
    children?: Snippet;
    footer?: Snippet;
  };

  let {
    open,
    title,
    closeOnBackdrop = true,
    ariaLabel,
    onclose,
    children,
    footer,
  }: Props = $props();

  let panel: HTMLDivElement | undefined;
  let lastActive: Element | null = null;

  function close(): void {
    onclose?.();
  }

  function onKeydown(event: KeyboardEvent): void {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  }

  function onBackdropClick(event: MouseEvent): void {
    if (!closeOnBackdrop) return;
    if (event.target === event.currentTarget) close();
  }

  $effect(() => {
    if (!open) return;
    lastActive = document.activeElement;
    queueMicrotask(() => panel?.focus());
  });

  $effect(() => {
    if (open) return;
    if (lastActive instanceof HTMLElement) lastActive.focus();
  });

  onMount(() => {
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  });
</script>

{#if open}
  <div
    class="fixed inset-0 flex items-center justify-center bg-base-300/40 backdrop-blur-sm"
    style:z-index={uiZIndex.modal}
    role="presentation"
    onclick={onBackdropClick}
  >
    <div
      bind:this={panel}
      class="card w-[min(560px,calc(100vw-32px))] bg-base-100 shadow-xl outline-none"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel ?? title}
      tabindex="-1"
    >
      {#if title}
        <div class="card-body pb-2">
          <h2 class="card-title text-base font-semibold leading-tight">{title}</h2>
        </div>
      {/if}
      <div class="card-body pt-2">
        {@render children?.()}
      </div>
      {#if footer}
        <div class="card-actions justify-end border-t border-base-300 p-4">
          {@render footer?.()}
        </div>
      {/if}
    </div>
  </div>
{/if}
