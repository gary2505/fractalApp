# AI Agent Chat Blocks

Each block is independently versioned and rollbackable.

## Blocks

| Block ID | Purpose |
| --- | --- |
| `ai-agent-chat.chat-popup` | Task input and control surface |
| `ai-agent-chat.context-gate` | Decides which files/context may be read |
| `ai-agent-chat.token-budget` | Estimates and limits token spend |
| `ai-agent-chat.model-router` | Chooses model by risk/cost/task |
| `ai-agent-chat.parallel-runner` | Runs roles in parallel safely |
| `ai-agent-chat.patch-planner` | Converts issue into exact patch scope |
| `ai-agent-chat.patch-review` | Reviews patch before apply |
| `ai-agent-chat.gate-runner` | Runs gates and summarizes result |
| `ai-agent-chat.error-memory` | Stores recurring mistake patterns |
| `ai-agent-chat.rule-improvement-proposals` | Proposes rule changes for approval |

## Rule

A bug in one block updates only that block.
Do not update the whole AI Agent Chat app for one block bug.
