import { writable } from 'svelte/store';

export type UiSnackbarVariant = 'success' | 'warning' | 'error' | 'info';

export type UiSnackbarItem = {
  id: string;
  variant: UiSnackbarVariant;
  message: string;
  timeoutMs: number;
};

function createSnackbarStore() {
  const { subscribe, update } = writable<UiSnackbarItem[]>([]);

  function push(input: Omit<UiSnackbarItem, 'id' | 'timeoutMs'> & { timeoutMs?: number }): string {
    const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    const item: UiSnackbarItem = {
      id,
      timeoutMs: input.timeoutMs ?? 3500,
      variant: input.variant,
      message: input.message,
    };

    update((items) => [...items, item]);

    if (item.timeoutMs > 0) {
      window.setTimeout(() => remove(id), item.timeoutMs);
    }

    return id;
  }

  function remove(id: string): void {
    update((items) => items.filter((item) => item.id !== id));
  }

  function clear(): void {
    update(() => []);
  }

  return { subscribe, push, remove, clear };
}

export const uiSnackbars = createSnackbarStore();
