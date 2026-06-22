# AI Agent Chat Token Budget

Tokens are user money.

## Default rules

- read `.ai/idx` first
- read only files needed for the task
- never scan whole repo by default
- cap lines per task
- compress old context into short state notes
- prefer diffs over full code output
- choose cheap model for low-risk work
- use expensive model only when needed

## Cost classes

| Class | Use |
| --- | --- |
| `tiny` | text edit, rename, one small file |
| `small` | one component/service fix |
| `medium` | multi-file patch with known scope |
| `large` | architecture-sensitive change |
| `blocked` | scope too vague or too expensive |

## Required output

Before agent work starts, Token Budget must show:

```txt
estimated input tokens
estimated output tokens
risk level
model recommendation
files allowed to read
files forbidden to read
```
