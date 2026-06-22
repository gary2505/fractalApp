# Block Update and Rollback

Versioned Blocks allow safe small updates.

## Update Flow

```txt
Issue
-> identify block id
-> read block manifest
-> read exact files only
-> create unified diff
-> run block gate
-> update manifest version
-> write audit log
-> keep previous version pointer
```

## Rollback Flow

```txt
bad block version
-> disable candidate
-> restore previous version
-> run gate
-> write audit log
-> keep Core running
```

## Hard Rules

```txt
No whole-app rewrite for one block bug.
No silent update outside allowed scope.
No direct Core/Rust/Tauri access from block.
No rollback without audit event.
No version bump without gate result.
```

## Version Bump Rules

```txt
Patch bump: internal fix, same public API
Minor bump: compatible new behavior
Major bump: breaking API or manifest contract change
```

## Safe Failure

If block update fails:

```txt
Core continues running
Fractal App can be disabled
broken block shows error state
rollback remains available
logs explain exact block id and version
```
