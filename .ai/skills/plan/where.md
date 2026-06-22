# Plan Location

Use:

```txt
.ai/   stable agent rules
plan/  feature plans, tests, metrics
src/   product code
```

Do not put feature plans in `.ai/skills`.

Good:

```txt
plan/settings-popup.md
```

Bad:

```txt
.ai/recipes/settings-popup.md
.ai/skills/settings-popup.md
```

Plan must include:

```txt
goal
scope
allowed files
forbidden files
skills to read
steps
tests
metrics
done
rollback
```
