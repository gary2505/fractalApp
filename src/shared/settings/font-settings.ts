import type { Settings } from './settings-types';

/** Apply font settings to <html> — call after settings_load + on every settings change */
export function applyFontSettings(s: Settings): void {
  const root = document.documentElement;
  if (s.fontFamily) {
    root.style.setProperty('--font-sans', s.fontFamily);
  } else {
    root.style.removeProperty('--font-sans');  // fall back to @theme default
  }
  if (s.fontSize) {
    root.style.setProperty('--font-size-root', `${s.fontSize}px`);
  } else {
    root.style.removeProperty('--font-size-root');
  }
}
