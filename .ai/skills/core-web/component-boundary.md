# Skill: core-web component boundary

Use when editing any Web Component.

Rules:
- Core boots without any component.
- Component may fail without crashing Core.
- Component owns UI only, not native access.
- No direct Tauri/Rust call from component.
- Native access goes through CoreBridge.
- Component input/output must be contract-based.
- Keep component versioned: `name-vX-Y`.
- No global mutation outside allowed state channel.

Bad:
- import Tauri API inside feature UI.
- call Rust command from Svelte component.
- hardcode global app paths in component.
