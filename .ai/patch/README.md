# Fractal Patch

AI code changes must use this flow:

```txt
Issue -> Index -> Exact Lines -> Unified Diff -> Gate -> Audit
```

Rules:

```txt
Read .ai/idx first.
Read only exact 20-50 lines.
Return unified diff.
One patch fixes one issue.
No full-file rewrite.
No unrelated files.
Run gates after patch.
```
