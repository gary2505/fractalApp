# Safe mode

Safe mode should:
- boot Core
- skip risky component
- show recovery UI
- allow reset/rollback
- keep logs available

Do not:
- crash because settings are bad
- load optional extension before safety checks
