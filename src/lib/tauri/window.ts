/**
 * Tauri Window Control Utilities - FilesUP proven pattern adapted for fractalApp.
 * Uses direct Tauri Window API with a cached window instance.
 */
import { getCurrentWindow } from '@tauri-apps/api/window';
import { globalIsTauri } from '$lib/stores/platform-store';
import { createDebugLogger } from '$lib/system/logging/unified-logger';
import { safeCloseWindow } from '$lib/tauri/safe-close-window';
import { getCurrentWindowSafely } from '$lib/shared/windowManager';

const log = createDebugLogger('Window');
const SCOPE = 'window' as const;

let appWindow: ReturnType<typeof getCurrentWindow> | null = null;
let isMaximized = false;
let initialized = false;

/**
 * Initialize window instance and state. Call once on app startup.
 */
export async function initializeWindow(): Promise<void> {
  if (!globalIsTauri || initialized) return;

  try {
    log.debug(SCOPE, 'initializeWindow', 'Initializing Tauri window');
    appWindow = getCurrentWindowSafely();
    isMaximized = await appWindow.isMaximized();
    initialized = true;
    log.debug(SCOPE, 'initializeWindow', 'Window initialized safely', { isMaximized });
  } catch (error) {
    log.error(SCOPE, 'initializeWindow', 'Failed to initialize window', { error });
  }
}

/**
 * Minimize the current window.
 */
export async function minimizeWindow(): Promise<void> {
  if (!globalIsTauri || !appWindow) {
    log.warn(SCOPE, 'minimizeWindow', 'Cannot minimize: not in Tauri context or window not initialized');
    return;
  }

  try {
    await appWindow.minimize();
    log.debug(SCOPE, 'minimizeWindow', 'Window minimized');
  } catch (error) {
    log.error(SCOPE, 'minimizeWindow', 'Failed to minimize window', { error });
    throw error;
  }
}

/**
 * Toggle maximize/restore window state.
 */
export async function toggleMaximize(): Promise<void> {
  if (!globalIsTauri || !appWindow) {
    log.warn(SCOPE, 'toggleMaximize', 'Cannot toggle maximize: not in Tauri context or window not initialized');
    return;
  }

  try {
    if (isMaximized) {
      await appWindow.unmaximize();
      log.debug(SCOPE, 'toggleMaximize', 'Window unmaximized');
    } else {
      await appWindow.maximize();
      log.debug(SCOPE, 'toggleMaximize', 'Window maximized');
    }

    isMaximized = await appWindow.isMaximized();
  } catch (error) {
    log.error(SCOPE, 'toggleMaximize', 'Failed to toggle maximize state', { error });
    throw error;
  }
}

/**
 * Close the current window safely.
 */
export async function closeWindow(): Promise<void> {
  if (!globalIsTauri) {
    log.warn(SCOPE, 'closeWindow', 'Cannot close: not in Tauri context');
    window.close();
    return;
  }

  try {
    await safeCloseWindow();
    log.debug(SCOPE, 'closeWindow', 'Window closed safely');
  } catch (error) {
    log.error(SCOPE, 'closeWindow', 'Failed to close window', { error });
    throw error;
  }
}

/**
 * Check if window is currently maximized.
 */
export async function checkIsMaximized(): Promise<boolean> {
  if (!globalIsTauri || !appWindow) return false;

  try {
    isMaximized = await appWindow.isMaximized();
    return isMaximized;
  } catch (error) {
    log.error(SCOPE, 'checkIsMaximized', 'Failed to check maximized state', { error });
    return false;
  }
}

/**
 * Get cached maximized state.
 */
export function isWindowMaximized(): boolean {
  return isMaximized;
}

/**
 * Start window dragging for custom title bars.
 */
export async function startDragging(): Promise<void> {
  if (!globalIsTauri || !appWindow) {
    log.warn(SCOPE, 'startDragging', 'Cannot start dragging: not in Tauri context or window not initialized');
    return;
  }

  try {
    await appWindow.startDragging();
  } catch (error) {
    log.error(SCOPE, 'startDragging', 'Failed to start dragging', { error });
    throw error;
  }
}
