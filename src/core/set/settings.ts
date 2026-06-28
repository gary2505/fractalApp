import { bridgeInvoke } from '../bridge/bridge';
import type { Lang } from '../i18n/i18n';
import type { ThemeMode } from '../theme/theme';
import { applyFontSettings } from '../../shared/settings/font-settings';

export type AppSettings = {
  theme: ThemeMode;
  lang: Lang;
  fontFamily?: string | null;
  fontSize?: number | null;
};

export const defaultSettings: AppSettings = {
  theme: 'system',
  lang: 'en'
};

export async function loadSettings(): Promise<AppSettings> {
  const s = await bridgeInvoke<AppSettings>('settings_load');
  applyFontSettings(s);
  return s;
}

export function saveSettings(settings: AppSettings): Promise<void> {
  return bridgeInvoke<void>('settings_save', { settings });
}
