# AI Agent Chat Parallel Agents

Parallel agents must not corrupt project state.

## Roles

- architect: plans scope only
- patch-executor: writes smallest diff
- reviewer: checks diff against contract
- tester: runs targeted gate/check
- debugger: investigates runtime/log issue
- summarizer: updates short state notes

## Safety

- only one patch-executor owns a write scope
- reviewer cannot apply patch
- tester cannot change source to make gates pass
- summarizer cannot change active rules
- rule changes become proposals first

## Merge rule

No parallel result is applied directly.
All outputs go through patch review, gate, audit, and rollback path.
