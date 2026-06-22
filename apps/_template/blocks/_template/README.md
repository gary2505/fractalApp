# Versioned Block Template

Copy this folder when creating a new Versioned Block.

Required steps:

```txt
1. Rename folder
2. Set block.manifest.json id/name/version/fractalApp
3. Keep public API small
4. Add targeted gate/tests
5. Add messages/hotkeys only if needed
```

Do not call Core/Tauri/Rust directly.
Use CoreBridge -> Policy -> Allowed Service.
