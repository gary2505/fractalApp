# Patch Planner

Block ID: `ai-agent-chat.patch-planner`

Status: skeleton only.

## Purpose

Builds exact allowed patch scope.

## Rules

- no direct Tauri/Rust calls
- no direct filesystem access
- use CoreBridge and Policy later
- use Shared UI/messages/hotkeys/icons
- keep patch scope inside this block unless approved
