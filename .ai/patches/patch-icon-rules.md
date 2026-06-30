# Button and ID Rules

## Layout IDs

All new layout DOM IDs  use now /and must  lowercase kebab-case.

Required layout IDs:

```txt
top-row
top-bar
main-row
p0
p1
p2
p3
p3h1
p3h2
p4
status-bar
```

Do not use ambiguous abbreviations like `sbar`.

## Button IDs

Every important button/control must have a stable `id`.

Format:

```txt
{parent-id}-{action}
```

Examples:

```txt
top-row-close
top-row-ai-toggle
top-row-p1-toggle
status-bar-lang-en
status-bar-theme-toggle
p3h2-pin-toggle
p4-ai-panel-close
```

Rules:

1. Use lowercase kebab-case only.
2. Scope the button ID to its parent layout/panel ID.
3. Do not use random names like `button1`, `closeBtn`, or `aiToggle`.
4. Do not use uppercase IDs for new components.
5. IDs must be stable for contracts, tests, smart logs, and AI search.

## Add an Icon Button

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

## Button Rules

1. **ID** — lowercase kebab-case, scoped to parent: `{parent-id}-{action}`.
2. **Icon button** — use `class="icon-app-base"` on `<button>`. Do not add custom width/height per button.
3. **Icon size** — use `icon-app-sm` 12px, `icon-app-md` 14px, or `icon-app-lg` 18px on `<svg>`.
4. **Font size** — use `text-app-sm`, `text-app-md`, `text-app-lg`, or `text-app-xl` instead of Tailwind `text-sm`, `text-lg`, etc.
5. **Type** — always use `type="button"` unless the button submits a form.
6. **Title** — always add `title` for tooltip/accessibility.
7. **No hardcoded user text** — user-visible strings must come from props or i18n keys.
8. **One icon system** — do not mix SVG icons with text-symbol icons like `>`, `<`, or `◧` in the same toolbar.
9. **No one-off button styling** — use shared classes/tokens so user and AI can change button look globally.
10. **SVG styling** — reusable icons must use `currentColor`, not hardcoded colors like `fill="#000000"`.

## CSS Reference

```css
.icon-app-base {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  color: inherit;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  opacity: 0.7;
}

.icon-app-base:hover {
  background: oklch(0 0 0 / 0.1);
  opacity: 1;
}

.icon-app-sm {
  width: 12px;
  height: 12px;
}

.icon-app-md {
  width: 14px;
  height: 14px;
}

.icon-app-lg {
  width: 18px;
  height: 18px;
}

.text-app-sm {
  font-size: var(--size-sm);
}

.text-app-md {
  font-size: var(--size-md);
}

.text-app-lg {
  font-size: var(--size-lg);
}

.text-app-xl {
  font-size: var(--size-xl);
}
```
