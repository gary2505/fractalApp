import { ClickIntentService, sharedClickIntentService, type ClickIntentEvent } from './click-intent-service';

export type UseClickIntentOptions = {
  service?: ClickIntentService;
  onSingle?: (event: ClickIntentEvent) => void;
  onDouble?: (event: ClickIntentEvent) => void;
  onDrag?: (event: ClickIntentEvent) => void;
  onCancel?: (event: ClickIntentEvent) => void;
};

export function useClickIntent(node: HTMLElement, options: UseClickIntentOptions = {}) {
  const service = options.service ?? sharedClickIntentService;

  function emit(event: ClickIntentEvent): void {
    if (event.type === 'single') options.onSingle?.(event);
    if (event.type === 'double') options.onDouble?.(event);
    if (event.type === 'drag') options.onDrag?.(event);
    if (event.type === 'cancel') options.onCancel?.(event);
  }

  function onPointerUp(event: PointerEvent): void {
    service.handlePointerUp(event, { onIntent: emit });
  }

  function onPointerCancel(event: PointerEvent): void {
    service.cancel(event, { onIntent: emit });
  }

  node.addEventListener('pointerup', onPointerUp);
  node.addEventListener('pointercancel', onPointerCancel);

  return {
    destroy() {
      node.removeEventListener('pointerup', onPointerUp);
      node.removeEventListener('pointercancel', onPointerCancel);
      service.reset();
    },
  };
}
