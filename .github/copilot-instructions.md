# Copilot instructions

Use the shortest working path.

Small fix:
- search exact files first
- read max 1 skill only if needed
- make the smallest patch
- run the smallest check
- stop

Big feature:
- use the matching `plan/*.md`
- read max 1-3 listed skills
- patch in small steps

If lost:
- add a temporary tracer
- inspect actual state
- compare expected vs actual
- patch
- remove temporary tracer before done

Never:
- scan the whole repo by default
- redesign unless asked
- bypass Core-Web boundaries
- add hardcoded UI text
- create long names or repeated folders

Done format:
- Changed
- Checked
- Proof
- Not checked

## CSS rules

- Use only DaisyUI utility classes for styling. No custom CSS overrides.
- Font must inherit from `:root`:

  ```css
  :root {
    font-family: var(--font-sans);
    --font-size-root: 14px;
    font-size: var(--font-size-root);
  }
  ```

- Do not apply explicit `font-size` or `font-family` classes like `text-xs`, `text-sm`, etc. — let elements inherit the root cascade.

## Popup window / dialogs
Must use extends $lib/ui/tpl/popup.svelte — a reusable popup wrapper that uses bits-ui Dialog.Root + Dialog.Portal + Dialog.Overlay with drag support.
read .ai\prompts\popup-rules.md

## i18n Rules for AI Agents
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
