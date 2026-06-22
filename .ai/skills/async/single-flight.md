# Single flight

Use when repeated action must run once.

Examples:
- save click spam
- refresh spam
- open same popup
- run same gate

Rules:
- key by resource/action
- return existing promise while running
- release key in finally
- combine with stale guard if result can be old
