# Small check

Use smallest useful check.

Order:
1. typecheck target package if available
2. unit test target if available
3. lint target file if available
4. `pnpm check` only at block end or if safe

Do not:
- full rebuild after every tiny patch
- cargo clean unless required
- run expensive gates repeatedly

Report exact command and result.
