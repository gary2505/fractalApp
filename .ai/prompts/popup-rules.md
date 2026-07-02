# Popup Dialog Rules for AI Agents

## Standard popup component

All dialogs/popups MUST use `$lib/ui/tpl/popup.svelte` — a reusable wrapper built on bits-ui `Dialog.Root` + `Dialog.Portal` + `Dialog.Overlay` with drag support.

Never use raw `<div class="fixed...">` overlays or manual dialog markup.

### Props

| Prop | Type | Required | Default | Notes |
| ---- | ---- | -------- | ------- | ----- |
| `id` | `string` | No | `'popup'` | Unique DOM id |
| `open` | `boolean` (bindable) | No | `true` | `bind:open={myState}` |
| `title` | `string` | **Yes** | — | Header text |
| `description` | `string` | No | — | Hidden accessible description |
| `closeLabel` | `string` | No | `'Close'` | X button aria-label |
| `headerBackground` | `string` | No | — | CSS background for header |
| `bodyBackground` | `string` | No | — | CSS background for body |
| `onClose` | `() => void` | No | — | Fires on close |
| `children` | `Snippet` | No | — | Body content (Svelte 5 snippet) |

### Usage pattern

```svelte
<script>
  import Popup from '$lib/ui/tpl/popup.svelte';
  let open = $state(false);
</script>

<Popup
  id="my-popup"
  bind:open
  title={$t('my.popup.title')}
  description="Short accessible description"
  onClose={() => open = false}
>
  <!-- all content goes here as children snippet -->
  <div>...</div>
</Popup>
```

### Refactoring a raw popup to Popup

1. Remove manual overlay: `{#if open}<div class="fixed inset-0 z-40" onclick={cancel}>...</div>{/if}`
2. Remove manual centered dialog: `class="fixed z-50 ..." style="top:50%;left:50%;transform:translate(-50%,-50%)"`
3. Remove manual header with X close button — Popup provides header with title + built-in close.
4. Remove manual `role="dialog"`, `aria-label` — Popup handles accessibility.
5. Wrap body content inside `<Popup>` as children.
6. Use `bind:open` instead of `{#if}`.
7. Pass `onClose` instead of manual cancel handler.
8. **Title must use i18n**: `{$t('key')}`.

### Common mistakes

- Using raw HTML for overlay/backdrop — Popup has built-in `Dialog.Overlay`.
- Creating manual close buttons — Popup header includes X close.
- Forgetting `bind:open` — popup won't react to state changes.
- Using Svelte 4 `<slot>` instead of Svelte 5 snippet children.
- No `id` — use descriptive id like `"settings-popup"`, `"confirm-dialog"`.

## Multi-language (i18n) support

All popup user-visible text MUST use the i18n system. Never hardcode strings in `title`, button labels, or body content.

### How to implement

1. **Title**: Always use `{$t('key')}` — e.g. `title={$t('p2.popup.title')}`
2. **Add new keys to ALL 5 locale files** in `src/core/i18n/locales/`:
   - `en.ts` — primary (defines `TextKey` type)
   - `ru.ts`, `zh.ts`, `ja.ts`, `es.ts`
3. **Key naming**: `{area}.{popup}.{label}` — e.g. `settings.popup.title`, `p2.popup.save`
4. **Button labels** inside popup body: `{$t('p2.popup.cancel')}`, `{$t('p2.popup.save')}`

### Example: adding a new popup with i18n

```ts
// 1. Add keys to en.ts (and all other locales)
"confirm.popup.title": "Delete file?",
"confirm.popup.save": "Delete",
"confirm.popup.cancel": "Cancel",
```

```svelte
// 2. In the component
<Popup
  id="confirm-delete"
  bind:open
  title={$t('confirm.popup.title')}
  onClose={() => open = false}
>
  <p>Are you sure?</p>
  <button onclick={handleDelete}>{$t('confirm.popup.save')}</button>
  <button onclick={() => open = false}>{$t('confirm.popup.cancel')}</button>
</Popup>
```
