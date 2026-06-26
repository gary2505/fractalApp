/**
 * Runtime platform flags.
 * Small fractalApp shim so FilesUP window utilities stay safe in web and Tauri.
 */
export const globalIsTauri =
  typeof window !== 'undefined' && (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ != null;

export function isTauriRuntime(): boolean {
  return globalIsTauri;
}
