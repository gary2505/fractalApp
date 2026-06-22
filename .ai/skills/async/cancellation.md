# Cancellation

Rules:
- cancel work when view closes or target changes
- ignore result after cancel
- cleanup listeners/timers
- expose user-safe cancel state

Use for:
- render
- scan
- AI request
- file load
- gate run

Do not:
- throw cancel as scary error to user
