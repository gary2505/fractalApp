# Session save restore

Rules:
- schema version required
- validate before restore
- unknown fields ignored
- failed restore uses safe defaults
- save only stable user state
- debounce autosave

Do not save:
- temporary hover
- raw errors
- huge lists
- secrets/tokens

Check:
- first run
- old schema
- corrupted data
