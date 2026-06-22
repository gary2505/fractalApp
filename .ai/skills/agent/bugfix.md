# Bugfix rules

Flow:
1. Reproduce mentally from report.
2. Locate smallest owner file.
3. Find root cause.
4. Patch only root cause.
5. Add guard only if needed.
6. Run smallest check.

Do not:
- fix symptoms in many places
- add new architecture
- change UX unless bug requires it
- delete fallback without replacement

Answer:
- cause
- changed files
- check result
