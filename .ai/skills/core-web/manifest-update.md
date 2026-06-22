# Skill: component manifest/update

Use when loading/updating blocks/components.

Rules:
- Manifest is source of truth.
- Load by id + version.
- Verify before activate.
- Keep previous working version.
- Failed update rolls back.
- Core stays usable in Safe Mode.
- Never require full app reinstall for web block update.

Check:
- id stable.
- version changed.
- rollback path exists.
- health check exists.
