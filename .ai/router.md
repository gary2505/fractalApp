# AI router

Default: code evidence first. Skills are guardrails, not homework.

Small bug:
1. Search exact files.
2. Read max 1 matching skill if useful.
3. Patch smallest place.
4. Run smallest check.

Big feature:
1. Use matching `plan/*.md`.
2. Read max 1-3 skills from the plan.
3. Patch by small steps.

Routes:
- css, scroll, overflow, size, z-index -> `.ai/skills/css/*`
- popup, modal, focus, Esc, keyboard -> `.ai/skills/ui/*`
- session, restore, persist, reload -> `.ai/skills/session/*`
- design, theme, component, visual -> `.ai/skills/ui/*`
- svelte, rune, state, derived -> `.ai/skills/svelte/*`
- tauri, rust, command, file -> `.ai/skills/rust/*`, `.ai/skills/core-web/*`
- path, windows, mac, linux -> `.ai/skills/platform/*`
- text, language, translation -> `.ai/skills/i18n/*`
- unsure, repeated bug, no evidence -> `.ai/skills/agent/tracer.md`

Limit:
- small bug: max 1 skill
- big feature: max 3 skills
- never read all skills
