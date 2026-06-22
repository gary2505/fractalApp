# AI Agent Chat Fractal App

Status: skeleton contract only.

## Goal

AI Agent Chat is the first real Fractal App after the foundation blocks.
It is an AI Agent Control Center for safe vibe coding with low token cost.

## Must do

- create and fix code through small verified patches
- minimize token usage by design
- route work to cheap or expensive models by task risk
- support multiple agents in parallel
- keep project state safe through gates and rollback
- learn from repeated mistakes through Error Memory

## Must not do yet

- call AI providers directly from UI components
- read whole repository by default
- edit Core/shared foundation without explicit scope
- silently apply patches outside allowed files
- change its own rules or permissions without approval

## Native access rule

```txt
AI Agent Chat component
-> CoreBridge
-> Policy
-> Allowed Service
-> Result
```

## First UI surface

The first UI surface is `chat-popup`.
It must stay small and use Shared UI only.

## Safety default

Default mode is plan/review first.
Patch apply needs gate/audit and optional user approval.
