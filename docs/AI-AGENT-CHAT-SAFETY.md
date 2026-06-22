# AI Agent Chat Safety

## Hard rules

- no silent permission expansion
- no silent rule mutation
- no Core edits unless explicitly allowed
- no shared UI edits from app-level tasks unless explicitly allowed
- no full-repo reads by default
- no package/dependency changes without approval
- no cargo clean in fast iteration mode unless Rust cache error exists

## Patch scope

Every task must define:

```txt
target block
allowed files
forbidden files
gate to run
rollback path
```

## Approval levels

| Level | Meaning |
| --- | --- |
| `auto-plan` | agent may plan only |
| `auto-diff` | agent may create diff only |
| `manual-apply` | user applies patch |
| `guarded-apply` | system applies only after gate/audit |
```
