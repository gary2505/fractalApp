# Llogging

- Canonical files:
  - `.ai/bundles/llog.md`
`Agent-llog-format-guide.md`.- `llog` format:
  - `<t_ms>|<component>|<event>|<path>|<note>`
- Use short, stable uppercase codes.
- Log meaningful checkpoints only: start / finish / fail / lock / retry / guard.
- Temporary logs use `T:<id>`.
- Monitor logs use `M:<id>` and stay commented out by default.
- Frontend call: `llog(component, event, context?, note?)`
- Rust call: `debug_bundle::log_event(component, event, context?, note?)`
- Follow the helper-block + one-line call-site rule from
- Regex-delete all // `T:<id>` call sites.
