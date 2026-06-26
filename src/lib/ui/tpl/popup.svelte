<script lang="ts">
  import { tick, type Snippet } from 'svelte';
  import { Dialog } from 'bits-ui';
  import XIcon from '../icons/x.svelte';
  import IconBtn from './icon-btn.svelte';

  type DragState = {
    pointerId: number;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
  };

  type Props = {
    id?: string;
    open?: boolean;
    title: string;
    description?: string;
    closeLabel?: string;
    headerBackground?: string;
    bodyBackground?: string;
    onClose?: () => void;
    children?: Snippet;
  };

  let {
    id = 'popup',
    open = $bindable(true),
    title,
    description,
    closeLabel = 'Close',
    headerBackground,
    bodyBackground,
    onClose,
    children
  }: Props = $props();

  let panelElement = $state<HTMLElement | null>(null);
  let returnFocusElement: HTMLElement | null = null;
  let wasOpen = false;
  let dialogX = $state<number | null>(null);
  let dialogY = $state<number | null>(null);
  let dragState = $state<DragState | null>(null);

  $effect(() => {
    if (open && !wasOpen && typeof document !== 'undefined') {
      returnFocusElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }

    if (!open && wasOpen) {
      onClose?.();
    }

    wasOpen = open;
  });

  function handleOpenAutoFocus(event: Event): void {
    event.preventDefault();

    tick().then(() => {
      requestAnimationFrame(() => {
        focusInitialElement();
      });
    });
  }

  function handleCloseAutoFocus(event: Event): void {
    event.preventDefault();
    returnFocusElement?.focus?.();
    returnFocusElement = null;
  }

  function focusInitialElement(): void {
    if (!panelElement) return;

    const explicitInitialFocus = panelElement.querySelector<HTMLElement>('[data-popup-initial-focus="true"]');
    const selectedOption = panelElement.querySelector<HTMLElement>('[role="option"][aria-selected="true"]');
    const firstOption = panelElement.querySelector<HTMLElement>('[role="option"]');
    const firstFocusable = panelElement.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const target = explicitInitialFocus ?? selectedOption ?? firstOption ?? firstFocusable;

    target?.focus();
  }

  function startDrag(event: PointerEvent): void {
    if (event.button !== 0 || !panelElement) return;

    const target = event.target;
    if (target instanceof Element && target.closest('[data-popup-no-drag="true"]')) return;

    const handle = event.currentTarget as HTMLElement;
    const rect = panelElement.getBoundingClientRect();

    dialogX = rect.left;
    dialogY = rect.top;
    dragState = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height
    };

    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function dragDialog(event: PointerEvent): void {
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const nextX = event.clientX - dragState.offsetX;
    const nextY = event.clientY - dragState.offsetY;
    const position = clampDialogPosition(nextX, nextY, dragState.width, dragState.height);

    dialogX = position.x;
    dialogY = position.y;
    event.preventDefault();
  }

  function stopDrag(event: PointerEvent): void {
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const handle = event.currentTarget as HTMLElement;
    handle.releasePointerCapture(event.pointerId);
    dragState = null;
  }

  function clampDialogPosition(x: number, y: number, width: number, height: number): { x: number; y: number } {
    if (typeof window === 'undefined') return { x, y };

    const margin = 8;
    const maxX = Math.max(margin, window.innerWidth - width - margin);
    const maxY = Math.max(margin, window.innerHeight - height - margin);

    return {
      x: Math.min(Math.max(x, margin), maxX),
      y: Math.min(Math.max(y, margin), maxY)
    };
  }

  function getContentStyle(): string | undefined {
    if (dialogX === null || dialogY === null) return undefined;
    return `left: ${dialogX}px; top: ${dialogY}px; transform: none;`;
  }

  function getHeaderStyle(): string | undefined {
    return headerBackground ? `background: ${headerBackground};` : undefined;
  }

  function getBodyStyle(): string | undefined {
    return bodyBackground ? `background: ${bodyBackground};` : undefined;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-40 bg-base-300/20" />
    <Dialog.Content
      bind:ref={panelElement}
      {id}
      class="fixed z-50 w-[min(520px,calc(100vw-32px))] rounded-box border border-base-300 bg-base-100 text-base-content shadow-xl outline-none {dialogX === null || dialogY === null
        ? 'left-1/2 top-20 -translate-x-1/2'
        : ''}"
      style={getContentStyle()}
      onOpenAutoFocus={handleOpenAutoFocus}
      onCloseAutoFocus={handleCloseAutoFocus}
    >
      <div
        class="flex h-11 cursor-move touch-none select-none items-center gap-2 rounded-t-box border-b border-base-300 bg-base-100 px-3"
        style={getHeaderStyle()}
        data-popup-drag-handle="true"
        onpointerdown={startDrag}
        onpointermove={dragDialog}
        onpointerup={stopDrag}
        onpointercancel={stopDrag}
      >
        <Dialog.Title id={`${id}-title`} class="min-w-0 flex-1 truncate text-sm font-semibold">
          {title}
        </Dialog.Title>

        <Dialog.Close id={`${id}-close`}>
          {#snippet child({ props })}
            <IconBtn {...props} label={closeLabel} title={closeLabel} danger data-popup-no-drag="true">
              <XIcon title={closeLabel} />
            </IconBtn>
          {/snippet}
        </Dialog.Close>
      </div>

      {#if description}
        <Dialog.Description id={`${id}-description`} class="sr-only">
          {description}
        </Dialog.Description>
      {/if}

      <div class="rounded-b-box bg-base-100 p-3" style={getBodyStyle()}>
        {@render children?.()}
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
