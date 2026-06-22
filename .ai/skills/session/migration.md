# Session migration

Rules:
- migrations are versioned
- migration is pure function
- keep backup before destructive change
- fallback to safe default on invalid data

Do not:
- mutate unknown object blindly
- require newest schema to boot app
