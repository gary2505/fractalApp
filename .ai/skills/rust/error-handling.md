# Rust error handling

Rules:
- use explicit error enum or safe string code
- keep user message outside Rust
- include operation id when useful
- log context, not secrets
- avoid panic in command path

Do not:
- unwrap user input
- return raw OS error directly to UI
