# Button rules

## Add a button

```svelte
<button
  id="{parent-id}-{action}"
  type="button"
  class="icon-app-base"
  title="Tooltip text"
  onclick={handler}
>
  <svg class="icon-app-md" viewBox="0 0 24 24" fill="currentColor">…</svg>
</button>
```

## Rules

1. **ID** — lowercase kebab-case, scoped to parent: `{parent-id}-{action}` (e.g. `top-row-close`, `status-bar-lang-en`, `p3h2-pin-toggle`).
2. **Icon button** — use `class="icon-app-base"` on `<button>`, no extra width/height.
3. **Icon size** — use `icon-app-sm` (12px), `icon-app-md` (14px), `icon-app-lg` (18px) on `<svg>`.
4. **Font size** — use `text-app-sm/md/lg/xl` instead of Tailwind `text-sm/text-lg`. Values come from `:root` variables, user can override via settings.
5. **Type** — always `type="button"` unless submit.
6. **Title** — always add `title` for tooltip/accessibility.
7. **No hardcoded text** — no user-visible text strings in components; use props or i18n keys.

## CSS reference (app.css)

```css
.icon-app-base { width:24px; height:24px; display:flex; align-items:center;
  justify-content:center; border:0; color:inherit; background:transparent;
  cursor:pointer; border-radius:4px; opacity:0.7; }
.icon-app-base:hover { background:oklch(0 0 0 / 0.1); opacity:1; }

.icon-app-sm  { width:12px; height:12px; }
.icon-app-md  { width:14px; height:14px; }
.icon-app-lg  { width:18px; height:18px; }

.text-app-sm { font-size: var(--size-sm); }   /* ~10.5px */
.text-app-md { font-size: var(--size-md); }   /*  12.2px */
.text-app-lg { font-size: var(--size-lg); }   /* ~17.5px */
.text-app-xl { font-size: var(--size-xl); }   /*  21px   */
```
