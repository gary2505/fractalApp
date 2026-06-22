# Model choice

Use cheap/fast model for:
- text edits
- small CSS
- simple rename
- docs

Use stronger model for:
- architecture
- race bugs
- security
- Rust/Tauri bridge
- failing tests with unclear cause

Never use expensive model just to scan files.
