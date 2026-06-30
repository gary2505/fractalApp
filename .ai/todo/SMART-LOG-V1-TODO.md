# SmartLog v1 TODO

Result:
- Implement one SmartLog system with two modes: permanent app log and temporary issue trace.
- Storage target:
  - AppData/fractalApp/logs/app.jsonl
  - AppData/fractalApp/logs/issue-current.jsonl
  - AppData/fractalApp/logs/error.jsonl

Files:
- NEW src/core/log/smart-log-types.ts
- NEW src/core/log/smart-log-config.ts
- NEW src/core/log/smart-log-sanitize.ts
- NEW src/core/log/smart-log-buffer.ts
- NEW src/core/log/smart-log-trace.ts
- NEW src/core/log/smart-log.ts
- NEW src/core/log/smart-log-issue.ts
- NEW src/core/log/smart-log-read.ts
- NEW src/core/log/smart-log-index.ts
- NEW src/core/log/smart-log.test.ts
- NEW src-tauri/src/smart_log.rs
- NEW .ai/patches/smart-log-v1-required-registration.patch

Risk:
- New frontend files can fall back to existing log_write, but separate issue/error files require registering smart_log.rs commands in Rust.
- Do not remove existing log.ts. SmartLog wraps or replaces usage gradually.
- Do not connect logs to every component. Use shared SmartLog helpers only.

Next:
- Apply the registration patch.
- Run pnpm check.
- Run pnpm test smart-log.
- Verify app log writes to AppData/fractalApp/logs/app.jsonl.
- Verify issue mode writes to issue-current.jsonl after smart_log_write is registered.
