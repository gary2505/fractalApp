# Block AI Patch Rules

AI executor is a patch executor, not an architect.

## Required Prompt Fields

Every block task must define:

```txt
target block id
allowed files
forbidden files
gate to run
rollback path
```

## Patch Rules

```txt
One patch fixes one issue.
Read exact files only.
Do not scan whole repo.
Do not rewrite unrelated blocks.
Do not change Core unless explicitly allowed.
Do not change Shared UI unless task targets Shared UI.
Do not print full files when unified diff is enough.
```

## Token Rules

```txt
Read .ai/idx first when available.
Reuse summaries.
Avoid README/docs unless task needs them.
Do not re-read files already in context.
Use cheap model for search/summary.
Use strong model for final patch.
```

## Stop Rule

After patch and targeted gate:

```txt
stop
report result
do not continue redesigning
```
