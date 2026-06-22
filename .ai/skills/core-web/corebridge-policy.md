# Skill: CoreBridge + Policy

Use when component needs native/core action.

Flow:
`Component -> CoreBridge -> Policy -> Core command -> Rust command -> Result`

Rules:
- Validate every request before native call.
- Policy decides allowed scope.
- Return typed Result, never throw raw errors to UI.
- Log denied action with scope + reason.
- UI receives safe message key, not raw stack.
- Keep bridge API stable and versioned.

Forbidden:
- bypass Policy.
- expose unrestricted file/system access.
- return native error text directly to user.
