/**
 * Tiny safe invoke helper used by window close fallback.
 */
export class CancelToken {
  #cancelled = false;

  cancel(): void {
    this.#cancelled = true;
  }

  get cancelled(): boolean {
    return this.#cancelled;
  }
}

export async function safeInvoke<T>(
  command: string,
  args: Record<string, unknown> = {},
  onError: (error: unknown) => void = () => {},
  cancelToken?: CancelToken
): Promise<T> {
  if (cancelToken?.cancelled) {
    throw new Error(`safeInvoke cancelled before ${command}`);
  }

  try {
    const { invoke } = await import('@tauri-apps/api/core');
    const result = await invoke<T>(command, args);

    if (cancelToken?.cancelled) {
      throw new Error(`safeInvoke cancelled after ${command}`);
    }

    return result;
  } catch (error) {
    onError(error);
    throw error;
  }
}
