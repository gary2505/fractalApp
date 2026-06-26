/**
 * Tauri v2 Window Management Utilities
 *
 * CRITICAL RULE: NO DESTROY, ONLY CLOSE!
 *
 * In Tauri v2, window.destroy() requires special permissions and can bypass
 * onCloseRequested handlers. Use window.close() for normal shutdown.
 */
import { getCurrentWindow } from '@tauri-apps/api/window';
import { createComponentLogger } from '$lib/system/logging/unified-logger';

const logger = createComponentLogger('WindowManager');

/**
 * Safely closes the current window using Tauri v2 best practices.
 * Uses close() instead of destroy() to avoid permission/session issues.
 */
export async function closeWindow(): Promise<void> {
  try {
    if (isTauriWindow()) {
      const appWindow = getCurrentWindow();
      logger.debug('Closing window using appWindow.close()');
      await appWindow.close();
      return;
    }

    logger.debug('Not in Tauri context, using window.close()');
    window.close();
  } catch (error) {
    logger.error('Error closing window:', error);

    try {
      window.close();
    } catch (fallbackError) {
      logger.error('Fallback window.close() also failed:', fallbackError);
    }
  }
}

/**
 * DO NOT USE: destroy() requires special permissions in Tauri v2.
 * Use closeWindow() instead.
 *
 * @deprecated Use closeWindow() instead to preserve session data.
 */
export async function destroyWindow(): Promise<never> {
  logger.error('destroyWindow() called - this is dangerous in Tauri v2');
  logger.info('Redirecting to closeWindow() to preserve session data');

  await closeWindow();

  throw new Error(
    'destroyWindow() is not supported. Use closeWindow() instead to preserve session data.'
  );
}

/**
 * Check if we are running in a Tauri context.
 */
export function isTauriWindow(): boolean {
  return typeof window !== 'undefined' && !!(window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__;
}

/**
 * Get current window safely.
 */
export function getCurrentWindowSafely() {
  if (!isTauriWindow()) {
    throw new Error('Not running in Tauri context');
  }

  return getCurrentWindow();
}
