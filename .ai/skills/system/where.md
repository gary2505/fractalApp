# System: where

Use `src/system/*` for app-wide mechanics.

Put here:
- async request helpers
- input gates / click / keys
- operation runtime
- diagnostics / logs
- safety net
- race control

Do not put here:
- UI components
- feature business logic
- settings UI
- feature CSS

Examples:
- good: `src/system/input/click.ts`
- good: `src/system/async/request.ts`
- good: `src/system/diag/log.ts`
- bad: `src/shared/input/click-controller.ts`
