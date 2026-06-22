# System: use

Use system only when task needs shared mechanics.

Use it for:
- prevent double action
- cancel stale request
- serialize same-key ops
- normalize hotkeys
- track operation/progress
- report debug/error state

Do not use it for:
- button style
- popup layout
- feature state
- hardcoded messages

Rule:
- feature calls small system helper
- system never imports feature
- system never imports UI component
