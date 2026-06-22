# Rust file IO

Rules:
- normalize path through policy
- handle not found / denied / locked
- stream large files
- avoid blocking UI thread
- limit directory scan batches

Do not:
- read huge file into memory by default
- trust web component path directly
