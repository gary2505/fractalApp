# Paths

Put code by responsibility.

```txt
src/system/   mechanics used by many features
src/shared/   UI/design/messages/icons/hotkeys
src/settings/ settings feature
plan/         feature plan + tests
.ai/          agent rules only
```

Never:

```txt
src/shared/system/*
src/settings/settings-session/*
.ai/recipes/*
```

Prefer:

```txt
src/system/input/click.ts
src/system/async/request.ts
src/settings/store.ts
plan/settings-popup.md
```
