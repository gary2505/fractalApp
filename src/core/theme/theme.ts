import { writable } from 'svelte/store';

export type ThemeMode = 'light' | 'dark' | 'system';

export const theme = writable<ThemeMode>('system');

export function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  const resolved = resolveTheme(mode);
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
}

export function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode !== 'system') return mode;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}
