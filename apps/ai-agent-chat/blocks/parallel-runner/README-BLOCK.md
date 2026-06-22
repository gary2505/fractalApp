# Parallel Runner

Block ID: `ai-agent-chat.parallel-runner`

Status: skeleton only.

## Purpose

Coordinates parallel agent roles safely.

## Rules

- no direct Tauri/Rust calls
- no direct filesystem access
- use CoreBridge and Policy later
- use Shared UI/messages/hotkeys/icons
- keep patch scope inside this block unless approved
