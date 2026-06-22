# Edit scope

Patch size:
- smallest possible
- one behavior per patch
- no opportunistic cleanup

Allowed:
- target file
- direct helper used by target
- test/check file if needed

Forbidden:
- global refactor during bugfix
- style rewrite during logic fix
- package changes unless task asks
- new dependency unless approved
