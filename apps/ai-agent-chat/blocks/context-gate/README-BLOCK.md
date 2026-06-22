# Context Gate

Block ID: `ai-agent-chat.context-gate`

Status: skeleton only.

## Purpose

Selects minimal safe files/context.

## Rules

- no direct Tauri/Rust calls
- no direct filesystem access
- use CoreBridge and Policy later
- use Shared UI/messages/hotkeys/icons
- keep patch scope inside this block unless approved
