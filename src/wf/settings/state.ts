import type { Lang } from '../../core/i18n/i18n';
import type { ThemeMode } from '../../core/theme/theme';

export type SettingsState = {
  theme: ThemeMode;
  lang: Lang;
};

export const settingsIntent = 'settings.apply';
