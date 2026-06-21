import { bridgeInvoke } from '../bridge/bridge';
import type { Lang } from '../i18n/i18n';
import type { ThemeMode } from '../theme/theme';

export type AppSettings = {
  theme: ThemeMode;
  lang: Lang;
};

export const defaultSettings: AppSettings = {
  theme: 'system',
  lang: 'en'
};

export function loadSettings(): Promise<AppSettings> {
  return bridgeInvoke<AppSettings>('settings_load');
}

export function saveSettings(settings: AppSettings): Promise<void> {
  return bridgeInvoke<void>('settings_save', { settings });
}
