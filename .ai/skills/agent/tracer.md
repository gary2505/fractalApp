# Tracer debugging

If lost, add evidence instead of more prompt.

Use tracer to see:
- action fired
- state before
- state after
- expected value
- actual value

Rules:
- temporary tracer must be removed before done
- permanent tracer must use `src/system/diag`
- never spam logs in loops
- never log secrets or file contents

Pattern:
1. add small tracer
2. reproduce
3. compare expected vs actual
4. patch
5. remove temporary tracer
