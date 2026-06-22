# Patch Review

Block ID: `ai-agent-chat.patch-review`

Status: skeleton only.

## Purpose

Reviews diffs before apply.

## Rules

- no direct Tauri/Rust calls
- no direct filesystem access
- use CoreBridge and Policy later
- use Shared UI/messages/hotkeys/icons
- keep patch scope inside this block unless approved
