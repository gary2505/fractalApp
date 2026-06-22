# Tauri command

Rules:
- commands are thin
- validate input before work
- return typed result
- map errors to safe error shape
- no UI text in Rust command
- long work supports cancel/progress if possible

Do not:
- expose raw filesystem/native power to component
- bypass policy layer
