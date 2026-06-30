SmartLog v1 real integration patch.

Why patch file instead of full replacements:
- The sandbox could not clone github.com, so this package avoids overwriting full current files.
- Apply with `git apply smartlog-real-integration.patch` after confirming current local files match the audited latest stage.

Required local checks after apply:
1. pnpm check
2. cd src-tauri && cargo check
3. Run app and trigger boot, version switch, Ctrl+B, Ctrl+E, Ctrl+J, Ctrl+Alt+B.
4. Confirm AppData/fractalApp/logs/app.jsonl receives quiet SmartLog events.
