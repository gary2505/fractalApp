# Block gate

At block end:
- check manifest
- check imports
- run relevant typecheck
- run `pnpm check` if safe
- no cargo clean unless needed

Gate result:
- pass/fail
- command
- key error only
