import { safeInvoke, CancelToken } from '$lib/services/safeInvoke';

/**
 * Safe close fallback chain.
 * 1. Tauri window.close()
 * 2. Optional backend close_window command
 * 3. Browser window.close()
 */
export async function safeCloseWindow(): Promise<void> {
  const isTauri =
    typeof window !== 'undefined' && (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ != null;

  if (!isTauri) {
    window.close();
    return;
  }

  try {
    const mod = await import('@tauri-apps/api/window');
    const win = mod.getCurrentWindow();
    await win.close();
  } catch (err: unknown) {
    try {
      await safeInvoke<void>('close_window', {}, () => {}, new CancelToken());
    } catch {
      console.warn('[safeCloseWindow] Could not close/exit:', err);
    }
  }
}
