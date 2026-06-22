# Fractal App Gates

Status: `foundation`

## Goal

Every Fractal App and important block must be checkable without running the full app.

## Gate levels

```txt
gate:fractal-app-contract
  validates contract/templates/docs

gate:<app-id>
  validates one Fractal App

gate:<app-id>:<block-id>
  validates one block
```

## Required checks

A Fractal App gate checks:

```txt
app.manifest.json exists
manifest JSON is valid
id is kebab-case
version is semver
permissions are explicit
messages EN/RU exist
hotkeys EN/RU exist or are explicitly empty
blocks listed in manifest exist
gates are listed
rollback section exists
```

A block gate checks:

```txt
block.manifest.json exists
block id starts with app id
version is semver
entry exists
permissions are explicit
dependsOn is explicit
gates are listed
rollback policy exists
```

## Gate behavior

```txt
fast
local
no network
no cargo clean
no full rebuild unless required
clear error messages
non-zero exit on failure
```

## Fast iteration mode

Per small patch:

```txt
run smallest relevant gate
avoid full rebuild
avoid cargo clean
```

At block end:

```txt
run pnpm gate
run pnpm check
run full app validation only once if needed
```

## Gate output format

Use simple output:

```txt
[gate:fractal-app-contract] ok
```

On failure:

```txt
[gate:fractal-app-contract] failed
missing file: docs/FRACTAL-APP-CONTRACT.md
```

## Agent rule

Agent must stop after patch + gate report.
Agent must not continue into unrelated cleanup.
