export type UiLocale = 'en' | 'ru';

export type UiMessageKey =
  | 'ui.action.close'
  | 'ui.action.cancel'
  | 'ui.action.save'
  | 'ui.state.loading'
  | 'ui.state.empty'
  | 'ui.error.generic'
  | 'ui.hotkey.conflict'
  | 'ui.settings.saved'
  | 'ui.component.unavailable';

const messages: Record<UiLocale, Record<UiMessageKey, string>> = {
  en: {
    'ui.action.close': 'Close',
    'ui.action.cancel': 'Cancel',
    'ui.action.save': 'Save',
    'ui.state.loading': 'Loading',
    'ui.state.empty': 'Nothing to show',
    'ui.error.generic': 'Something went wrong',
    'ui.hotkey.conflict': 'Hotkey conflict: {hotkey}',
    'ui.settings.saved': 'Settings saved',
    'ui.component.unavailable': 'Component is unavailable',
  },
  ru: {
    'ui.action.close': 'Закрыть',
    'ui.action.cancel': 'Отмена',
    'ui.action.save': 'Сохранить',
    'ui.state.loading': 'Загрузка',
    'ui.state.empty': 'Нет данных',
    'ui.error.generic': 'Что-то пошло не так',
    'ui.hotkey.conflict': 'Конфликт горячей клавиши: {hotkey}',
    'ui.settings.saved': 'Настройки сохранены',
    'ui.component.unavailable': 'Компонент недоступен',
  },
};

export function uiMessage(locale: UiLocale, key: UiMessageKey, params: Record<string, string | number> = {}): string {
  const template = messages[locale]?.[key] ?? messages.en[key] ?? key;
  return Object.entries(params).reduce(
    (text, [paramKey, value]) => text.replaceAll(`{${paramKey}}`, String(value)),
    template,
  );
}

export function hasUiMessage(key: string): key is UiMessageKey {
  return key in messages.en;
}
