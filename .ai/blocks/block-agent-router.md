# block-agent-router

Goal: simplify agent workflow.

Main rule:

```txt
Evidence beats instructions.
```

Default flow:

```txt
small bug -> local search -> small patch -> small check -> proof -> stop
```

Big feature flow:

```txt
big feature -> plan -> max 1-3 skills -> small steps -> checks -> proof
```

Lost flow:

```txt
lost -> tracer -> inspect state -> compare expected/actual -> patch
```

This block replaces heavy ceremony with short routing.
Skills and plans are guardrails, not mandatory reading for every small fix.
