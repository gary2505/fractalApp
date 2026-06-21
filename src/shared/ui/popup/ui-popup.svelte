<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import { uiZIndex } from '../../design';

  type UiPopupPosition = 'anchor' | 'cursor' | 'center';

  type Props = {
    open: boolean;
    position?: UiPopupPosition;
    x?: number;
    y?: number;
    pinned?: boolean;
    ariaLabel?: string;
    onclose?: () => void;
    children?: Snippet;
  };

  let {
    open,
    position = 'cursor',
    x = 0,
    y = 0,
    pinned = false,
    ariaLabel = 'Popup',
    onclose,
    children,
  }: Props = $props();

  let popup: HTMLDivElement | undefined;
  let lastActive: Element | null = null;

  const styleText = $derived(() => {
    if (position === 'center') {
      return `z-index:${uiZIndex.popup};left:50%;top:50%;transform:translate(-50%,-50%);`;
    }
    return `z-index:${uiZIndex.popup};left:${x}px;top:${y}px;`;
  });

  function close(): void {
    if (!pinned) onclose?.();
  }

  function onDocumentPointerDown(event: PointerEvent): void {
    if (!open || pinned) return;
    if (popup && !popup.contains(event.target as Node)) close();
  }

  function onDocumentKeydown(event: KeyboardEvent): void {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  }

  $effect(() => {
    if (!open) return;
    lastActive = document.activeElement;
    queueMicrotask(() => popup?.focus());
  });

  $effect(() => {
    if (open) return;
    if (lastActive instanceof HTMLElement) lastActive.focus();
  });

  onMount(() => {
    document.addEventListener('pointerdown', onDocumentPointerDown, true);
    document.addEventListener('keydown', onDocumentKeydown);
    return () => {
      document.removeEventListener('pointerdown', onDocumentPointerDown, true);
      document.removeEventListener('keydown', onDocumentKeydown);
    };
  });
</script>

{#if open}
  <div
    bind:this={popup}
    class="fixed min-w-48 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl outline-none"
    style={styleText()}
    role="dialog"
    aria-label={ariaLabel}
    tabindex="-1"
  >
    {@render children?.()}
  </div>
{/if}
