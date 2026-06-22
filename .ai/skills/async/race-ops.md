# Race ops

Use when:
- same resource can be changed twice
- navigation can finish out of order
- save/load overlap

Rules:
- use per-key mutex or single-flight
- stale result must not overwrite newer state
- attach operation id/epoch
- last user intent wins unless queue is required

Do not:
- fix race with random timeout
