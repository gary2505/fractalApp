# Workflow rl

Goal: restore last session path after app reload.

Rules:

```txt
load session from app-data
validate path before use
invalid path returns null
never crash app from invalid session
```
