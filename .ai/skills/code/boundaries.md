# Code boundaries

Core rules:
- Core must boot alone.
- Web Components never call Tauri/Rust directly.
- Use CoreBridge -> Policy -> Core command.
- Feature code cannot own global contracts.
- Shared UI owns common UI behavior.

Do not:
- bypass Policy
- import feature code into Core
- make Core depend on one component
- put app logic inside random UI component
