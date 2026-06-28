# Refactor: DaisyUI as single source of truth

## Rule

- **DaisyUI owns**: spacing, font-size, font-family, font-weight, line-height, radii, borders, colors
- **`design-tokens.ts` owns**: `uiZIndex` + `uiMotion` only (DaisyUI has no equivalent)

## User customization (future settings)

Font family + font size must be overridable via user settings at runtime.
Architecture: **DaisyUI defaults → CSS custom properties → user override layer**.

```text
┌──────────────────────────────────────────────────┐
│  User settings (%Data%/AppData / settings file)  │
│   fontFamily: "Atkinson Hyperlegible"            │
│   fontSize:   18                                 │  ← px
└──────────────────┬───────────────────────────────┘
                   │  applied on <html> at boot
                   ▼
┌──────────────────────────────────────────────────┐
│  CSS custom properties on :root                  │
│   --font-sans:  "Atkinson Hyperlegible", ...     │  ← user wins
│   --font-size-root: 18px                         │  ← user wins
│   font-size: var(--font-size-root);              │  ← drives all rem
└──────────────────┬───────────────────────────────┘
                   │  fallback
                   ▼
┌──────────────────────────────────────────────────┐
│  @theme in app.css (DaisyUI defaults)            │
│   --font-sans:  "Inter", ui-sans-serif, ...      │
│   --font-size-root: 16px                         │
└──────────────────────────────────────────────────┘
```

All components use Tailwind utilities (`text-xs`, `font-sans`).  
Tailwind reads `--font-sans`. DaisyUI reads `font-size` on root.  
User just sets CSS vars → everything scales.

## Steps

### 1. Wire font-family globally in `app.css`

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}

/* DaisyUI defaults — overridable by user settings via --font-sans, --font-size-root */
@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-2xs: 0.625rem;  /* 10px – missing from DaisyUI scale */
  --font-size-2xl: 1.75rem;   /* 28px – missing from DaisyUI scale */
}

/* User settings bridge: font-family + base font-size.
   Set by JS on app boot from user settings.
   Falls back to @theme defaults when no user pref. */
:root {
  font-family: var(--font-sans);
  --font-size-root: 16px;
  font-size: var(--font-size-root);
}
```

### 2. Add missing font sizes to `@theme`

| Token | Value | Reason |
| --- | --- | --- |
| `--font-size-2xs` | `0.625rem` (10px) | Used in `main-v1-3` tab spans |
| ~~11px~~ | map to `text-xs` (12px DaisyUI) | Only in rail-item; negligible diff |
| `--font-size-2xl` | `1.75rem` (28px) | Used in all cmpH1 + canvas-card h1 |

### 3. Remove duplicated font-family from all `cmp/*/index.html`

Delete `:root { font-family: ... }` from every cmp index.html.  
The global `@theme --font-sans` in `app.css` handles it.

Files to touch:

- `cmp/welcome/1.0.0/index.html`
- `cmp/welcome/1.0.1/index.html`
- `cmp/chat/1.0.0/index.html`
- `cmp/editor/1.0.0/index.html`
- `cmp/explorer/1.0.0/index.html`
- `cmp/settings/1.0.0/index.html`
- `cmp/settings/1.0.1/index.html`
- `cmp/terminal/1.0.0/index.html`
- `cmp/_template/1.0.0/index.html`

### 4. Remove `body { font-family }` from `main-v1-3.svelte`

Replace the `:global(body)` block that sets font-family.  
Inherit from global instead.

### 5. Replace hardcoded font-sizes with DaisyUI utilities

In `main-v1-3.svelte`:

| Current | Replace with |
| --- | --- |
| `font-size: 10px` | `text-2xs` (from @theme) |
| `font-size: 11px` | `text-xs` |
| `font-size: 12px` | `text-xs` |
| `font-size: 13px` | `text-sm` |
| `font-size: 28px` (h1) | `text-2xl` (from @theme) |

In `cmp/*/index.html`:

| Current | Replace with |
| --- | --- |
| `font-size: 12px` | `text-xs` |
| `font-size: 13px` | `text-sm` |
| `font-size: 28px` (h1) | `text-2xl` (from @theme) |

### 6. Update `main-v1-1.svelte`

Replace `font-size: 2rem` with `text-2xl`.

### 7. Verify

- [ ] No hardcoded `font-family` in any `src/` or `cmp/` file
- [ ] No hardcoded `font-size: Npx` in any `src/` or `cmp/` file
- [ ] `design-tokens.ts` contains only `uiZIndex` + `uiMotion`
- [ ] All components render with Inter font
- [ ] Light/dark themes still work

### 8. Extend Rust Settings struct (src-tauri)

Add font fields to the existing `Settings` struct in `src-tauri/src/core.rs`:

```rust
// src-tauri/src/core.rs
#[derive(Debug, Serialize, Deserialize)]
struct Settings {
  theme: String,
  lang: String,
  #[serde(default, rename = "fontFamily")]
  font_family: Option<String>,    // e.g. "Atkinson Hyperlegible"
  #[serde(default, rename = "fontSize")]
  font_size: Option<u32>,         // px, e.g. 18
}
```

Settings stored at (handled automatically by Tauri `app_data_dir()`):

| Platform | Path |
| --- | --- |
| Windows | `%APPDATA%\fractalApp\set\settings.json` |
| macOS | `~/Library/Application Support/fractalApp/set/settings.json` |
| Linux | `~/.local/share/fractalApp/set/settings.json` (or `$XDG_DATA_HOME/fractalApp/`) |

No new Rust commands needed — `settings_load`, `settings_save`, `settings_apply_intent` already handle the full struct.

### 9. Frontend settings bridge (JS)

Create `src/shared/settings/font-settings.ts` — reads the Rust-loaded settings, applies CSS vars.

```ts
// src/shared/settings/font-settings.ts
import type { Settings } from './settings-types';

/** Apply font settings to <html> — call after settings_load + on every settings change */
export function applyFontSettings(s: Settings): void {
  const root = document.documentElement;
  if (s.fontFamily) {
    root.style.setProperty('--font-sans', s.fontFamily);
  } else {
    root.style.removeProperty('--font-sans');  // fall back to @theme default
  }
  if (s.fontSize) {
    root.style.setProperty('--font-size-root', `${s.fontSize}px`);
  } else {
    root.style.removeProperty('--font-size-root');
  }
}
```

```ts
// src/shared/settings/settings-types.ts
export type Settings = {
  theme: string;
  lang: string;
  fontFamily?: string | null;
  fontSize?: number | null;
};
```

```ts
// src/main.ts  (app boot — wire into existing settings load flow)
import { applyFontSettings } from '$lib/settings/font-settings';

// After bridgeInvoke('settings_load') returns settings:
applyFontSettings(loadedSettings);
```

**No component changes needed** — they already use Tailwind utilities which read `--font-sans` and all `rem` units scale from root `font-size`.

### 10. Settings UI (future task)

In `cmp/settings/` add:

- Font family dropdown (Inter / Atkinson Hyperlegible / OpenDyslexic / system default)
- Base font size slider (14px–24px)
- On change → `bridgeInvoke('settings_apply_intent', { ... })` → Rust saves to app-data dir (cross-platform) → frontend re-applies CSS vars → instant live preview
