# Repo Map

Use this before searching.

```txt
.ai/          stable agent rules, skills, checks, repo index
plan/         feature plans, tests, metrics, done rules
src/system/   app-wide mechanics only
src/shared/   shared UI/design/messages/icons/hotkeys
src/settings/ settings feature code
src-tauri/    Rust/Tauri core only
```

## Boundaries

```txt
Web Component -> CoreBridge -> Policy -> Core command -> Rust
```

Never:

```txt
feature UI inside src/system
system mechanics inside feature folder
plan files inside .ai/skills
```
