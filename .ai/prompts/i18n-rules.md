# i18n Rules for AI Agents

## Multi-language support

All user-visible text MUST use the i18n system. Never hardcode strings.

### Adding a new text key

1. Add the key to ALL 5 locale files (`src/core/i18n/locales/*.ts`):
   - `en.ts` — English (primary, defines `TextKey` type)
   - `ru.ts` — Russian
   - `zh.ts` — Chinese
   - `ja.ts` — Japanese
   - `es.ts` — Spanish

2. Key naming: `{area}.{component}.{label}` (e.g. `p2.popup.title`, `settings.theme`).

3. In components, use: `{$t('p2.popup.title')}` in template or `import { get } from 'svelte/store'; get(t)('key')` in script.

### Editing existing text

- Change the value in ALL 5 locale files, not just `en.ts`.
- Do NOT change the key name unless you update all usages across the codebase.

### Supported languages

`en`, `es`, `zh`, `ru`, `ja`

### Common mistakes

- Adding key only to `en.ts` — breaks other languages (fallback works but shows English).
- Using raw strings in template: `<span>Settings</span>` — always use `{$t('...')}`.
- Using slot-level text in UI components — pass translated strings as props.
