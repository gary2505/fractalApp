# System: API

System API must be small.

Rules:
- export from `src/system/index.ts`
- short filenames
- pure helpers when possible
- no feature names in system
- no P1/P2/P3/filesUp words
- no direct DOM unless input helper needs it
- no hardcoded user text

Import pattern:
- good: `import { createClickGate } from '$lib/system'`
- bad: `import ... from '$lib/system/input/click-controller'`

Before adding system API:
- check existing system helper
- avoid duplicate helper
- add minimal test/check if available
