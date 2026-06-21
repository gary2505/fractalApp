import { derived, writable } from 'svelte/store';
import { en } from './locales/en';
import { es } from './locales/es';
import { ja } from './locales/ja';
import { ru } from './locales/ru';
import { zh } from './locales/zh';

export type Lang = 'en' | 'es' | 'zh' | 'ru' | 'ja';
export type TextKey = keyof typeof en;

type Dictionary = Record<TextKey, string>;

const dictionaries: Record<Lang, Dictionary> = { en, es, zh, ru, ja };

export const lang = writable<Lang>('en');

export const t = derived(lang, ($lang) => {
  return (key: TextKey): string => dictionaries[$lang][key] ?? en[key] ?? key;
});

export const supportedLangs: Lang[] = ['en', 'es', 'zh', 'ru', 'ja'];
