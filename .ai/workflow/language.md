# Language Switcher

Source: i18n.ts

5 supported languages
Key	Display name
en	English
es	Español
zh	中文
ru	Русский
ja	日本語
Where language files are kept
All locale dictionaries are in locales:

All locale dictionaries are in locales:

en.ts — English
es.ts — Spanish
zh.ts — Chinese
ru.ts — Russian
ja.ts — Japanese

How it works

Store — lang is a Svelte writable store (writable<Lang>('en')).
Derived t function — t is a derived store that returns a (key: TextKey) => string lookup. It reads dictionaries[$lang][key] with fallback to en[key], then the raw key.
Type safety — TextKey is derived from keyof typeof en (English keys define the schema). Lang is the union 'en' | 'es' | 'zh' | 'ru' | 'ja'.
Switching — changeLang(value) calls lang.set(value) then saveSettings({ theme: $theme, lang: value }).
Persistence — On boot, settings are loaded from storage, and lang.set(settings.lang) restores the saved language.
UI — A <select> element binds to $lang, fires changeLang() on change, with 5 <option> elements — one per language.


Current i18n is **purely static** — all 5 locale files (en.ts, es.ts, zh.ts, ru.ts, ja.ts) are `import`ed at build time and bundled into the app binary. There is no remote fetch or dynamic loading.

### How to add Japanese translations when updating a component

**1. Add the new text key to the English schema** (en.ts) first — it defines `TextKey`:
```ts
// en.ts
"my.new.key": "New button text",
```

**2. Add the same key to** ja.ts with the Japanese translation:
```ts
// ja.ts
"my.new.key": "新しいボタンテキスト",
```

**3. (Required) Add the same key to all other locale files** (es.ts, zh.ts, ru.ts) — otherwise TypeScript will error because `TextKey` is `keyof typeof en` and all dictionaries must have matching keys.

**4. Rebuild** — the new strings are compiled into the next app bundle.

### If you want to ship translations separately (without rebuild)

Currently there's **no mechanism for that**. To support it you'd need to add:

- A remote JSON endpoint for locale overrides
- Or dynamic `import()` of locale chunks
- Or a Tauri command that reads locale files from disk at runtime

But as of now — **new string → rebuild → ship new version**.